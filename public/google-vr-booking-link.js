// Optional module for property websites embedding the Host Helper booking engine.
// Forward only the supported itinerary fields; never copy guest or auth tokens.
const validDate = value => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
};

const validStay = params => {
  const checkIn = params.get('check_in');
  const checkOut = params.get('check_out');
  return validDate(checkIn) && validDate(checkOut) && checkOut > checkIn
    ? { checkIn, checkOut } : null;
};

const BOOKING_ORIGINS = ['https://hosthelperai.com', 'https://www.hosthelperai.com'];
const PAGE_ANCHORS = ['#booking-widget', '#booking', '#features', '#gallery', '#faq', '#about-us', '#contact'];

export function buildGoogleVrBookingUrl(bookingUrl, landingSearch) {
  const url = new URL(bookingUrl);
  if (url.protocol !== 'https:' ||
      !['hosthelperai.com', 'www.hosthelperai.com'].includes(url.hostname) ||
      !url.pathname.startsWith('/book/')) {
    throw new Error('Expected a Host Helper booking URL');
  }
  const params = new URLSearchParams(landingSearch);
  const stay = validStay(params);
  if (stay) {
    url.searchParams.set('check_in', stay.checkIn);
    url.searchParams.set('check_out', stay.checkOut);
  }
  const language = params.get('lang');
  if (language === 'en' || language === 'es') url.searchParams.set('lang', language);
  return url.href;
}

export function applyLanguageLinks(document, search, force = false, hash = '') {
  const incoming = new URLSearchParams(search);
  const stay = validStay(incoming);
  const requestedLanguage = incoming.get('lang');
  const contact = incoming.get('contact');
  const contactStatus = contact === 'success' || contact === 'error' ? contact : null;
  const anchor = PAGE_ANCHORS.includes(hash) ? hash : '';
  // Keep the original clean URLs when no booking or language was supplied.
  if (!force && !stay && !['en', 'es'].includes(requestedLanguage) && !contactStatus && !anchor) return;
  for (const link of document.querySelectorAll('[data-language-selector] a[data-language-code]')) {
    const language = link.getAttribute('data-language-code');
    const href = link.getAttribute('href');
    if (!href || !['en', 'es'].includes(language)) continue;
    const target = new URL(href, 'https://example.invalid');
    if (target.origin !== 'https://example.invalid') continue;
    target.search = '';
    if (stay) {
      target.searchParams.set('check_in', stay.checkIn);
      target.searchParams.set('check_out', stay.checkOut);
    }
    if (contactStatus) target.searchParams.set('contact', contactStatus);
    if (stay || ['en', 'es'].includes(requestedLanguage) || contactStatus) target.searchParams.set('lang', language);
    if (anchor) target.hash = anchor;
    link.setAttribute('href', `${target.pathname}${target.search}${target.hash}`);
  }
}

export function handleBookingDatesMessage(document, event, iframe, search, hash = '') {
  if (!iframe?.contentWindow || !BOOKING_ORIGINS.includes(event.origin) || event.source !== iframe.contentWindow) return false;
  if (!event.data || event.data.type !== 'hosthelper:booking:dates_changed') return false;
  const { checkIn, checkOut } = event.data.metadata || {};
  if (typeof checkIn !== 'string' || typeof checkOut !== 'string') return false;
  if ((checkIn && !validDate(checkIn)) || (checkOut && !validDate(checkOut))) return false;
  if (checkIn && checkOut && checkOut <= checkIn) return false;
  const params = new URLSearchParams(search);
  params.delete('check_in');
  params.delete('check_out');
  if (checkIn && checkOut) {
    params.set('check_in', checkIn);
    params.set('check_out', checkOut);
  }
  // Even an incomplete selection must clear any dates from the original URL.
  applyLanguageLinks(document, params.toString(), true, hash);
  return true;
}

export function requestBookingDates(iframe) {
  if (!iframe?.contentWindow) return;
  for (const origin of BOOKING_ORIGINS) {
    iframe.contentWindow.postMessage({ type: 'hosthelper:request-dates' }, origin);
  }
}

export function applyGoogleVrBookingLinks(document, search) {
  const params = new URLSearchParams(search);
  const pageLanguage = document.documentElement?.lang;
  if (!params.has('lang') && (pageLanguage === 'en' || pageLanguage === 'es')) {
    params.set('lang', pageLanguage);
  }
  for (const iframe of document.querySelectorAll('iframe#hosthelper-booking, iframe[data-hosthelper-booking]')) {
    const original = iframe.getAttribute('src');
    if (!original) continue;
    try {
      const next = buildGoogleVrBookingUrl(original, params.toString());
      if (next !== original) iframe.setAttribute('src', next);
    } catch { /* Unrelated frames are left untouched. */ }
  }
  for (const link of document.querySelectorAll('a[href]')) {
    const original = link.getAttribute('href');
    if (!original) continue;
    try {
      const next = buildGoogleVrBookingUrl(original, params.toString());
      if (next !== original) link.setAttribute('href', next);
    } catch { /* Unrelated links are left untouched. */ }
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  applyLanguageLinks(document, window.location.search, false, window.location.hash);
  applyGoogleVrBookingLinks(document, window.location.search);
  const iframe = document.querySelector('iframe#hosthelper-booking');
  if (iframe) {
    window.addEventListener('message', event => {
      handleBookingDatesMessage(document, event, iframe, window.location.search, window.location.hash);
    });
    iframe.addEventListener('load', () => requestBookingDates(iframe));
    requestBookingDates(iframe);
  }
}
