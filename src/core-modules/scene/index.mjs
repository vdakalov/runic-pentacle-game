import CoreModule from '../../core-module.mjs';
import RafCoreModule from '../raf.mjs';
import CanvasCoreModule from '../canvas/index.mjs';

export default class SceneCoreModule extends CoreModule {
  constructor(core) {
    super(core);

    /**
     *
     * @type {SceneObject[]}
     */
    this.objects = [];

    /**
     *
     * @type {RafCoreModule}
     * @readonly
     * @protected
     */
    this.raf = this.core.get(RafCoreModule);

    /**
     *
     * @type {CanvasCoreModule}
     * @readonly
     * @protected
     */
    this.canvas = this.core.get(CanvasCoreModule);
    this.canvas.element.addEventListener('mousemove',
      this.onMouseMove = this.onMouseMove.bind(this));
    this.canvas.element.addEventListener('click',
      this.onClick = this.onClick.bind(this));

    this.raf.set(this.draw = this.draw.bind(this));

    /**
     *
     * @type {number}
     * @readonly
     */
    this.TAU = Math.PI * 2;
  }

  destroy() {
    this.raf.unset(this.draw);
    this.canvas.element.removeEventListener('mousemove', this.onMouseMove);
    this.canvas.element.removeEventListener('click', this.onClick);
  }

  /**
   *
   * @param {typeof SceneCoreModule} next
   */
  changeScene(next) {
    this.core.unload(this.constructor);
    this.core.load(next);
    this.canvas.cursor = '';
  }

  /**
   *
   * @param {MouseEvent} event
   */
  onMouseMove(event) {
    for (const obj of this.objects) {
      obj.hover = obj.include(event.offsetX, event.offsetY);
    }
  }

  onClick(event) {
    const obj = this.objects
      .find(obj => obj.include(event.offsetX, event.offsetY));
    if (obj !== undefined) {
      obj.onClick(event);
    }
  }

  draw() {
    for (const obj of this.objects) {
      obj.draw(this.canvas.c);
    }
  }
}
