import { createEnum } from '../../../utils.mjs';
import Rune from './pentacle/rune.mjs';

export const Phase = createEnum({
  Initial: 0,
  RingMoving: 1,
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
     *
     * @type {Stone[]}
     */
    this.stones = [];
    /**
     *
     * @type {Rune[]}
     */
    this.runes = [];
  }
}
