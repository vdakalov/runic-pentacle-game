import CoreModule from '../../core-module.mjs';
import CanvasCoreModule from './index.mjs';

export default class ResizeCanvasCoreModule extends CoreModule {
  /**
   *
   * @param {Core} core
   */
  constructor(core) {
    super(core);

    /**
     *
     * @type {CanvasCoreModule}
     * @readonly
     * @private
     */
    this.canvas = core.get(CanvasCoreModule);
    window.addEventListener('resize', this.updateSize.bind(this));
    this.updateSize();
  }

  /**
   *
   * @private
   */
  updateSize() {
    this.canvas.element.width = window.innerWidth;
    this.canvas.element.height = window.innerHeight;
  }
}
