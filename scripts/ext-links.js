import {
  fetchFirstValidPath,
} from './pfizer-utilities.js';

/**
 * sanitize domain strings
 */
const extractDomain = (url) => {
  const domainSanitized = url
    .toLocaleLowerCase()
    .trim()
    .replace(/^(https?:)?\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/.*$/, '');

  const domainRegex = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  if (!domainRegex.test(domainSanitized) && !domainSanitized.startsWith('localhost') && url.startsWith('http')) {
    console.error('Invalid domain: ', url);
    return false;
  }
  return domainSanitized;
};

/**
 * Sets up data-external-link-popup attribute on external links
 */
export default async function setupExtLinks(root) {
  const urls = ['/global/popups/external-link-allowlist.json', '/global/popups/ext-link-whitelist.json', '/global/ext-link-whitelist.json'];
  let whitelistedDomains = [];

  if (window?.whitelistedDomains) {
    whitelistedDomains = window.whitelistedDomains;
  }

  const getWhitelist = window?.whitelistedDomains ?? (await fetchFirstValidPath(urls, true));

  if (getWhitelist?.data) {
    // map & store as window variable
    whitelistedDomains = getWhitelist?.data.map((obj) => extractDomain(obj.domains || ''));
    window.whitelistedDomains = whitelistedDomains;
  } else if (!window?.whitelistedDomains) {
    console.log('whitelisted domains paths not available defaulting to []');
  }

  // return if not needed
  if (!root || !root.querySelector('a[href*="//"]')) {
    console.info('root not available for wrt test');
    return;
  }

  const links = root.querySelectorAll('a[href*="//"]');

  const currentHost = window.location.host;

  // ensure we have what we need...
  // console.log('🚀 whitelistedDomains :', whitelistedDomains);

  [...links].forEach((link) => {
    try {
      const domain = extractDomain(link.href);
      if (domain !== currentHost) {
        if (!whitelistedDomains.includes(domain)) {
          link.setAttribute('data-external-link-popup', '');
        } else {
          link.setAttribute('target', '_blank');
        }
      }
    } catch (ex) {
      console.error('Failed to setup data-external-link-popup attribute.', link.href, ex);
    }
  });
}
