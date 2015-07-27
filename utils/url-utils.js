import URL from 'url-parse';

export function parseUrl(url) {
  // console.log(URL(url, true));
  return URL(url, true);
};

export function getHost(url) {
  const clearUrl = parseUrl(url).hostname;
  return clearUrl.replace('www.', '');
};

export function getFulPath(url) {
  const clearUrl = parseUrl(url);
  let fullPath = url.replace('http:', '');
  fullPath = fullPath.replace('//', '');
  fullPath = fullPath.replace('www.', '');
  
  return fullPath.replace(getHost(url), '');
}
