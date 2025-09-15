import Core from './core.mjs';
import RafCoreModule from './core-modules/raf.mjs';
import CanvasCoreModule from './core-modules/canvas/index.mjs';
import ResizeCanvasCoreModule from './core-modules/canvas/resize.mjs';
import MountCanvasCoreModule from './core-modules/canvas/mount.mjs';
import ContextMenuCoreModule from './core-modules/context-menu.mjs';
import StorageCoreModule from './core-modules/storage.mjs';
import MenuSceneCoreModule from './core-modules/scenes/menu.mjs';
import EditorScene from './core-modules/scenes/editor/index.mjs';

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

      // context menu modules
      ContextMenuCoreModule,

      // Scenes
      // MenuSceneCoreModule,
      EditorScene,
    ]);

    // start request animation frame system
    this.core
      .get(RafCoreModule)
      .resume();


  }
}
