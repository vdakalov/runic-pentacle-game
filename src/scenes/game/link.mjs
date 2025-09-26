import { BoardWaypointSegment } from '../../core-modules/board/waypoint.mjs';

export default class Link {

  /**
   *
   * @returns {string}
   */
  get lineSegmentName() {
    return BoardWaypointSegment[this.lineSegment];
  }

  /**
   *
   * @param {BoardWaypoint} aWp First waypoint to link
   * @param {BoardWaypoint} bWp Second waypoint to link
   * @param {BoardWaypoint} fElWp Which element waypoint is ahead if move forward (from point a to point b)
   * @param {BoardWaypoint} bElWp Which element waypoint is ahead if move backward (from point b to point a)
   * @param {BoardWaypointSegment} lineSegment Line segment
   */
  constructor(aWp, bWp, fElWp, bElWp, lineSegment) {
    /**
     * First waypoint to link
     * @type {BoardWaypoint}
     * @readonly
     */
    this.aWp = aWp;
    /**
     * Second waypoint to link
     * @type {BoardWaypoint}
     * @readonly
     */
    this.bWp = bWp;
    /**
     * Which element waypoint is ahead if move forward (from point a to point b)
     * @type {BoardWaypoint}
     * @readonly
     */
    this.fElWp = fElWp;
    /**
     * Which element waypoint is ahead if move backward (from point b to point a)
     * @type {BoardWaypoint}
     * @readonly
     */
    this.bElWp = bElWp;
    /**
     * Line segment
     * @type {BoardWaypointSegment}
     * @readonly
     */
    this.lineSegment = lineSegment;
  }

  toString() {
    return `(${this.bElWp.id}) ${this.aWp.id} --[${this.lineSegmentName}]--> ${this.bWp.id} (${this.fElWp.id})`;
  }
}
