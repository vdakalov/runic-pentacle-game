import CoreModule from '../../core-module.mjs';
import CanvasCoreModule from '../canvas/index.mjs';
import ImageBoardCoreModule from './image.mjs';

export default class PointerBoardCoreModule extends CoreModule {
  constructor(core) {
    super(core);

    /**
     * @typedef {Object} PointerEventDataExtra
     * @property {number} ax Absolute canvas X
     * @property {number} ay Absolute canvas Y
     * @property {number} rx Board image relative x
     * @property {number} ry Board image relative y
     * @property {number} left Board image point (0-1) by X
     * @property {number} top Board image point (0-1) by Y
     */
    /**
     * @typedef {Object} PointerEventData
     * @property {PointerEventDataExtra} extra
     * @property {MouseEvent} event Original event
     */
    /**
     * @typedef {Function} PointerHandler
     * @param {PointerEventData} data
     */

    /**
     *
     * @type {PointerHandler[]}
     */
    this.onPointerMove = [];

    /**
     *
     * @type {PointerHandler[]}
     */
    this.onPointerDown = [];

    /**
     *
     * @type {PointerHandler[]}
     */
    this.onPointerUp = [];

    /**
     *
     * @type {PointerHandler[]}
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

    this.canvas.element.addEventListener('mousemove', this._onMouseMove = this._onMouseMove.bind(this));
    this.canvas.element.addEventListener('mousedown', this._onMouseDown = this._onMouseDown.bind(this));
    this.canvas.element.addEventListener('mouseup', this._onMouseUp = this._onMouseUp.bind(this));

    /**
     *
     * @type {PointerEventData|undefined}
     * @private
     */
    this._down = undefined;

    /**
     * Translate deadzone
     * @type {number}
     * @private
     */
    this.deadzone = 6;
  }

  destroy() {
    this.canvas.element.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.element.removeEventListener('mousedown', this._onMouseDown);
    this.canvas.element.removeEventListener('mouseup', this._onMouseUp);
  }

  /**
   *
   * @param {MouseEvent} event
   * @return {PointerEventData}
   */
  createEventData(event) {
    const [left, top] = this.image.a2r(event.offsetX, event.offsetY);
    return {
      event,
      extra: {
        ax: event.offsetX,
        ay: event.offsetY,
        rx: event.offsetX - this.image.rect.x,
        ry: event.offsetY - this.image.rect.y,
        left,
        top,
      }
    };
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  _onMouseMove(event) {
    const data = this.createEventData(event);
    for (const handler of this.onPointerMove) {
      handler(data);
    }
    if (this._down !== undefined) {
      // const dx = Math.abs(event.offsetX - this._down.event.offsetX);
      // const dy = Math.abs(event.offsetY - this._down.event.offsetY);
      // if (dx > this.deadzone || dy > this.deadzone) {
      // }
      for (const handler of this.onPointerTranslate) {
        handler(data);
      }
    }
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  _onMouseDown(event) {
    const data = this.createEventData(event);
    if (event.button === 0) {
      this._down = data;
    }
    for (const handler of this.onPointerDown) {
      handler(data);
    }
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  _onMouseUp(event) {
    this._down = undefined;
    const data = this.createEventData(event);
    for (const handler of this.onPointerUp) {
      handler(data);
    }
  }
}
