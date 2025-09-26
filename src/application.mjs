import Core from './core.mjs';
import RafCoreModule from './core-modules/raf.mjs';
import CanvasCoreModule from './core-modules/canvas/index.mjs';
import ResizeCanvasCoreModule from './core-modules/canvas/resize.mjs';
import MountCanvasCoreModule from './core-modules/canvas/mount.mjs';
import StorageCoreModule from './core-modules/storage.mjs';
import MenuScene from './scenes/menu.mjs';
import PentacleScene from './scenes/game/pentacle/index.mjs';
import EditorScene from './scenes/editor/index.mjs';
import { init } from './i18n.mjs';

export default class Application {
  constructor() {
    /**
     *
     * @type {Core}
     * @readonly
     * @private
     */
    this.core = new Core();

    init()
      .then(this._load.bind(this));
  }

  _load() {
    this.core.load(
      // storage
      StorageCoreModule,

      // raf modules
      RafCoreModule,

      // canvas modules
      CanvasCoreModule,
      ResizeCanvasCoreModule,
      MountCanvasCoreModule,

      // Scenes
      // MenuScene,
      PentacleScene,
      // EditorScene,
    )
      .then(() => {
        // start request animation frame system
        this.core
          .get(RafCoreModule)
          .resume();
      });
  }
}
