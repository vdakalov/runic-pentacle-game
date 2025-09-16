import { getPointBetween } from '../../../utils.mjs';
import { EditorTheme } from '../../../theme.mjs';

export default class EditorWaypointsConnection {

  /**
   *
   * @return {boolean}
   */
  get directed() {
    return this.bwc.directed;
  }

  /**
   *
   * @param {boolean} value
   */
  set directed(value) {
    this.bwc.directed = value;
  }

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
     */
    this.from = from;
    /**
     *
     * @type {EditorWaypoint}
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

    const { Color, LineWidth } = this.active
      ? EditorTheme.Connection.Style.Selected
      : EditorTheme.Connection.Style.Default;
    c.beginPath();
    c.moveTo(fcx, fcy);
    c.lineTo(tcx, tcy);
    c.strokeStyle = Color;
    c.lineWidth = LineWidth;
    c.stroke();
    c.closePath();

    // draw middle symbol
    if (this.directed) {
      const size = EditorTheme.Connection.DirectionMarkerStyle.Size;
      const [rx, ry, a] = getPointBetween(fcx, fcy, tcx, tcy, 0.5);
      c.save();
      c.translate(fcx - rx, fcy - ry);
      c.rotate(a);
      c.fillStyle = c.strokeStyle;
      c.beginPath();
      c.moveTo(-size, 0);
      c.lineTo(size, -size);
      c.lineTo(size, size);
      c.fill();
      c.closePath();
      c.restore();
    }
  }

  reverse() {
    const temp = this.from;
    this.from = this.to;
    this.to = temp;
    this.bwc.reverse();
  }
}
