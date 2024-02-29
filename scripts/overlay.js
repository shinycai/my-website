import { decorateBlock, loadBlock } from './lib-franklin.js';
import setupExtLinks from './ext-links.js';

function buildOverlay(id, paths, destination) {
  const overlay = document.createElement('dialog');
  overlay.id = id;
  overlay.className = 'overlay';
  overlay.dataset.paths = paths;
  overlay.style.display = 'none';

  if (destination) {
    overlay.dataset.destination = destination;
  }

  decorateBlock(overlay);
  loadBlock(overlay);

  return overlay;
}

async function handleOverlayClick(event, link) {
  event.preventDefault();

  const { href, pathname } = new URL(link.href);
  const isExternal = link.hasAttribute('data-external-link-popup');
  const id = isExternal ? `overlay-external-link--${href}` : pathname.slice(1);

  if (!document.getElementById(id)) {
    const paths = isExternal ? '/global/popups/external-link-popup, /global/popups/external-link, /overlays/external-link' : pathname;
    const destination = isExternal && link.href;
    document.body.append(buildOverlay(id, paths, destination));
  }

  document.body.style.overflowY = 'hidden';
  document.getElementById(id).show();
}

export default async function setupOverlays(doc) {
  await setupExtLinks(doc.querySelector('body'));
  if (doc.querySelector('header')) {
    await setupExtLinks(doc.querySelector('header'));
  }

  const queryConditions = `a[data-external-link-popup], a[href^="/overlay"]`;
  const links = [...document.querySelectorAll(queryConditions)];
  links.forEach((link) => {
    link.addEventListener('click', (event) => handleOverlayClick(event, link));
    link.setAttribute('data-smartcapture', 'overlay-open');
    link.setAttribute('data-smartcapture-event', 'click');
  });
}
