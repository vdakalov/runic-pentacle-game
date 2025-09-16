
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

  destroy() {
    this.from.connections.splice(this.from.connections.indexOf(this), 1);
    this.to.connections.splice(this.to.connections.indexOf(this), 1);
  }
}
