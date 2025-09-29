import SceneCoreModule from '../../../core-modules/scene/index.mjs';
import BoardCoreModule from '../../../core-modules/board/index.mjs';
import ImageBoardCoreModule from '../../../core-modules/board/image.mjs';
import PointerBoardCoreModule from '../../../core-modules/board/pointer/index.js';
import GameCoreModule from '../index.mjs';
import { BoardWaypointSegment } from '../../../core-modules/board/waypoint.mjs';
import ContextMenuCtrl from '../../../context-menu/ctrl.js';
import SeparatorItem from '../../../context-menu/items/separator.js';
import ActiveTextItem from '../../../context-menu/items/active-text.mjs';
import Stone, { StoneKind } from './stone.mjs';
import Rune from './rune.mjs';
import UfsEvent from './ufs-event.mjs';
import { Phase } from '../player.mjs';
import PlayerObject from './player.mjs';
import MenuScene from '../../menu.mjs';
import l from '../../../i18n.mjs';
import Cursor from '../link-cursor.mjs';
import LinkCursor from '../link-cursor.mjs';

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
      GameCoreModule);

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

    /**
     *
     * @type {string}
     * @private
     */
    this._lastDicePromptValue = '';

    this._initialize();
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
    const dice = this._promptDice();
    this._move(player, dice);
    this._collect(player);
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

    lines.push(` - ${l`Events`}: ${player.game.events.map(event => event.wp.id)}`);

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
    this.objects.length = 0;
    this._initializeStones();
    this._initializeRunes();
    this._initializeUfsEvents();
    this._initializePlayers();
  }

  /**
   * Ask user for dice value and return it or returns random dice-value
   * @returns {number}
   */
  _promptDice() {
    const msg = l`Dice value` + ' [1-6] (' + l`cancel to random` + '):';
    const raw = this._lastDicePromptValue = window
      .prompt(msg, this._lastDicePromptValue) || '';
    const int = Number.parseInt(raw.trim());
    if (Number.isInteger(int) && int > 0 && 6 >= int) {
      return int;
    }
    const value = this.game.dice();
    window.alert(l`Dice value: ${value}`);
    return value;
  }

  /**
   *
   * @param {PlayerObject} player
   * @param {number} dice
   * @private
   */
  _move(player, dice) {
    switch (player.phase) {
      case Phase.Initial:
        this._ringMove(player, dice);
        player.setPhase(Phase.RingMoving);
        return;
      case Phase.RingMoving:
        if (player.wp.atElement) {
          this._initLineMoving(player, dice);
          if (player.linkCursor !== undefined) {
            break;
          }
        }
        return this._ringMove(player, dice);
      case Phase.LinesMoving:
        return this._lineMove(player, dice);
    }
  }

  /**
   *
   * @param {PlayerObject} player
   * @param {number} dice
   * @private
   */
  _ringMove(player, dice) {
    let wp = player.wp;
    while (dice-->0) {
      wp = this.game.getRingMoveOption(wp, player.segment);
    }
    player.setWaypoint(wp);
  }

  /**
   *
   * @param {PlayerObject} player
   * @param {number} dice
   * @private
   */
  _initLineMoving(player, dice) {
    const links = this.game.getElementMoveOptions(player);
    let message = l`Which way are you wish?`;
    links.forEach((link, index) =>
      message += `\n  ${index + 1} - ${link.lineSegmentName}`);
    const wayRaw = window.prompt(message) || '';
    const wayNumber = Number.parseInt(wayRaw.trim());
    if (Number.isInteger(wayNumber)) {
      const link = links[wayNumber - 1];
      if (link !== undefined) {
        player.setPhase(Phase.LinesMoving, link.lineSegment);
        player.linkCursor = new LinkCursor(link, player.wp);
        this._lineMove(player, dice);
      }
    }
  }

  /**
   *
   * @param {PlayerObject} player
   * @param {number} dice
   * @private
   */
  _lineMove(player, dice) {
    while (dice-->0) {
      player.linkCursor.next();
    }
    player.setWaypoint(player.linkCursor.wp);
  }

  /**
   *
   * @param {PlayerObject} player
   * @private
   */
  _collect(player) {
    for (let index = 0; index < this.objects.length; index++) {
      const object = this.objects[index];
      let bag = undefined;
      switch (true) {
        case object instanceof Stone && player.wp === object.wp:
          bag = player.game.stones; break;
        case object instanceof Rune && player.wp === object.wp:
          bag = player.game.runes; break;
        case object instanceof UfsEvent && player.wp === object.wp:
          bag = player.game.events; break;
      }
      if (bag !== undefined) {
        bag.push(object);
        this.objects.splice(index, 1);
        break;
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

  // draw() {
  //   super.draw();
  //   for (const wp of this.board.waypoints) {
  //     if (wp.atElement) {
  //       const [ax, ay] = this.image.r2a(wp.rx, wp.ry);
  //       this.canvas.c.fillStyle = 'orange';
  //       this.canvas.c.font = 'bold 24px sans-serif';
  //       this.canvas.c.textAlign = 'center';
  //       this.canvas.c.fillText(wp.id.toString(), ax, ay + 4)
  //     }
  //   }
  // }
}
