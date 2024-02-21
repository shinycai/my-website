import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import {
  siteConfig,
  setSharePointFileURL,
  openLinkNewTab,
} from '../../scripts/units.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  // const footerPath = cfg.footer || '/footer';
  const footerPath = setSharePointFileURL(siteConfig.footer, siteConfig.lang.second);
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;

    [...footer.querySelectorAll(':scope .columns > div:last-child a')].forEach((link) => {
      link.setAttribute('target', '_blank');
    });

    decorateIcons(footer);
    block.append(footer);
  }
}
