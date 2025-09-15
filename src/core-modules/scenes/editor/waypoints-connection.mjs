
export default class EditorWaypointsConnection {
  /**
   *
   * @param {EditorWaypoint} from
   * @param {EditorWaypoint} to
   */
  constructor(from, to) {
    /**
     *
     * @type {EditorWaypoint}
     */
    this.from = from;
    /**
     *
     * @type {EditorWaypoint}
     */
    this.to = to;

    /**
     *
     * @type {boolean}
     */
    this.active = false;

    from.connections.push(this);
    to.connections.push(this);
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {ImageBoardCoreModule} image
   */
  draw(c, image) {
    const [fcx, fcy] = image.r2a(this.from.bwp.rx, this.from.bwp.ry);
    const [tcx, tcy] = image.r2a(this.to.bwp.rx, this.to.bwp.ry);
    c.beginPath();
    c.moveTo(fcx, fcy);
    c.lineTo(tcx, tcy);
    c.strokeStyle = 'magenta';
    c.lineWidth = this.active ? 2 : 1;
    c.stroke();
    c.closePath();
  }
}
