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
  LineVLeft: 4,
  LineVRight: 5,
  LineHTop: 6,
  LineHLeft: 7,
  LineHRight: 8,
  /**
   * Pentacle suddenly event cell
   */
  Event: 9,
});

export const SegmentsSets = {
  /**
   * @type {BoardWaypointSegment[]}
   */
  Rings: [
    BoardWaypointSegment.RingOuter,
    BoardWaypointSegment.RingMiddle,
    BoardWaypointSegment.RingInner,
  ],
  /**
   * @type {BoardWaypointSegment[]}
   */
  Lines: [
    BoardWaypointSegment.LineVLeft,
    BoardWaypointSegment.LineVRight,
    BoardWaypointSegment.LineHTop,
    BoardWaypointSegment.LineHLeft,
    BoardWaypointSegment.LineHRight,
  ]
};

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
   * @returns {string}
   */
  get segmentName() {
    return BoardWaypointSegment[this.segment];
  }

  /**
   * Is the waypoint at any ring
   * @returns {boolean}
   */
  get atRing() {
    return SegmentsSets.Rings.indexOf(this.segment) !== -1;
  }

  /**
   * Is the waypoint at any line
   * @returns {boolean}
   */
  get atLine() {
    return SegmentsSets.Lines.indexOf(this.segment) !== -1;
  }

  /**
   * Is the waypoint at any element
   * @returns {boolean}
   */
  get atElement() {
    return this.segment === BoardWaypointSegment.Element;
  }

  /**
   * Is the waypoint at any unforeseen event
   */
  get atEvent() {
    return this.segment === BoardWaypointSegment.Event;
  }

  /**
   *
   * @param {BoardWaypointSegment} segment
   * @param {number} rx
   * @param {number} ry
   */
  constructor(segment, rx, ry) {
    /**
     *
     * @type {number}
     * @readonly
     */
    this.id = Number.parseInt(rx.toFixed(6).slice(2, 6));
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

  /**
   * Check if the waypoint at least one of specified segments
   * @param {...BoardWaypointSegment[]} segments
   * @returns {boolean}
   */
  at(...segments) {
    return segments.indexOf(this.segment) !== -1;
  }

  /**
   *
   * @return {*}
   */
  toObject() {
    return [this.segment, this.rx, this.ry];
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `${this.constructor.name}#${this.id}(${this.segmentName})`;
  }
}
