export const Cursor = {
  Default: '',
  CrossHair: 'crosshair',
  Pointer: 'pointer',
  Copy: 'copy',
  Move: 'move',
};

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

/**
 * Returns list of all node's ancestors
 * @param {Node} node
 * @returns {Node[]} First item is closest parent to specified node
 */
export function getNodeParents(node) {
  /**
   *
   * @type {Node[]}
   */
  const parents = [];
  let parent = node.parentNode;
  while (parent instanceof Node) {
    parents.push(parent);
    parent = parent.parentNode;
  }
  return parents;
}

/**
 * Check if node has any ascendant of target
 * @param {Node} node
 * @param {Node} target
 * @returns {boolean}
 */
export function hasNodeParent(node, target) {
  let parent = node.parentNode;
  while (parent instanceof Node && parent !== target) {
    parent = parent.parentNode;
  }
  return parent != null;
}

/**
 *
 * @param {DOMRectReadOnly} rect
 * @param {number} x
 * @param {number} y
 * @returns {boolean}
 */
export function DOMRectInclude(rect, x, y) {
  return x >= rect.left && rect.right > x
    && y >= rect.top && rect.bottom > y;
}
