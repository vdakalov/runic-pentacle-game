import CoreModule from '../../core-module.mjs';

export default class CanvasCoreModule extends CoreModule {

  get width() {
    return this.element.width;
  }

  get height() {
    return this.element.height;
  }

  get cursor() {
    return this.element.style.cursor;
  }

  set cursor(value) {
    this.element.style.cursor = value;
  }

  constructor(core) {
    super(core);
    /**
     *
     * @type {HTMLCanvasElement}
     * @readonly
     */
    this.element = window.document.createElement('canvas');
    /**
     *
     * @type {CanvasRenderingContext2D}
     * @readonly
     */
    this.c = this.element.getContext('2d');
  }

  clear() {
    this.c.clearRect(0, 0, this.width, this.height);
  }
}
