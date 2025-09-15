import { createEnum } from '../../utils.mjs';

/**
 *
 * @enum {string}
 * @readonly
 */
export const BoardWaypointSegment = createEnum({
  /**
   * Rings on first game stage
   */
  RingOuter: 0,
  RingMiddle: 1,
  RingInner: 2,
  /**
   * Pentacle vertex circle (air, ground, fire, etc.)
   */
  Element: 3,
  /**
   * Pentacle line (diagonal) cell
   */
  Line: 4,
  /**
   * Pentacle suddenly event cell
   */
  Event: 5,
});

export default class BoardWaypoint {

  /**
   *
   * @param {BoardWaypointSegment} segment
   * @return {BoardWaypointSegment}
   */
  static getNextSegment(segment) {
    return BoardWaypointSegment.hasOwnProperty(segment + 1) ? segment + 1 : 0;
  }

  /**
   *
   * @param {BoardWaypointSegment} segment
   * @param {number} rx
   * @param {number} ry
   */
  constructor(segment, rx, ry) {
    /**
     * Segment waypoint belongs
     * @type {BoardWaypointSegment}
     */
    this.segment = segment;
    /**
     *
     * @type {number}
     */
    this.rx = rx;
    /**
     *
     * @type {number}
     */
    this.ry = ry;
    /**
     *
     * @type {BoardWaypointsConnection[]}
     */
    this.connections = [];
  }

  toObject() {
    return {
      k: this.kind,
      x: this.rx,
      y: this.ry
    }
  }
}
