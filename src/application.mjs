import Core from './core.mjs';
import RafCoreModule from './core-modules/raf.mjs';
import CanvasCoreModule from './core-modules/canvas/index.mjs';
import ResizeCanvasCoreModule from './core-modules/canvas/resize.mjs';
import MountCanvasCoreModule from './core-modules/canvas/mount.mjs';
import StorageCoreModule from './core-modules/storage.mjs';
import MenuScene from './core-modules/scenes/menu.mjs';
import EditorScene from './core-modules/scenes/editor/index.mjs';
import PentacleScene from './core-modules/scenes/game/pentacle/index.mjs';

export default class Application {
  constructor() {
    /**
     *
     * @type {Core}
     * @readonly
     * @private
     */
    this.core = new Core([
      // storage
      StorageCoreModule,

      // raf modules
      RafCoreModule,

      // canvas modules
      CanvasCoreModule,
      ResizeCanvasCoreModule,
      MountCanvasCoreModule,

      // Scenes
      MenuScene,
      // EditorScene,
      // PentacleScene,
    ]);

    // start request animation frame system
    this.core
      .get(RafCoreModule)
      .resume();
  }
}
