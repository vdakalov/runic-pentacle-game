import CoreModule from '../../../core-module.mjs';
import CanvasCoreModule from '../../canvas/index.mjs';
import ImageBoardCoreModule from '../image.mjs';
import BoardPointerEvent from './pointer-event.mjs';

export default class PointerBoardCoreModule extends CoreModule {
  constructor(core) {
    super(core);

    /**
     * @typedef {Function} BoardPointerHandler
     * @param {BoardPointerEvent} event
     */
    /**
     * @typedef {Function} BoardPointerTranslateHandler
     * @param {BoardPointerEvent} event
     * @param {BoardPointerEvent} down Event starts translation
     */

    /**
     *
     * @type {BoardPointerHandler[]}
     */
    this.onPointerClick = [];

    /**
     *
     * @type {BoardPointerHandler[]}
     */
    this.onPointerMove = [];

    /**
     *
     * @type {BoardPointerHandler[]}
     */
    this.onPointerDown = [];

    /**
     *
     * @type {BoardPointerHandler[]}
     */
    this.onPointerUp = [];

    /**
     *
     * @type {BoardPointerTranslateHandler[]}
     */
    this.onPointerTranslate = [];

    /**
     *
     * @type {CanvasCoreModule}
     * @private
     */
    this.canvas = this.core.get(CanvasCoreModule);

    /**
     *
     * @type {ImageBoardCoreModule}
     * @private
     */
    this.image = this.core.get(ImageBoardCoreModule);

    /**
     *
     * @type {BoardPointerEvent|undefined}
     * @private
     */
    this._down = undefined;

    /**
     * Click filter: skip click emitting if false
     * Used to avoid extra click on finish drag&drop
     * @type {boolean}
     * @private
     */
    this._click = true;
    /**
     *
     * @type {number}
     * @private
     */
    this._clickThreshold = 2;

    this.canvas.element.addEventListener('click', this._onMouseClick = this._onMouseClick.bind(this));
    this.canvas.element.addEventListener('mousemove', this._onMouseMove = this._onMouseMove.bind(this));
    this.canvas.element.addEventListener('mousedown', this._onMouseDown = this._onMouseDown.bind(this));
    this.canvas.element.addEventListener('mouseup', this._onMouseUp = this._onMouseUp.bind(this));
  }

  destroy() {
    this.canvas.element.removeEventListener('click', this._onMouseClick);
    this.canvas.element.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.element.removeEventListener('mousedown', this._onMouseDown);
    this.canvas.element.removeEventListener('mouseup', this._onMouseUp);
  }

  /**
   *
   * @param {MouseEvent} event
   * @return {BoardPointerEvent}
   */
  createBoardPointerEvent(event) {
    return new BoardPointerEvent(this.image, event);
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  _onMouseClick(event) {
    if (!this._click) {
      this._click = true;
      return;
    }
    const bpe = this.createBoardPointerEvent(event);
    for (const handler of this.onPointerClick) {
      handler(bpe);
    }
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  _onMouseMove(event) {
    const bpe = this.createBoardPointerEvent(event);
    for (const handler of this.onPointerMove) {
      handler(bpe);
    }
    if (this._down !== undefined) {
      const x = Math.abs(this._down.cx - event.offsetX);
      const y = Math.abs(this._down.cy - event.offsetY);
      this._click = this._clickThreshold > x && this._clickThreshold > y;
      for (const handler of this.onPointerTranslate) {
        handler(bpe, this._down);
      }
    }
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  _onMouseDown(event) {
    const bpe = this.createBoardPointerEvent(event);
    if (event.button === 0) {
      this._down = bpe;
    }
    for (const handler of this.onPointerDown) {
      handler(bpe);
    }
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  _onMouseUp(event) {
    const bpe = this.createBoardPointerEvent(event);
    for (const handler of this.onPointerUp) {
      handler(bpe, this._down);
    }
    this._down = undefined;
  }
}
