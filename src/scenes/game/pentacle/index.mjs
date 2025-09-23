import SceneCoreModule from '../../../core-modules/scene/index.mjs';
import StorageCoreModule from '../../../core-modules/storage.mjs';
import BoardCoreModule from '../../../core-modules/board/index.mjs';
import ImageBoardCoreModule from '../../../core-modules/board/image.mjs';
import PointerBoardCoreModule from '../../../core-modules/board/pointer/index.js';
import GameCoreModule from '../index.mjs';
import { BoardWaypointSegment } from '../../../core-modules/board/waypoint.mjs';
import ContextMenuCtrl from '../../../context-menu/ctrl.js';
import SeparatorItem from '../../../context-menu/items/separator.js';
import TextItem from '../../../context-menu/items/text.mjs';
import ActiveTextItem from '../../../context-menu/items/active-text.mjs';
import Stone, { StoneKind } from './stone.mjs';
import Rune from './rune.mjs';
import UfsEvent from './ufs-event.mjs';
import Player, { Phase } from '../player.mjs';
import PlayerObject from './player.mjs';
import MenuScene from '../../menu.mjs';
import l from '../../../i18n.mjs';

export default class PentacleScene extends SceneCoreModule {
  constructor(core) {
    super(core);

    /**
     *
     * @type {PlayerObject[]}
     */
    this.players = [];

    /**
     *
     * @type {Stone[]}
     */
    this.stones = [];

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
    /**
     * Context Menu Mode
     * @type {*}
     */
    this.cmm = undefined;

    this.game.loads
      .then(this._initialize.bind(this));
  }

  /**
   *
   * @param {MouseEvent} event
   * @returns {ContextMenuItem[]}
   * @private
   */
  _contextMenuBuilder(event) {
    /**
     *
     * @type {ContextMenuItem[]}
     */
    const items = [];

    if (this.cmm instanceof PlayerObject) {
      const po = this.cmm;
      items.push(
        new SeparatorItem(items.length === 0),
        new ActiveTextItem(l`Player ${po.segmentName}`,
          this._cmSelectPlayer.bind(this, undefined), false, event),
        new ActiveTextItem(l`Turn`, this._cmPlayerTurn.bind(this, po), false, event),
        new ActiveTextItem(l`Stats`, this._cmPlayerStats.bind(this, po)),
      );
    } else {
      for (const player of this.players) {
        const item = new ActiveTextItem(l`Player ${player.segmentName}`,
          this._cmSelectPlayer.bind(this, player), false, event);
        items.push(item);
      }
    }

    items.push(
      new SeparatorItem(items.length === 0),
      new ActiveTextItem(l`Reset`, this._cmReset.bind(this)),
      new ActiveTextItem(l`Menu`, this.changeScene.bind(this, MenuScene))
    );

    return items;
  }

  _cmReset() {
    this._initialize();
  }

  /**
   *
   * @param {PlayerObject|undefined} player
   * @private
   */
  _cmSelectPlayer(player) {
    this.cmm = player;
    return true;
  }

  /**
   *
   * @param {PlayerObject} player
   * @private
   */
  _cmPlayerTurn(player) {
    const dice = this.game.promptDice();

    switch (player.phase) {
      case Phase.Initial:
      case Phase.RingMoving: {
        if (player.wp.atElement && !player.isPhaseInitial) {
          const msg = l`Do you wish moving over pentacle lines?`;
          if (window.confirm(msg)) {
            /**
             *
             * @type {BoardWaypointsConnection[]}
             */
            const lines = player.wp.connections
              .filter(bwc => bwc.getAnotherWaypoint(player.wp).atLine);
            const options = lines.map((bwc, index) =>
              `${index + 1} - ${l(bwc.getAnotherWaypoint(player.wp).segmentName)}`);
            const raw = window.prompt(`${l('Which one')}:\n${options.join('\n')}`) || '';
            const number = Number.parseInt(raw.trim());
            if (Number.isInteger(number)) {
              const wp = lines[number - 1].getAnotherWaypoint(player.wp);
              if (wp !== undefined) {
                player.direction = wp.rx - player.wp.rx;
                player.setPhase(Phase.LinesMoving, wp.segment);
                const fwp = dice === 1 ? wp :
                  this.game.getTurnWaypoint(player.game, player.wp, dice, player.direction);
                player.setWaypoint(fwp);
                this._pickupRune(player.game, fwp);
                break;
              }
            }
          }
        }
        const wp = this.game.getTurnWaypoint(player.game, player.wp, dice);
        player.setWaypoint(wp);
        player.setPhase(Phase.RingMoving);
        this._pickupStone(player.game, wp);
        break;
      }
      case Phase.LinesMoving: {
        const wp = this.game.getTurnWaypoint(player.game, player.wp, dice, player.direction);
        player.setWaypoint(wp);
        this._pickupRune(player.game, wp);
        break;
      }
    }
  }

  /**
   *
   * @param {PlayerObject} player
   * @private
   */
  _cmPlayerStats(player) {
    const lines = [
      l`Player`,
      ' - ' + l`Segment: ${player.segmentName}`,
    ];

    // stones
    lines.push(` - ${l`Stones`}:`);
    const stones = player.game.stones
      .reduce((acc, stone) => {
        if (!acc.hasOwnProperty(stone.kindName)) {
          acc[stone.kindName] = 0;
        }
        acc[stone.kindName]++;
        return acc;
      }, {});
    for (const [kindName, count] of Object.entries(stones)) {
      lines.push(`    - ${l`${kindName}`}: ${count}`);
    }

    // runes
    lines.push(` - ${l`Runes`}: ${player.game.runes.map(rune => rune.kind)}`);

    const text = lines.join('\n');
    window.alert(text);
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
      this.stones.push(stone);
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

  _initializeUfsEvents() {
    for (const wp of this.board.waypoints) {
      if (wp.segment === BoardWaypointSegment.Event) {
        const event = new UfsEvent(wp, this.image);
        this.objects.push(event);
      }
    }
  }

  _initializePlayers() {
    for (const player of this.game.players) {
      const wp = this.board.startings[player.segment];
      if (wp !== undefined) {
        const po = new PlayerObject(player, wp, this.image);
        this.players.push(po);
        this.objects.push(po);
      }
    }
  }

  /**
   * Initialize game field
   */
  _initialize() {
    this.board.load();
    this.objects.length = 0;
    this._initializeStones();
    this._initializeRunes();
    this._initializeUfsEvents();
    this._initializePlayers();
  }

  /**
   *
   * @param {Player} player
   * @param {BoardWaypoint} wp
   * @private
   */
  _pickupStone(player, wp) {
    for (let index = 0; index < this.objects.length; index++) {
      const object = this.objects[index];
      if (object instanceof Stone && object.wp === wp) {
        player.stones.push(object);
        this.objects.splice(index, 1);
      }
    }
  }

  /**
   *
   * @param {Player} player
   * @param {BoardWaypoint} wp
   * @private
   */
  _pickupRune(player, wp) {
    for (let index = 0; index < this.objects.length; index++) {
      const object = this.objects[index];
      if (object instanceof Rune && object.wp === wp) {
        player.runes.push(object);
        this.objects.splice(index, 1);
      }
    }
  }

  destroy() {
    this.cmc.destroy();
    this.core.unload(
      BoardCoreModule,
      ImageBoardCoreModule,
      PointerBoardCoreModule,
      GameCoreModule,
    );
    super.destroy();
  }
}
