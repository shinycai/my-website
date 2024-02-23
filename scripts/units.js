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

/** back to top */
function display(dom, visibleHeight = 350) {
  const contentHeight = document.body.clientHeight;
  const windowHeight = window.innerHeight;

  if (contentHeight - windowHeight > visibleHeight) {
    if (window.scrollY >= visibleHeight) {
      if (dom.classList.contains('invisible')) dom.classList.remove('invisible');
    } else if (!dom.classList.contains('invisible')) {
      dom.classList.add('invisible');
    }
  }
}

function positionFix(dom, fixTarget) {
  const contentHeight = document.body.clientHeight;
  const windowHeight = window.innerHeight;
  const targetHeight = fixTarget ? fixTarget.clientHeight : 0;

  if (contentHeight - windowHeight - targetHeight + dom.clientHeight < window.scrollY) {
    dom.classList.remove('fixed');
  } else {
    dom.classList.add('fixed');
  }
}

export async function backToTop(footerBlock) {
  const toTopDom = footerBlock.querySelector(':scope .footer-back-top span');
  const fixTarget = footerBlock;

  toTopDom.classList.add('invisible');
  toTopDom.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });

  function moveTopHandler() {
    display(toTopDom);
    positionFix(toTopDom, fixTarget);
  }

  let timer = null;
  window.addEventListener('scroll', moveTopHandler);
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(moveTopHandler, 200);
  });
}

/** create form */
export function renderFieldType(item, type, name, value, id) {
  const text = item.innerHTML;
  const fieldHtml = `<input type="${type}" class="field-type-${type}" value="${value}" id="${id}" name="${name}"><label for="${id}">${text}</label>`;
  item.innerHTML = fieldHtml;
}

export async function createForm(block, config = { name: 'myForm' }) {
  const form = document.createElement('form');
  form.classList.add(config.name);
  form.setAttribute('id', config.name);
  form.setAttribute('novalidate', 'novalidate');
  block.append(form);

  [...block.querySelectorAll(':scope >div')].forEach((dom) => {
    const domClone = dom.cloneNode(true);
    form.append(domClone);
    dom.remove();
  });
}
