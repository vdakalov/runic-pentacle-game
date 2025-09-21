import SceneCoreModule from '../../../scene/index.mjs';
import StorageCoreModule from '../../../storage.mjs';
import BoardCoreModule from '../../../board/index.mjs';
import ImageBoardCoreModule from '../../../board/image.mjs';
import PointerBoardCoreModule from '../../../board/pointer/index.js';
import GameCoreModule from '../index.mjs';
import { BoardWaypointSegment } from '../../../board/waypoint.mjs';
import ContextMenuCtrl from '../../../context-menu/ctrl.js';
import SeparatorItem from '../../../context-menu/items/separator.js';
import TextItem from '../../../context-menu/items/text.mjs';
import ActiveTextItem from '../../../context-menu/items/active-text.mjs';
import Stone, { StoneKind } from './stone.mjs';
import Rune from './rune.mjs';

export default class PentacleScene extends SceneCoreModule {
  constructor(core) {
    super(core);

    /**
     *
     * @type {Stone[]}
     */
    this.active = [];

    this.core.load(
      BoardCoreModule,
      ImageBoardCoreModule,
      PointerBoardCoreModule,
      GameCoreModule,
    );

    /**
     *
     * @type {StorageCoreModule}
     */
    this.storage = this.core.get(StorageCoreModule);
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
     * @type {GameCoreModule}
     * @private
     */
    this.game = this.core.get(GameCoreModule);

    /**
     *
     * @type {ContextMenuCtrl}
     * @private
     */
    this.cmc = new ContextMenuCtrl(this.canvas.element, this._contextMenuBuilder.bind(this));



    this._initialize();
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

  _initializeStones() {
    /**
     * Rings waypoints segments filter
     * @type {BoardWaypointSegment[]}
     */
    const rsf = [
      BoardWaypointSegment.RingOuter,
      BoardWaypointSegment.RingMiddle,
      BoardWaypointSegment.RingInner
    ];
    /**
     *
     * @type {StoneKind[]}
     */
    const fromIndexStoneKindMap = [
      StoneKind.Energy,
      StoneKind.Information,
      StoneKind.Motivation,
      StoneKind.Information,
      StoneKind.Energy,
    ];
    for (const bwp of this.board.waypoints) {
      if (!rsf.includes(bwp.segment)) {
        continue;
      }
      let indexFrom = 0;
      let prev = bwp;
      let bwc;
      while ((bwc = prev.connections.find(c => c.to === prev && c.from.segment === prev.segment)) !== undefined) {
        indexFrom++;
        prev = bwc.from;
      }
      const stoneKind = fromIndexStoneKindMap[indexFrom];
      const stone = new Stone(stoneKind, bwp, this.image);
      this.objects.push(stone);
    }
  }

  _initializeRunes() {
    /**
     *
     * @type {BoardWaypointSegment[]}
     */
    const lsf = [
      BoardWaypointSegment.LineVLeft,
      BoardWaypointSegment.LineVRight,
      BoardWaypointSegment.LineHTop,
      BoardWaypointSegment.LineHLeft,
      BoardWaypointSegment.LineHRight,
    ];
    let kinds = new Array(25)
      .fill(0)
      .map(() => Math.floor(Math.random() * 25));
    for (const wp of this.board.waypoints) {
      if (!lsf.includes(wp.segment)) {
        continue;
      }
      const rune = new Rune(kinds.pop(), wp, this.image);
      this.objects.push(rune);
    }
  }

  /**
   * Initialize game field
   */
  _initialize() {
    this.storage.restore();
    this.board.load();
    this._initializeStones();
    this._initializeRunes();
  }

  destroy() {
    this.cmc.destroy();
    this.core.unload(
      BoardCoreModule,
      ImageBoardCoreModule,
      PointerBoardCoreModule
    );
  }
}
