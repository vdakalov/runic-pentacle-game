import CoreModule from '../../core-module.mjs';
import CanvasCoreModule from '../canvas/index.mjs';
import ImageBoardCoreModule from './image.mjs';
import ContextMenuCoreModule from '../context-menu.mjs';

export default class ContextMenuBoardCoreModule extends CoreModule {
  constructor(core) {
    super(core);

    /**
     *
     * @type {CanvasCoreModule}
     * @readonly
     * @private
     */
    this.canvas = this.core.get(CanvasCoreModule);
    this.canvas.element.addEventListener('contextmenu', this.onContextMenu.bind(this));

    /**
     *
     * @type {ImageBoardCoreModule}
     * @readonly
     * @private
     */
    this.image = this.core.get(ImageBoardCoreModule);

    /**
     *
     * @type {ContextMenuCoreModule}
     * @readonly
     * @private
     */
    this.contextMenu = this.core.get(ContextMenuCoreModule);
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  onContextMenu(event) {
    event.preventDefault();
    this.contextMenu.openAtMouseEvent(event, [
      { label: 'TEST', handler: () => {
        console.log({
          CanvasPoint: [event.offsetX, event.offsetY],
          BoardImagePoint: this.image.a2r(event.offsetX, event.offsetY)
        });
      } }
    ]);
  }
}
