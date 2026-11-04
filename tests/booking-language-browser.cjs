// Run after installing Chromium with `npx playwright install chromium`.
// The booking iframe and external resources are mocked; no reservation is made.
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '../.vercel/output/static');
const mime = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  try {
    let relative = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (relative.endsWith('/')) relative += 'index.html';
    let file = path.resolve(root, '.' + relative);
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).on('error', () => res.writeHead(404).end()).pipe(res);
  } catch { res.writeHead(500).end(); }
});

const fakeFrame = `<!doctype html><html><body><span id="requests">0</span>
<button id="choose">Choose stay</button><button id="partial">Partial stay</button><button id="bad">Bad stay</button><script>
const query=new URLSearchParams(location.search);
let dates={checkIn:query.get('check_in')||'',checkOut:query.get('check_out')||''};
function send(){parent.postMessage({type:'hosthelper:booking:dates_changed',metadata:{...dates,email:'fake@example.invalid',token:'secret'}},'*')}
addEventListener('message',e=>{if(e.data?.type==='hosthelper:request-dates'){document.querySelector('#requests').textContent=String(Number(document.querySelector('#requests').textContent)+1);send()}});
document.querySelector('#choose').onclick=()=>{dates={checkIn:'2027-07-10',checkOut:'2027-07-13'};send()};
document.querySelector('#partial').onclick=()=>{dates={checkIn:'2027-07-10',checkOut:''};send()};
document.querySelector('#bad').onclick=()=>{dates={checkIn:'2027-07-13',checkOut:'2027-07-10'};send()};
</script></body></html>`;

async function languageMenu(page, width, language) {
  const mobile = width < 768;
  if (mobile) await page.locator('[data-menu-toggle]').click();
  const selector = page.locator(mobile ? '[data-mobile-menu] [data-language-selector]' : 'header .hidden.md\\:flex [data-language-selector]');
  await selector.locator('[data-lang-toggle]').click();
  return selector.locator(`[data-language-code="${language}"]`);
}

(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = 'http://127.0.0.1:' + server.address().port;
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      await page.route('**/*', route => {
        const url = new URL(route.request().url());
        if (url.origin === origin) return route.continue();
        if (url.origin === 'https://hosthelperai.com') return route.fulfill({ status: 200, contentType: 'text/html', body: fakeFrame });
        return route.abort();
      });

      await page.goto(origin + '/?lang=es&check_in=2027-06-10&check_out=2027-06-13&token=secret', { waitUntil: 'domcontentloaded' });
      await page.waitForURL(url => url.pathname === '/es', { waitUntil: 'domcontentloaded' });
      assert.equal(await page.locator('html').getAttribute('lang'), 'es');
      assert.equal(new URL(page.url()).searchParams.has('token'), false);
      const iframe = page.frameLocator('#hosthelper-booking');
      await page.waitForFunction(() => new URL(document.querySelector('#hosthelper-booking').src).searchParams.get('check_in') === '2027-06-10');
      let frameUrl = new URL(await page.locator('#hosthelper-booking').getAttribute('src'));
      assert.equal(frameUrl.searchParams.get('lang'), 'es');
      assert.equal(frameUrl.searchParams.get('check_out'), '2027-06-13');
      assert.equal(frameUrl.searchParams.has('token'), false);
      const english = await languageMenu(page, viewport.width, 'en');
      const href = await english.getAttribute('href');
      assert.match(href, /check_in=2027-06-10/);
      assert.match(href, /check_out=2027-06-13/);
      assert.match(href, /lang=en/);
      assert.doesNotMatch(href, /token/);
      await english.click();
      await page.waitForURL(url => url.pathname === '/' && url.searchParams.get('lang') === 'en', { waitUntil: 'domcontentloaded' });
      assert.equal(await page.locator('html').getAttribute('lang'), 'en');
      await page.waitForFunction(() => new URL(document.querySelector('#hosthelper-booking').src).searchParams.get('lang') === 'en');
      frameUrl = new URL(await page.locator('#hosthelper-booking').getAttribute('src'));
      assert.equal(frameUrl.searchParams.get('check_in'), '2027-06-10');
      assert.equal(frameUrl.searchParams.get('check_out'), '2027-06-13');

      await page.goto(origin + '/?lang=es&check_in=2027-02-29&check_out=2027-03-03&email=fake%40example.invalid', { waitUntil: 'domcontentloaded' });
      await page.waitForURL(url => url.pathname === '/es', { waitUntil: 'domcontentloaded' });
      const redir = new URL(page.url());
      assert.equal(redir.searchParams.has('email'), false);
      assert.equal(redir.searchParams.has('check_in'), false);

      await page.goto(origin + '/?token=secret#booking-widget', { waitUntil: 'domcontentloaded' });
      let count = 0;
      for (let i = 0; i < 60; i++) {
        count = Number(await iframe.locator('#requests').textContent());
        if (count > 0) break;
        await page.waitForTimeout(50);
      }
      assert.ok(count > 0, 'The iframe receives a date handshake');
      await iframe.locator('#choose').click();
      await page.waitForFunction(() => document.querySelector('[data-language-code="es"]').getAttribute('href').includes('check_in=2027-07-10'));
      const spanishHref = await page.locator('[data-language-code="es"]').first().getAttribute('href');
      assert.equal(spanishHref, '/es?check_in=2027-07-10&check_out=2027-07-13&lang=es#booking-widget');
      await iframe.locator('#bad').click();
      await page.waitForTimeout(100);
      assert.equal(await page.locator('[data-language-code="es"]').first().getAttribute('href'), spanishHref);
      await page.evaluate(() => {
        const frame = document.querySelector('#hosthelper-booking');
        const data = { type: 'hosthelper:booking:dates_changed', metadata: { checkIn: '2028-01-01', checkOut: '2028-01-02' } };
        window.dispatchEvent(new MessageEvent('message', { origin: 'https://malicious.invalid', source: frame.contentWindow, data }));
        window.dispatchEvent(new MessageEvent('message', { origin: 'https://hosthelperai.com', source: window, data }));
      });
      assert.equal(await page.locator('[data-language-code="es"]').first().getAttribute('href'), spanishHref);
      await iframe.locator('#partial').click();
      await page.waitForFunction(() => !document.querySelector('[data-language-code="es"]').getAttribute('href').includes('check_in'));
      assert.equal(await page.locator('[data-language-code="es"]').first().getAttribute('href'), '/es#booking-widget');
      await iframe.locator('#choose').click();
      await page.waitForFunction(() => document.querySelector('[data-language-code="es"]').getAttribute('href').includes('check_in=2027-07-10'));
      await (await languageMenu(page, viewport.width, 'es')).click();
      await page.waitForURL(url => url.pathname === '/es' && url.searchParams.get('check_in') === '2027-07-10', { waitUntil: 'domcontentloaded' });
      const selected = new URL(page.url());
      assert.equal(selected.searchParams.get('check_out'), '2027-07-13');
      assert.equal(selected.searchParams.has('token'), false);
      assert.equal(selected.hash, '#booking-widget');
      console.log(`Booking language and live date selection passed at ${viewport.width}px`);
      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
})().catch(error => { console.error(error.message); server.close(); process.exitCode = 1; });
