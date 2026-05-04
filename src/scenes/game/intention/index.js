import SceneCoreModule from '../../../core-modules/scene/index.mjs';
import CanvasCoreModule from '../../../core-modules/canvas/index.mjs';

export default class IntentionScene extends SceneCoreModule {
  constructor(core) {
    super(core);

    this.core.load(
      CanvasCoreModule
    );
  }
}
