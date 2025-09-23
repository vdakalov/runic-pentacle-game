import CoreModule from '../../core-module.mjs';
import BoardCoreModule from '../../core-modules/board/index.mjs';
import { BoardWaypointSegment, SegmentsSets } from '../../core-modules/board/waypoint.mjs';
import Player, { Phase } from './player.mjs';
import l from '../../i18n.mjs';
import StorageCoreModule from '../../core-modules/storage.mjs';

export default class GameCoreModule extends CoreModule {
  constructor(core) {
    super(core);

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
     * @type {Player[]}
     */
    this.players = [
      new Player(BoardWaypointSegment.RingMiddle)
    ];

    /**
     *
     * @type {string}
     * @private
     */
    this._lastDicePromptValue = '';

    /**
     *
     * @type {BoardWaypoint[]}
     */
    this.lines = [];

    /**
     *
     * @type {Promise<void>}
     * @readonly
     */
    this.loads = this._bootstrap();
  }

  /**
   *
   * @returns {Promise<void>}
   * @private
   */
  _bootstrap() {
    return window
      .fetch('/assets/storage.json')
      .then(response => response.json())
      .then(data => this.storage.fromObject(data))
      .then(this._initialize.bind(this));
  }

  _initialize() {
    this.board.load();
    if (this.board.waypoints.length === 0) {
      return;
    }
    const wp = this.board.waypoints
      .find(bwp => bwp.atElement);
    this.lines.push(wp);
    const segments = [
      BoardWaypointSegment.Event,
      BoardWaypointSegment.Element,
      ...SegmentsSets.Lines,
    ];
    let segment = wp.segment;
    for (let index = 0; index < this.lines.length; index++) {
      const wp = this.lines[index];
      for (const bwc of wp.connections) {
        const awp = bwc.getAnotherWaypoint(wp);
        if (awp.atLine) {
          if (awp.segment === segment && this.lines.indexOf(awp) === -1) {
            this.lines.push(awp);
          }
        } else if (awp.atEvent) {

        }

        const atCond = awp.at(...segments);
        const indexCond = this.lines.indexOf(awp) === -1;
        console.log('LINES', { atCond, indexCond, wp, awp });
        if (atCond && indexCond) {
          this.lines.push(awp);
          break;
        }
      }
    }
    console.log('GameCoreModule: load', this.lines);
  }

  destroy() {
    this.players.length = 0;
    this._lastDicePromptValue = '';
    // this.core.unload(BoardCoreModule);
  }

  /**
   * Random number on dice (int in range 1-6)
   * @returns {number}
   */
  dice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  /**
   * Ask user for dice value and return it or returns random dice-value
   * @returns {number}
   */
  promptDice() {
    const msg = l`Dice value` + ' [1-6] (' + l`cancel to random` + '):';
    const raw = this._lastDicePromptValue = window
      .prompt(msg, this._lastDicePromptValue) || '';
    const int = Number.parseInt(raw.trim());
    if (Number.isInteger(int) && int > 0 && 6 >= int) {
      return int;
    }
    const value = this.dice();
    window.alert(l`Dice value: ${value}`);
    return value;
  }

  /**
   * Check if waypoint is on the direction way
   * @param {BoardWaypoint} from
   * @param {BoardWaypoint} to
   * @param {number} direction
   * @returns {boolean}
   */
  onPlayerWay(from, to, direction) {
    const dir = to.rx - from.rx;
    return direction !== 0
      && ((direction > 0 && dir > 0) || (0 > direction && 0 > dir));
  }

  /**
   *
   * @param {Player} player Turn's player
   * @param {BoardWaypoint} wp Init waypoint
   * @param {number} dice Dice value
   * @param {number} [direction]
   * @returns {BoardWaypoint} Target turn waypoint
   */
  getTurnWaypoint(player, wp, dice, direction = 0) {
    switch (player.phase) {
      case Phase.Initial:
      case Phase.RingMoving:
        while (dice-- > 0) {
          wp = wp.connections
            .find(wpc => wpc.directed && wpc.from === wp && wpc.to
              .at(player.segment, BoardWaypointSegment.Element)).to;
        }
        break;
      case Phase.LinesMoving:
        while (dice-- > 0) {
          for (const wpc of wp.connections) {
            const awp = wpc.getAnotherWaypoint(wp);
            if (awp.at(player.segment) && this.onPlayerWay(wp, awp, direction)) {
              wp = awp;
              break;
            }
          }
        }
        break;
    }
    return wp;
  }
}
