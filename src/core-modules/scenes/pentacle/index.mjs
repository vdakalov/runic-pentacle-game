import SceneCoreModule from '../../scene/index.mjs';
import BoardCoreModule from '../../board/index.mjs';
import ImageBoardCoreModule from '../../board/image.mjs';
import PointerBoardCoreModule from '../../board/pointer/index.js';
import ContextMenuCtrl from '../../context-menu/ctrl.js';
import SeparatorItem from '../../context-menu/items/separator.js';
import TextItem from '../../context-menu/items/text.mjs';
import ActiveTextItem from '../../context-menu/items/active-text.mjs';

export default class PentacleScene extends SceneCoreModule {
  constructor(core) {
    super(core);

    this.core.load(
      BoardCoreModule,
      ImageBoardCoreModule,
      PointerBoardCoreModule,
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
     * @type {PointerBoardCoreModule}
     */
    this.pointer = this.core.get(PointerBoardCoreModule);

    /**
     *
     * @type {ContextMenuCtrl}
     * @private
     */
    this.cmc = new ContextMenuCtrl(this.canvas.element, this._contextMenuBuilder.bind(this));
  }

  /**
   *
   * @param {MouseEvent} event
   * @returns {ContextMenuItem[]}
   * @private
   */
  _contextMenuBuilder(event) {
    return [
      new TextItem(`Just text item: ${Date.now()}`),
      new SeparatorItem(),
      new ActiveTextItem('Active text item (true)', (e) => {
        console.log('Active text item (true)', e);
        return true;
      }, false, event),
      new ActiveTextItem('Active text item (false)', (e) => {
        console.log('Active text item (false)', e);
        return false;
      }),
      new ActiveTextItem('Active text item (void)', (e) => {
        console.log('Active text item (void)', e);
      }),
      new ActiveTextItem('Inactive text item')
    ];
  }

  /**
   * Initialize game field
   */
  initialize() {

  }
}
