import { ui, defaultLang } from './ui';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(url: URL) {
  const lang = getLangFromUrl(url);
  return function translatePath(path: string, l: string = lang) {
    const homePath = l === defaultLang ? '/' : `/${l}/`;
    if (path.startsWith('/#') && (url.pathname === homePath || url.pathname + '/' === homePath)) {
      return path.slice(1);
    }
    const pathName = path.startsWith('/') ? path : `/${path}`;
    return l === defaultLang ? pathName : `/${l}${pathName}`;
  };
}

export function getLocalizedUrl(url: URL, lang: string) {
  const pathWithoutLang = url.pathname.replace(/^\/(en|es|nl)/, '');
  const cleanPath = pathWithoutLang.startsWith('/') ? pathWithoutLang : `/${pathWithoutLang}`;
  if (lang === defaultLang) return cleanPath || '/';
  return `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
}
