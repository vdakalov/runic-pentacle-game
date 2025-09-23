import CoreModule from '../../core-module.mjs';
import { BoardWaypointSegment } from '../../core-modules/board/waypoint.mjs';
import Player, { Phase } from './player.mjs';

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
   * Random number on dice (int in range 0-5)
   * @returns {number}
   */
  dice() {
    return Math.floor(Math.random() * 6);
  }

  /**
   * Ask user for dice value and return it or returns random dice-value
   * @returns {number}
   */
  promptDice() {
    const msg = 'Dice value [1-6] (cancel to random):';
    const raw = this._lastDicePromptValue = window
      .prompt(msg, this._lastDicePromptValue) || '';
    const int = Number.parseInt(raw.trim());
    if (Number.isInteger(int) && int > 0 && 6 >= int) {
      return int;
    }
    return this.dice();
  }

  /**
   *
   * @param {Player} player Turn's player
   * @param {BoardWaypoint} wp Init waypoint
   * @param {number} dice Dice value
   * @returns {BoardWaypoint} Target turn waypoint
   */
  getTurnWaypoint(player, wp, dice) {
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
        /**
         * Previous waypoint to be sure
         * moving continues in the same
         * direction
         * @type {undefined}
         */
        let pwp = undefined;
        while (dice-- > 0) {
          let lPwp = pwp;
          for (const wpc of wp.connections) {
            const awp = wpc.getAnotherWaypoint(wp);
            if (awp.at(player.segment) && awp !== pwp) {
              lPwp = wp;
              wp = awp;
              break;
            }
          }
          pwp = lPwp;
        }
        break;
    }
    return wp;
  }
}
