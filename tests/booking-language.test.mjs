import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { applyLanguageLinks, buildGoogleVrBookingUrl, handleBookingDatesMessage, requestBookingDates } from '../public/google-vr-booking-link.js';

const base = await readFile(new URL('../src/layouts/Base.astro', import.meta.url), 'utf8');
const redirectScript = base.match(/<script is:inline>\s*([\s\S]*?)\s*<\/script>/)?.[1];
assert.ok(redirectScript, 'The early language redirect script is present');

function redirect({ path = '/', search = '', hash = '', language = 'en' } = {}) {
  let destination = null;
  const location = { pathname: path, search, hash, replace(value) { destination = value; } };
  runInNewContext(redirectScript, { window: { location }, document: { documentElement: { lang: language } }, URLSearchParams });
  return destination;
}

function link(href, language) {
  const attrs = { href, 'data-language-code': language };
  return { getAttribute: key => attrs[key], setAttribute: (key, value) => { attrs[key] = value; } };
}

function languageLinks(search, hash = '') {
  const links = [link('/', 'en'), link('/es', 'es')];
  applyLanguageLinks({ querySelectorAll: () => links }, search, false, hash);
  return links.map(item => item.getAttribute('href'));
}

test('explicit incoming language selects the matching page while preserving a valid stay', () => {
  assert.equal(redirect({ search: '?lang=es&check_in=2027-06-10&check_out=2027-06-13', hash: '#booking-widget' }),
    '/es?check_in=2027-06-10&check_out=2027-06-13&lang=es#booking-widget');
  assert.equal(redirect({ path: '/es', language: 'es', search: '?lang=en&check_in=2027-06-10&check_out=2027-06-13' }),
    '/?check_in=2027-06-10&check_out=2027-06-13&lang=en');
});

test('redirect drops invalid dates, private parameters and unknown fragments', () => {
  assert.equal(redirect({ search: '?lang=es&check_in=2027-02-29&check_out=2027-03-03&email=guest%40example.com&token=secret', hash: '#private-token' }), '/es?lang=es');
  assert.equal(redirect({ search: '?lang=es&check_in=2027-06-13&check_out=2027-06-10' }), '/es?lang=es');
  assert.equal(redirect({ search: '?lang=es&contact=success&token=secret' }), '/es?contact=success&lang=es');
});

test('matching, missing or unsupported language and non-home pages never redirect', () => {
  assert.equal(redirect({ search: '?lang=en' }), null);
  assert.equal(redirect(), null);
  assert.equal(redirect({ search: '?lang=fr' }), null);
  assert.equal(redirect({ path: '/es/', language: 'es', search: '?lang=es' }), null);
  assert.equal(redirect({ path: '/projects', search: '?lang=es' }), null);
});

test('language switch retains only a valid stay and the language chosen', () => {
  assert.deepEqual(languageLinks('?check_in=2027-06-10&check_out=2027-06-13&lang=es&token=secret&email=guest'), [
    '/?check_in=2027-06-10&check_out=2027-06-13&lang=en',
    '/es?check_in=2027-06-10&check_out=2027-06-13&lang=es',
  ]);
  assert.deepEqual(languageLinks('?check_in=2027-02-29&check_out=2027-03-03&lang=en'), ['/?lang=en', '/es?lang=es']);
  assert.deepEqual(languageLinks('?contact=error&token=secret'), ['/?contact=error&lang=en', '/es?contact=error&lang=es']);
  assert.deepEqual(languageLinks(''), ['/', '/es']);
  assert.deepEqual(languageLinks('?token=secret'), ['/', '/es']);
  assert.deepEqual(languageLinks('', '#booking-widget'), ['/#booking-widget', '/es#booking-widget']);
  assert.deepEqual(languageLinks('?token=secret', '#private-token'), ['/', '/es']);
});

test('booking URL receives only a valid itinerary and supported language', () => {
  const baseUrl = 'https://hosthelperai.com/book/casa-maria-flora?lang=en';
  const result = new URL(buildGoogleVrBookingUrl(baseUrl, '?check_in=2027-06-10&check_out=2027-06-13&lang=es&token=secret'));
  assert.equal(result.searchParams.get('lang'), 'es');
  assert.equal(result.searchParams.get('check_in'), '2027-06-10');
  assert.equal(result.searchParams.get('check_out'), '2027-06-13');
  assert.equal(result.searchParams.has('token'), false);
  const invalid = new URL(buildGoogleVrBookingUrl(baseUrl, '?check_in=2027-02-29&check_out=2027-03-03'));
  assert.equal(invalid.searchParams.has('check_in'), false);
  assert.throws(() => buildGoogleVrBookingUrl('https://hosthelperai.com.evil.example/book/x', '?lang=en'));
});

test('calendar dates update both language links without forwarding private data', () => {
  const links = [link('/', 'en'), link('/es', 'es')];
  const document = { querySelectorAll: () => links };
  const childWindow = {};
  const iframe = { contentWindow: childWindow };
  const event = { origin: 'https://www.hosthelperai.com', source: childWindow,
    data: { type: 'hosthelper:booking:dates_changed', metadata: {
      checkIn: '2027-07-10', checkOut: '2027-07-13', email: 'guest@example.invalid', token: 'secret',
    } } };
  assert.equal(handleBookingDatesMessage(document, event, iframe,
    '?lang=en&check_in=2027-06-01&check_out=2027-06-03&token=secret'), true);
  assert.deepEqual(links.map(item => item.getAttribute('href')), [
    '/?check_in=2027-07-10&check_out=2027-07-13&lang=en',
    '/es?check_in=2027-07-10&check_out=2027-07-13&lang=es',
  ]);
  event.data.metadata.checkOut = '';
  assert.equal(handleBookingDatesMessage(document, event, iframe,
    '?lang=en&check_in=2027-06-01&check_out=2027-06-03'), true);
  assert.deepEqual(links.map(item => item.getAttribute('href')), ['/?lang=en', '/es?lang=es']);
  event.data.metadata.checkIn = '';
  assert.equal(handleBookingDatesMessage(document, event, iframe, '', '#booking-widget'), true);
  assert.deepEqual(links.map(item => item.getAttribute('href')), ['/#booking-widget', '/es#booking-widget']);
});

test('untrusted, malformed and invalid date messages never alter the language links', () => {
  const links = [link('/?lang=en#booking-widget', 'en'), link('/es?lang=es#booking-widget', 'es')];
  const document = { querySelectorAll: () => links };
  const childWindow = {};
  const iframe = { contentWindow: childWindow };
  const good = { origin: 'https://hosthelperai.com', source: childWindow,
    data: { type: 'hosthelper:booking:dates_changed', metadata: { checkIn: '2027-07-10', checkOut: '2027-07-13' } } };
  assert.equal(handleBookingDatesMessage(document, { ...good, origin: 'https://hosthelperai.com.evil.example' }, iframe, ''), false);
  assert.equal(handleBookingDatesMessage(document, { ...good, source: {} }, iframe, ''), false);
  assert.equal(handleBookingDatesMessage(document, { ...good, data: { ...good.data, metadata: { checkIn: '2027-02-29', checkOut: '' } } }, iframe, ''), false);
  assert.equal(handleBookingDatesMessage(document, { ...good, data: { ...good.data, metadata: { checkIn: '2027-07-13', checkOut: '2027-07-10' } } }, iframe, ''), false);
  assert.deepEqual(links.map(item => item.getAttribute('href')), ['/?lang=en#booking-widget', '/es?lang=es#booking-widget']);
  assert.equal(handleBookingDatesMessage(document, good, iframe, ''), true);
  assert.deepEqual(links.map(item => item.getAttribute('href')), [
    '/?check_in=2027-07-10&check_out=2027-07-13&lang=en#booking-widget',
    '/es?check_in=2027-07-10&check_out=2027-07-13&lang=es#booking-widget',
  ]);
});

test('date handshake targets only the two allowed Host Helper origins', () => {
  const calls = [];
  requestBookingDates({ contentWindow: { postMessage: (message, origin) => calls.push({ message, origin }) } });
  assert.deepEqual(calls, [
    { message: { type: 'hosthelper:request-dates' }, origin: 'https://hosthelperai.com' },
    { message: { type: 'hosthelper:request-dates' }, origin: 'https://www.hosthelperai.com' },
  ]);
});
