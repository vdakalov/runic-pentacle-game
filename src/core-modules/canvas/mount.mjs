import CoreModule from '../../core-module.mjs';
import CanvasCoreModule from './index.mjs';

export default class MountCanvasCoreModule extends CoreModule {
  /**
   *
   * @param {Core} core
   */
  constructor(core) {
    super(core);
    window.document.body
      .appendChild(this.core.get(CanvasCoreModule).element);
  }
}
