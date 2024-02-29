import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
  decorateLinkedPictures,
  decorateSpecialSymbol,
  createOptimizedPicture,
} from './lib-franklin.js';

import {
  siteConfig,
  setDocLang,
  setSharePointFileURL,
} from './units.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list
/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (
    h1 &&
    picture &&
    h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING
  ) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes('localhost')) {
      sessionStorage.setItem('fonts-loaded', 'true');
    }
  } catch (e) {
    // do nothing
  }
}

function autolinkModals(element) {
  element.addEventListener('click', async (e) => {
    const origin = e.target.closest('a');

    if (origin && origin.href && origin.href.includes('/modals/')) {
      e.preventDefault();
      const { openModal } = await import(`${window.hlx.codeBasePath}/blocks/modal/modal.js`);
      openModal(origin.href);
    }
  });
}

async function handle404() {
  if (window.errorCode === '404') {
    const notFoundPath = setSharePointFileURL(siteConfig.notFound, siteConfig.lang.second);
    const resp = await fetch(`${notFoundPath}.plain.html`);
    if (resp.status === 200) {
      const html = await resp.text();
      const main = document.querySelector('main');
      main.innerHTML = html;
      main.classList.remove('error');
      const title = document.querySelector('meta[name=title]');
      const description = document.querySelector('meta[name=description]');
      const gcmaCode = document.querySelector('meta[name=gcma-code]');
      const titleVal = document.querySelector('.seo-info ul > li:first-child').innerText;
      const descriptionVal = document.querySelector('.seo-info ul > li:nth-child(2)').innerText;
      const gcmaNum = document.querySelector('.seo-info ul > li:nth-child(3)').innerText;
      title.content = titleVal;
      description.content = descriptionVal;
      gcmaCode.content = gcmaNum;
    }
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateLinkedPictures(main);

  // hopefully forward compatible button decoration
  decorateSections(main);
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateBlocks(main);
  decorateSpecialSymbol(main);
  main.querySelectorAll('img').forEach((img) => {
    img
      .closest('picture')
      .replaceWith(createOptimizedPicture(img.src, img.alt, false));
  });
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  // document.documentElement.lang = 'en';
  setDocLang(siteConfig.lang);
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  autolinkModals(doc);

  const main = doc.querySelector('main');
  /** header first load before block loaded */
  loadFonts();
  await loadHeader(doc.querySelector('header'));
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);

  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await handle404();
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
