import Exception from '../../exception.mjs';
import { BoardWaypointSegment } from '../../core-modules/board/waypoint.mjs';

class UnknownWaypoint extends Exception {
  /**
   *
   * @param {Link} link
   * @param {BoardWaypoint} wp
   */
  constructor(link, wp) {
    super(`Unknown link waypoint: ${wp}`);
    /**
     *
     * @type {UnknownWaypoint.Link}
     * @readonly
     */
    this.link = link;
    /**
     *
     * @type {BoardWaypoint}
     * @readonly
     */
    this.wp = wp;
  }
}

class UnknownTarget extends Exception {
  /**
   *
   * @param {Link} link
   * @param {BoardWaypoint} target
   */
  constructor(link, target) {
    super(`Unknown link target: ${target}`);
    /**
     *
     * @type {Link}
     * @readonly
     */
    this.link = link;
    /**
     *
     * @type {BoardWaypoint}
     * @readonly
     */
    this.target = target;
  }
}

/**
 * The Link provides the following definitions (in following order):
 *  - Rear target waypoint [**RT**]
 *  - Follower waypoint [**F**]
 *  - Leader waypoint [**L**]
 *  - Front target waypoint [**FT**]
 *
 * True statements:
 * - [**F**] is closest to [**RT**]
 * - [**L**] closest to [**FT**]
 * - [**L**] leads [**F**] to [**FT**]
 * - [**L**] lead away [**F**] from [**RT**]
 *
 * Means the master waypoint [M] leads the slave waypoint [S] forward to target waypoint [FT] and
 * the slave waypoint may leads the master waypoint backward to target waypoint [BT]
 *
 *    / backward target wp (BT) to which FWP is leads and LWP is follower
 *   /     / follows wp (FWP) follows to the LWP in way to FT
 *  /     /     / leader wp (LWP) leads to FT
 * /     /     /    / forward target wp (FT)
 * [BT] [S] [M] [FT]
 */
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
   * @param {number} id
   * @param {BoardWaypoint} at A target waypoint
   * @param {BoardWaypoint} bt B target waypoint
   * @param {BoardWaypoint} al A leader waypoint
   * @param {BoardWaypoint} bl B leader waypoint
   * @param {BoardWaypointSegment} lineSegment Line segment
   * @param {Link} a
   * @param {Link} b
   */
  constructor(id, at, bt, al, bl, lineSegment, a, b) {
    /**
     *
     * @type {number}
     */
    this.id = id;
    /**
     * A target waypoint
     * @type {BoardWaypoint}
     * @readonly
     */
    this.at = at;
    /**
     * B target waypoint
     * @type {BoardWaypoint}
     * @readonly
     */
    this.bt = bt;
    /**
     * A leader waypoint
     * @type {BoardWaypoint}
     * @readonly
     */
    this.al = al;
    /**
     * B leader waypoint
     * @type {BoardWaypoint}
     * @readonly
     */
    this.bl = bl;
    /**
     * Line segment
     * @type {BoardWaypointSegment}
     * @readonly
     */
    this.lineSegment = lineSegment;
    /**
     *
     * @type {Link}
     * @readonly
     */
    this.a = a;
    /**
     *
     * @type {Link}
     * @readonly
     */
    this.b = b;
  }

  /**
   * Checks if link has specified waypoint
   * @param {BoardWaypoint} wp
   * @returns {boolean}
   */
  has(wp) {
    return this.al === wp || this.bl === wp;
  }

  /**
   * Checks if this link leads to specified target regardless direction
   * @param target
   * @returns {boolean}
   */
  attainable(target) {
    return this.al === target || this.bl === target;
  }

  /**
   * Returns waypoint leads to specified target
   * @param {BoardWaypoint} target
   * @returns {BoardWaypoint}
   */
  leader(target) {
    switch (target) {
      case this.al: return this.bl;
      case this.bl: return this.at;
      default: new UnknownTarget(this, target);
    }
  }

  /**
   * Returns follow waypoint to specified target
   * @param {BoardWaypoint} target
   * @returns {BoardWaypoint}
   */
  follower(target) {
    switch (target) {
      case this.al: return this.at;
      case this.bl: return this.bl;
      default: new UnknownTarget(this, target);
    }
  }

  /**
   * Returns target waypoint to which specified waypoint leads
   * @param {BoardWaypoint} wp Leader
   * @returns {BoardWaypoint}
   */
  leads(wp) {
    switch (wp) {
      case this.al: return this.at;
      case this.bl: return this.bt;
      default: throw new UnknownWaypoint(this, wp);
    }
  }

  /**
   * Returns target waypoint from which specified waypoint leads
   * @param {BoardWaypoint} wp Leader
   * @returns {BoardWaypoint}
   */
  follows(wp) {
    switch (wp) {
      case this.al: return this.bt;
      case this.bl: return this.at;
      default: throw new UnknownWaypoint(this, wp);
    }
  }

  /**
   * Returns another waypoint to specified
   * @param {BoardWaypoint} wp
   * @returns {BoardWaypoint}
   */
  another(wp) {
    switch (wp) {
      case this.at: return this.bl;
      case this.bl: return this.at;
      default: throw new Error(`${this.constructor.name}: Specified wp does not include in the link`);
    }
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return `${this.constructor.name}(${this.id}, ${
      this.at.id}, ${
      this.bt.id}, ${
      this.al.id}, ${
      this.bl.id}, ${
      this.lineSegmentName
    }, ${this.a.id}, ${this.b.id})`;
  }
}



