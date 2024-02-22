import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import {
  siteConfig,
  setSharePointFileURL,
  openLinkNewTab,
  setGcma,
  backToTop,
} from '../../scripts/units.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || setSharePointFileURL(siteConfig.footer, siteConfig.lang.second);
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;

    // open link in new tab
    openLinkNewTab(footer, ':scope .columns > div:last-child a');

    // set gcma code
    const gcma = footer.querySelector(':scope .columns > div:last-child > div:nth-last-child(2) > p:last-child u');
    if (gcma) {
      gcma.classList.add('gcma-code');
    }

    decorateIcons(footer);
    block.append(footer);

    // override after load
    if (gcma) {
      setGcma();
    }

    // back to top
    const backToTopBtn = block.querySelector(':scope >div>div>p');
    backToTopBtn.classList.add('footer-back-top');
    backToTop(block);
  }
}
