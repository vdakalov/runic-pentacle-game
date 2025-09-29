
export default class LinkCursor {
  /**
   *
   * @param {Link} link
   * @param {BoardWaypoint} wp
   */
  constructor(link, wp) {
    /**
     * Current link. Link that has at player current wp
     * @type {Link}
     */
    this.link = link;
    /**
     * Current target wp
     * @type {BoardWaypoint}
     */
    this.target = link.follows(wp);
    /**
     *
     * @type {BoardWaypoint}
     */
    this.wp = wp;
  }

  /**
   *
   * @returns {BoardWaypoint}
   */
  next() {
    switch (this.target) {
      case this.link.at:
        if (this.wp === this.link.al) {
          this.link = this.link.a;
          this.target = this.link.at;
          return this.wp = this.link.al;
        }
        return this.wp = this.link.al;
      case this.link.bt:
        if (this.wp === this.link.bl) {
          this.link = this.link.b;
          this.target = this.link.bt;
          return this.wp = this.link.bl;
        }
        return this.wp = this.link.bl;
    }
  }
}
