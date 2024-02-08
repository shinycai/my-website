/**
 *
 * @param {*} lang
 * @returns match: true or false
 */
export function language(lang = 'en') {
  const currentURL = window.location.href;
  const languageRegex = new RegExp(`\/${lang}\/`, 'i'); // /\/(en)\//
  const match = currentURL.match(languageRegex);
  return !match;
}

/**
 *
 * @param {*} langs
 */
export function setDocLang(langs = { first: 'en', second: '' }) {
  const { first, second } = langs;
  const match = language(second);
  if (second !== '') {
    document.documentElement.lang = match ? first : second;
  }
}

/**
 *
 * @param {*} url
 * @param {*} secondLang
 * @returns
 */
export function setSharePointFileURL(url, secondLang) {
  const match = language(secondLang);
  const newURL = match ? url : `/${secondLang}${url}`;
  return newURL;
}

const siteConfig = {
  lang: {
    first: 'zh-hant',
    second: 'en',
  },
  header: '/global/header',
  footer: '/global/footer',
  popup: '/global/popups/external-link-popup',
};

setDocLang(siteConfig.lang);
setSharePointFileURL(siteConfig.header, siteConfig.lang.second);
