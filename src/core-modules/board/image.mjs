import CoreModule from '../../core-module.mjs';
import RafCoreModule from '../raf.mjs';
import CanvasCoreModule from '../canvas/index.mjs';

export default class ImageBoardCoreModule extends CoreModule {
  constructor(core) {
    super(core);

    /**
     *
     * @type {HTMLImageElement}
     * @readonly
     */
    this.element = window.document.createElement('img');
    this.element.src = '/assets/board.png';

    this.core
      .get(RafCoreModule)
      .set(this.draw = this.draw.bind(this));

    /**
     *
     * @type {CanvasCoreModule}
     * @private
     */
    this.canvas = this.core.get(CanvasCoreModule);

    /**
     *
     * @type {DOMRectReadOnly}
     */
    this.rect = new DOMRect();
  }

  destroy() {
    this.core.get(RafCoreModule)
      .unset(this.draw);
  }

  /**
   *
   * @param {DOMHighResTimeStamp} delay
   * @private
   */
  draw(delay) {
    const iw = this.element.width;
    const ih = this.element.height;
    const ir = iw / ih;
    const cw = this.canvas.element.width;
    const ch = this.canvas.element.height;
    const cr = cw / ch;

    let dw;
    let dh;
    let x;
    let y;

    if (ir > cr) {
      dw = cw;
      dh = cw / ir;
      x = 0;
      y = (ch - dh) / 2;
    } else {
      dh = ch;
      dw = ch * ir;
      x = (cw - dw) / 2;
      y = 0;
    }

    this.rect = new DOMRectReadOnly(x, y, dw, dh);
    this.canvas.c.drawImage(this.element, x, y, dw, dh);
  }

  /**
   * Return canvas absolute point from board image relative
   * @param {number} left Board image relative point
   * @param {number} top Board image relative point
   * @return {[x: number, y: number]}
   */
  r2a(left, top) {
    return [
      this.rect.x + (this.rect.width * left),
      this.rect.y + (this.rect.height * top)
    ];
  }

  /**
   * Returns board image relative point from canvas absolute
   * @param {number} x Canvas absolute point
   * @param {number} y Canvas absolute point
   * @return {[left: number, top: number]}
   */
  a2r(x, y) {
    return [
      (x - this.rect.x) / this.rect.width,
      (y - this.rect.y) / this.rect.height
    ];
  }
}
