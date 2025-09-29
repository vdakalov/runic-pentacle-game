
export default class BoardWaypointsConnection {
  /**
   *
   * @param {BoardWaypoint} from
   * @param {BoardWaypoint} to
   * @param {boolean} [directed=false]
   */
  constructor(from, to, directed = false) {
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

    /**
     * Is there direction of the connection
     * @type {boolean}
     */
    this.directed = directed;

    from.connections.push(this);
    to.connections.push(this);
  }

  destroy() {
    this.from.connections.splice(this.from.connections.indexOf(this), 1);
    this.to.connections.splice(this.to.connections.indexOf(this), 1);
  }

  reverse() {
    const temp = this.from;
    this.from = this.to;
    this.to = temp;
  }

  /**
   *
   * @param {BoardWaypoint} wp
   * @returns {boolean}
   */
  has(wp) {
    return this.from === wp || this.to === wp;
  }

  /**
   *
   * @param {BoardWaypoint} wp
   * @returns {BoardWaypoint}
   */
  another(wp) {
    switch (wp) {
      case this.from: return this.to;
      case this.to: return this.from;
      default: throw new Error(`${this.constructor}: There is no waypoint in connection: ${wp}`);
    }
  }
}
