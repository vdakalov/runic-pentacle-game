/**
 * @template T
 * @param {T} obj
 * @return {T}
 */
export function createEnum(obj) {
  const keys = Object.keys(obj);
  for (const key of keys) {
    const value = obj[key];
    obj[value] = key;
  }
  return obj;
}
