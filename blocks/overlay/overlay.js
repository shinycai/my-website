/* libraryfranklinpfizer-skip-checks */
import {
  platformCreateMarkup,
  platformOutputMarkup,
  trapTabAccessibilityFocus,
} from '../../scripts/core-utilities.js';
import { fetchPlaceholders, decorateButtons } from '../../scripts/lib-franklin.js';
import { fetchFirstValidPath } from '../../scripts/pfizer-utilities.js';

const markupCallback = async (block) => {
  // allow for custom placeholders to be used or fallback to default
  const placeholders = await fetchPlaceholders('');
  const { popupClose, popupContinue, popupCancel } = {
    popupClose: placeholders.popupClose || 'Close popup',
    popupContinue: placeholders.popupContinue || 'Continue',
    popupCancel: placeholders.popupCancel || 'Cancel',
  };

  const originalContent = block.querySelector('.core-overlay-inside');

  const wrapper = document.createElement('div');
  wrapper.className = 'core-overlay-wrapper';

  const header = originalContent.firstElementChild ?? document.createElement('div');
  header.className = 'section core-overlay-header';

  const closeOverlay = () => {
    document.body.style.overflowY = '';
    block.close();
  };

  header?.querySelector('h1, h2, h3')?.classList.add('accent');

  const closeButton = document.createElement('button');
  closeButton.setAttribute('type', 'button');
  closeButton.className = 'core-overlay-close';
  closeButton.setAttribute('aria-label', popupClose);
  closeButton.setAttribute('title', popupClose);
  closeButton.setAttribute('tabindex', '0');
  closeButton.addEventListener('click', closeOverlay);

  header.append(closeButton);

  const body = document.createElement('div');
  body.className = 'section core-overlay-body';
  // console.log('originalContent.innerHTML', originalContent.innerHTML);
  body.append(originalContent.children[1]);

  const footer = block.dataset.destination ? document.createElement('div') : originalContent.lastElementChild;
  footer.className = 'section core-overlay-footer';

  if (block.dataset.destination) {
    const link = document.createElement('a');
    link.className = 'button primary';
    link.href = block.dataset.destination;
    link.setAttribute('rel', 'noreferrer');
    link.setAttribute('target', '_blank');

    const linkSpan = document.createElement('span');
    linkSpan.textContent = popupContinue;

    link.append(linkSpan);

    link.addEventListener('click', closeOverlay);

    const footerCloseButton = document.createElement('button');
    footerCloseButton.className = 'button secondary';
    footerCloseButton.textContent = popupCancel;
    footerCloseButton.setAttribute('type', 'button');
    footerCloseButton.setAttribute('aria-label', popupClose);
    footerCloseButton.addEventListener('click', closeOverlay);

    const footerButtonWrapper = document.createElement('p');
    footerButtonWrapper.className = 'button-container button-container-multi';
    footerButtonWrapper.append(link, footerCloseButton);

    footer.append(footerButtonWrapper);
  }

  const content = document.createElement('div');
  content.className = 'core-overlay-content';
  content.append(header, body);
  if (footer.hasChildNodes()) content.append(footer);

  decorateButtons(content);

  wrapper.append(content);

  block.replaceChildren(wrapper);

  const backdrop = document.createElement('div');
  backdrop.className = 'core-overlay-backdrop';

  block.style.removeProperty('display');

  block.append(backdrop);

  const backgroundContent = document.querySelector('body');
  backgroundContent.setAttribute('aria-hidden', 'true');

  // Add event listener to trap focus inside the modal
  trapTabAccessibilityFocus(block);
};

export default async function decorate(block) {
  const { paths } = block.dataset;
  const pathSplit = paths.split(',');

  const pathsByHtmlPath = pathSplit.map((path) => `${path.trim()}.plain.html`);
  const platformFetch = pathSplit.length ? await fetchFirstValidPath(pathsByHtmlPath) : undefined;
  // console.log('block.dataset', block.dataset, pathsByHtmlPath, platformFetch);
  // error but still show overlay with fallback text
  if (!platformFetch) {
    console.info('fetchFirstValidPath no pages found: ', paths);
  }

  const fallbackHtml = `<div><h2>Do you want to leave this site?</h2></div><div><p><br></p></div>`;

  const overlayHtml = platformFetch || fallbackHtml;

  const renderMarkup = await platformCreateMarkup('overlay', overlayHtml);
  // console.log('overlayHtml', overlayHtml);
  // console.log('renderMarkup', renderMarkup);
  await platformOutputMarkup(block, renderMarkup, markupCallback
  //   {
  //   smartcapture: [
  //     {
  //       smName: 'overlay',
  //     },
  //     {
  //       selector: '.core-overlay-close',
  //       smName: 'overlay-close',
  //       event: 'click',
  //     },
  //   ],
  // }
  );
}
