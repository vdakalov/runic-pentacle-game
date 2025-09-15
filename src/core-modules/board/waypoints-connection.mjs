
export default class BoardWaypointsConnection {
  /**
   *
   * @param {BoardWaypoint} from
   * @param {BoardWaypoint} to
   */
  constructor(from, to) {
    /**
     *
     * @type {BoardWaypoint}
     */
    this.from = from;
    /**
     *
     * @type {BoardWaypoint}
     */
    this.to = to;

    from.connections.push(this);
    to.connections.push(this);
  }
}
