import { getPointBetween } from '../../../utils.mjs';

export default class EditorWaypointsConnection {
  /**
   *
   * @param {EditorWaypoint} from
   * @param {EditorWaypoint} to
   * @param {BoardWaypointsConnection} bwc
   */
  constructor(from, to, bwc) {
    /**
     *
     * @type {EditorWaypoint}
     * @readonly
     */
    this.from = from;
    /**
     *
     * @type {EditorWaypoint}
     * @readonly
     */
    this.to = to;
    /**
     *
     * @type {BoardWaypointsConnection}
     * @readonly
     */
    this.bwc = bwc;

    /**
     *
     * @type {boolean}
     */
    this.active = false;

    from.connections.push(this);
    to.connections.push(this);
  }

  destroy() {
    this.from.connections.splice(this.from.connections.indexOf(this), 1);
    this.to.connections.splice(this.to.connections.indexOf(this), 1);
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
    c.strokeStyle = this.active ? '#9a031e' : '#e36414';
    c.lineWidth = this.active ? 4 : 2;
    c.stroke();
    c.closePath();

    // draw middle symbol
    const [rx, ry, a] = getPointBetween(fcx, fcy, tcx, tcy, 0.5);

    c.save();
    c.translate(fcx - rx, fcy - ry);
    c.rotate(a);
    c.fillStyle = c.strokeStyle;
    c.beginPath();
    c.moveTo(-6, 0);
    c.lineTo(6, -6);
    c.lineTo(6, 6);
    c.fill();
    c.closePath();
    c.restore();
  }

  reverse() {
    const temp = this.from;
    this.from = this.to;
    this.to = temp;
  }
}
