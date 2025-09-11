import SceneCoreModule from '../../scene/index.mjs';
import ImageBoardCoreModule from '../../board/image.mjs';
import BoardCoreModule from '../../board/index.mjs';
import ContextMenuCoreModule from '../../context-menu.mjs';
import MenuScene from '../menu.mjs';

export default class EditorScene extends SceneCoreModule {
  constructor(core) {
    super(core);

    this.core.load(
      BoardCoreModule,
      ImageBoardCoreModule,
    );

    /**
     *
     * @type {BoardCoreModule}
     */
    this.board = this.core.get(BoardCoreModule);
    /**
     *
     * @type {ImageBoardCoreModule}
     */
    this.image = this.core.get(ImageBoardCoreModule);
    /**
     *
     * @type {ContextMenuCoreModule}
     */
    this.cm = this.core.get(ContextMenuCoreModule);

    this.canvas.element.addEventListener('contextmenu',
      this.onCanvasContextMenu = this.onCanvasContextMenu.bind(this));

    this.canvas.clear();

    /**
     * @typedef {Object} EditorMode
     * @property {string} label
     * @property {string} cursor
     */
    /**
     *
     * @type {EditorMode[]}
     */
    this.modes = [
      { label: 'Normal', cursor: '' },
      { label: 'Way point', cursor: 'crosshair' },
      { label: 'Connect', cursor: '' }
    ];
    /**
     *
     * @type {number}
     */
    this.mode = 0;
  }

  destroy() {
    this.canvas.cursor = '';
    this.canvas.element.removeEventListener('contextmenu', this.onCanvasContextMenu);
    this.core.unload(
      BoardCoreModule,
      ImageBoardCoreModule,
    );
    super.destroy();
  }

  /**
   *
   * @param {MouseEvent} event
   */
  onCanvasContextMenu(event) {
    event.preventDefault();
    const mode = this.modes[this.mode];

    this.cm.openAtMouseEvent(event, [
      { label: `Mode: ${mode.label}`, handler: this.nextMode.bind(this) },
      { label: '', handler() {} },
      { label: 'Close Editor', handler: this.close.bind(this) }
    ]);
  }

  nextMode() {
    this.mode = (this.mode + 1) % this.modes.length;
    const mode = this.modes[this.mode];
    this.canvas.cursor = mode.cursor;
  }

  draw() {

  }

  close() {
    this.changeScene(MenuScene);
  }
}
