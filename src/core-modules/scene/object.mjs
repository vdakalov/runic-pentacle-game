/**
 * @abstract
 */
export default class SceneObject {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  constructor(x = 0, y = 0, width = 0, height = 0) {
    /**
     *
     * @type {boolean}
     */
    this.hover = false;
    /**
     *
     * @type {DOMRect}
     */
    this.rect = new DOMRect(x, y, width, height);
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   */
  include(x, y) {
    return x >= this.rect.left && this.rect.right > x &&
      y >= this.rect.top && this.rect.bottom > y;
  }

  /**
   *
   * @param {MouseEvent} event
   */
  onClick(event) {}

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {boolean} [updateRect=true]
   * @abstract
   */
  draw(c, updateRect = true) {

  }
}
