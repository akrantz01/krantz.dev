const isExternalRegex = /^http(s)?:\/\//;

/**
 * Check if the given URL goes to an external website
 * @param url the URL to check
 */
export const isExternal = (url: string) => isExternalRegex.test(url);
