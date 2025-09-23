import SceneCoreModule from '../core-modules/scene/index.mjs';
import ButtonSceneObject from '../core-modules/scene/objects/button.mjs';
import PentacleScene from './game/pentacle/index.mjs';
import EditorScene from './editor/index.mjs';
import { Assets } from '../theme.mjs';
import l from '../i18n.mjs';

export default class MenuScene extends SceneCoreModule {
  constructor(core) {
    super(core);

    /**
     *
     * @type {HTMLImageElement}
     * @readonly
     */
    this.bg = window.document.createElement('img');
    this.bg.src = Assets.MenuLogo;

    /**
     *
     * @type {ButtonSceneObject}
     * @readonly
     */
    this.btnGame = new ButtonSceneObject(0, 0, l`Play`,
      this.changeScene.bind(this, PentacleScene));
    this.objects.push(this.btnGame);

    /**
     *
     * @type {ButtonSceneObject}
     * @readonly
     */
    this.btnEditor = new ButtonSceneObject(0, 0, l`Editor`,
      this.changeScene.bind(this, EditorScene));
    this.objects.push(this.btnEditor);
  }

  /**
   * @private
   */
  draw() {
    this.canvas.clear();

    // logo
    const top = (this.canvas.height - this.bg.height) / 2;
    const left = (this.canvas.width - this.bg.width) / 2;
    this.canvas.c.drawImage(this.bg, left, top * 0.5);

    // buttons
    this.btnGame.x = this.canvas.width / 2;
    this.btnGame.y = this.canvas.height * 0.64;

    this.btnEditor.x = this.canvas.width / 2;
    this.btnEditor.y = this.canvas.height * 0.68;

    super.draw();
  }
}
