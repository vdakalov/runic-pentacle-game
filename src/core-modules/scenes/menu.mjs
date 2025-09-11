import SceneCoreModule from '../scene/index.mjs';
import ButtonSceneObject from '../scene/objects/button.mjs';
import EditorScene from './editor/index.mjs';

export default class MenuScene extends SceneCoreModule {
  constructor(core) {
    super(core);

    this.bg = window.document.createElement('img');
    this.bg.src = '/assets/menu.jpg';

    this.button1 = new ButtonSceneObject(0, 0, 'Editor', () => this.gotoEditor());
    // this.button1.font = 'bold 48px serif';
    this.objects.push(this.button1);
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
    this.button1.x = this.canvas.width / 2;
    this.button1.y = this.canvas.height * 0.68;

    super.draw();
  }

  gotoEditor() {
    this.changeScene(EditorScene)
    // this.core.unload(this.constructor);
    // this.core.load(EditorScene);
  }
}
