// Optional module for property websites embedding the Host Helper booking engine.
// Forward only the supported itinerary fields; never copy guest or auth tokens.
export function buildGoogleVrBookingUrl(bookingUrl, landingSearch) {
  const url = new URL(bookingUrl);
  if (url.protocol !== 'https:' ||
      !['hosthelperai.com', 'www.hosthelperai.com'].includes(url.hostname) ||
      !url.pathname.startsWith('/book/')) {
    throw new Error('Expected a Host Helper booking URL');
  }
  const params = new URLSearchParams(landingSearch);
  const checkIn = params.get('check_in');
  const checkOut = params.get('check_out');
  const validDate = value => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const date = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  };
  if (validDate(checkIn) && validDate(checkOut) && checkOut > checkIn) {
    url.searchParams.set('check_in', checkIn);
    url.searchParams.set('check_out', checkOut);
  }
  const language = params.get('lang');
  if (language === 'en' || language === 'es') url.searchParams.set('lang', language);
  return url.href;
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
  applyGoogleVrBookingLinks(document, window.location.search);
}
