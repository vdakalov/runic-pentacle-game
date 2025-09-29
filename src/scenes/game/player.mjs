import { createEnum } from '../../utils.mjs';

export const Phase = createEnum({
  /**
   * Player does not make first turn
   */
  Initial: 0,
  /**
   * Player moves on its ring
   */
  RingMoving: 1,
  /**
   * Player moves on pentacle lines
   */
  LinesMoving: 2,
});

export default class Player {

  /**
   *
   * @returns {string}
   */
  get phaseName() {
    return Phase[this.phase];
  }

  /**
   *
   * @param {BoardWaypointSegment} segment
   */
  constructor(segment) {
    /**
     *
     * @type {BoardWaypointSegment}
     * @readonly
     */
    this.initialSegment = segment;
    /**
     *
     * @type {BoardWaypointSegment}
     * @readonly
     */
    this.segment = segment;
    /**
     * Player's game phase
     * @type {Phase}
     */
    this.phase = Phase.Initial;
    /**
     * Collected stones
     * @type {Stone[]}
     */
    this.stones = [];
    /**
     * Collected runes
     * @type {Rune[]}
     */
    this.runes = [];
    /**
     *
     * @type {UfsEvent[]}
     */
    this.events = [];
  }
}
