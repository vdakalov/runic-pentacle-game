
export default class BoardPointerEvent {

  /**
   * Canvas absolute (in px) X coordinate
   * @returns {number}
   */
  get cx() {
    return this.origin.offsetX;
  }

  /**
   * Canvas absolute (in px) Y coordinate
   * @returns {number}
   */
  get cy() {
    return this.origin.offsetY;
  }

  /**
   * Board image absolute (in px) X coordinate
   * @returns {number}
   */
  get ix() {
    return this.origin.offsetX - this._image.rect.x;
  }

  /**
   * Board image absolute (in px) Y coordinate
   * @returns {number}
   */
  get iy() {
    return this.origin.offsetY - this._image.rect.y;
  }

  /**
   *
   * @param {ImageBoardCoreModule} image
   * @param {MouseEvent} event
   */
  constructor(image, event) {
    /**
     *
     * @type {ImageBoardCoreModule}
     * @readonly
     * @private
     */
    this._image = image;

    /**
     * Original event
     * @type {MouseEvent}
     * @readonly
     */
    this.origin = event;

    const [rx, ry] = this._image.a2r(this.cx, this.cy);

    /**
     * Board image relative (0-1) X coordinate
     * @type {number}
     * @readonly
     */
    this.rx = rx;

    /**
     * Board image relative (0-1) Y coordinate
     * @type {number}
     * @readonly
     */
    this.ry = ry;
  }
}
