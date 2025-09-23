import CoreModule from '../../core-module.mjs';
import { BoardWaypointSegment } from '../../core-modules/board/waypoint.mjs';
import Player, { Phase } from './player.mjs';
import l from '../../i18n.mjs';

export default class GameCoreModule extends CoreModule {
  constructor(core) {
    super(core);

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
  }

  destroy() {
    this.players.length = 0;
    this._lastDicePromptValue = '';
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
