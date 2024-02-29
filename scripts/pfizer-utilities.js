/**
 * Gets the value of a cookie
 * @param name {string} name
 * @returns {string|undefined}
 */
export function getCookie(name) {
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.trim().startsWith(`${name}=`))
    ?.split('=')[1];
  return cookieValue && decodeURIComponent(cookieValue);
}

/**
 * Tries to fetch JSON data from a list of URLs in sequence and returns the data from the first successful fetch.
 * @param {string[]} urls - An array of URLs to fetch from.
 * @returns {Promise<any>} The JSON data from the first successful fetch, or null if all fail.
 */
export async function fetchFirstValidPath(urls, isJson = false) {
  // check if typeof is array
  if (!Array.isArray(urls)) {
    console.error('urls not array');
    return null;
  }

  return urls.reduce(async (prevPromise, url) => {
    const prevData = await prevPromise;
    if (prevData) {
      return prevData;
    }
    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = isJson ? await response.json() : await response.text();
        return data;
      }
      console.info(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.info('fetchFirstValidPath error catch: ', error);
    }
    return null; // Return null if fetch fails
  }, Promise.resolve(null)); // start promise that resolves to null
}
