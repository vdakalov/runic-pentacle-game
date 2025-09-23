const dict = {};

/**
 *
 * @param {string} [lang]
 * @returns {Promise<void>}
 */
export function init(lang = window.navigator.language.split('-', 1).pop()) {
  if (lang === 'en') {
    return Promise.resolve();
  }
  const path = `/assets/languages/${lang}.json`;
  return window.fetch(path)
    .then(response => response.json())
    .then(data => Object.assign(dict, data))
    .catch(() => {});
}

/**
 *
 * @param {string|string[]} strings
 * @param {...string[]} values
 * @returns {string}
 */
export default function l(strings, ...values) {
  strings = Array.isArray(strings) ? strings : [strings];
  const key = strings.join('{}');
  const translate = dict[key] || key;
  let result = '';
  for (const [index, part] of translate.split('{}').entries()) {
    result += part;
    const value = values[index];
    if (value !== undefined) {
      result += dict[value] || value;
    }
  }
  return result;
}
