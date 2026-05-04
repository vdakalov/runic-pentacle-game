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

    /**
     *
     * @type {module:url.URLSearchParams|URLSearchParams}
     */
    this.params = new window.URLSearchParams(
      window.location.search || window.location.hash);

    init()
      .then(this._load.bind(this));
  }

  _load() {
    const scenes = [
      MenuScene,
      PentacleScene,
      EditorScene
    ];

    let scene = scenes[0];

    if (this.params.has('scene')) {
      const value = this.params.get('scene');
      const index = Number.parseInt(value);
      if (Number.isFinite(index)) {
        scene = scenes[index] || scene;
      } else {
        scene = scenes.find(scene =>
          scene.name === value) || scene;
      }
      console.debug(`%cApplication%c: Option scene is defined as%c ${value} (${scene.name})`,
        'color:darkmagenta; text-decoration: underline',
        'color:gray; text-decoration: none',
        'font-weight: bold');
    }

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
      // PentacleScene,
      // EditorScene,
      scene,
    )
      .then(() => {
        // start request animation frame system
        this.core
          .get(RafCoreModule)
          .resume();
      });
  }
}
