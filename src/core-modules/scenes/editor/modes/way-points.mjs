import CoreModule from '../../../../core-module.mjs';
import CanvasCoreModule from '../../../canvas/index.mjs';

export default class WayPointsMode extends CoreModule {
  constructor(core) {
    super(core);

    /**
     *
     * @type {CanvasCoreModule}
     */
    this.canvas = this.core.get(CanvasCoreModule);


  }
}
