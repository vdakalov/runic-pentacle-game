import { BoardWaypointKind } from '../../board/index.mjs';



export default class EditorWaypoint {

  /**
   * @typedef {Object} EditorWaypointStyle
   * @property {number} size
   * @property {string} color
   */
  /**
   * Waypoint style
   * @type {Object.<string, EditorWaypointStyle>}
   */
  static styles = {
    [BoardWaypointKind.Track]: {
      size: 16,
      color: 'gray'
    },
    [BoardWaypointKind.Nature]: {
      size: 16,
      color: 'blue'
    },
    [BoardWaypointKind.Line]: {
      size: 16,
      color: 'green'
    },
    [BoardWaypointKind.Event]: {
      size: 16,
      color: 'red'
    }
  };

  /**
   *
   * @param {BoardWaypoint} bwp
   */
  constructor(bwp) {
    /**
     *
     * @type {BoardWaypoint}
     * @readonly
     */
    this.bwp = bwp;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {ImageBoardCoreModule} image
   */
  draw(c, image) {
    const [x, y] = image.r2a(this.bwp.left, this.bwp.top);
    const { size, color } = this.wps[waypoint.kind];
    const rect = new DOMRectReadOnly(x - (size / 2), y - (size / 2), size, size);
    this._waypoints.push({ waypoint, rect });
    this.canvas.c.beginPath();
    this.canvas.c.fillStyle = color;
    this.canvas.c.fillRect(rect.x, rect.y, rect.width, rect.height);
    this.canvas.c.closePath();
  }
}
