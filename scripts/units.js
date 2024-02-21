export const siteConfig = {
  lang: {
    first: 'en',
    second: 'tc',
  },
  nav: 'nav',
  // header: 'header',
  footer: 'footer',
  popup: '/global/popups/external-link-popup',
};
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
  const newURL = match ? url : `/${secondLang}/${url}`;
  return newURL;
}

/**
 *
 * @param {*} parent  element
 * @param {*} link string
 */
export async function openLinkNewTab(parent, link) {
  parent.querySelectorAll(link).forEach((_link) => {
    if (_link.hasAttribute('target')) return;
    _link.setAttribute('target', '_blank');
  });
}

export async function setGcma() {
  // get GCMA code from MetaData
  const gcmaMeta = document.querySelector('meta[name=gcma-code]');
  const gcmaCode = gcmaMeta && gcmaMeta.getAttribute('content');

  if (gcmaCode) {
    const footerGcma = document.querySelector('footer .gcma-code');
    footerGcma.textContent = `${gcmaCode}`;
  }
}
