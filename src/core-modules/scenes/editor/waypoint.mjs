import { BoardWaypointSegment } from '../../board/waypoint.mjs';
import { DOMRectInclude } from '../../../utils.mjs';

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
    [BoardWaypointSegment.RingOuter]: {
      size: 16,
      color: '#314026'
    },
    [BoardWaypointSegment.RingMiddle]: {
      size: 16,
      color: '#739559'
    },
    [BoardWaypointSegment.RingInner]: {
      size: 16,
      color: '#b5ea8c'
    },
    [BoardWaypointSegment.Element]: {
      size: 16,
      color: '#1684c9'
    },
    [BoardWaypointSegment.Line]: {
      size: 16,
      color: '#8bc2e4'
    },
    [BoardWaypointSegment.Event]: {
      size: 16,
      color: '#fb3f1e'
    }
  };

  /**
   *
   * @returns {BoardWaypointSegment}
   */
  get segment() {
    return this.bwp.segment;
  }

  /**
   *
   * @param {BoardWaypointSegment} value
   */
  set segment(value) {
    this.bwp.segment = value;
  }

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

    /**
     * Rectangle bounds waypoint in canvas absolute coordinates (px)
     * @type {DOMRect}
     * @readonly
     */
    this.rect = new DOMRect();

    /**
     * Is pointer included in the waypoint rect
     * @type {boolean}
     */
    this.hover = false;

    /**
     * Is pointer selected
     * @type {boolean}
     */
    this.selected = false;

    /**
     *
     * @type {EditorWaypointsConnection[]}
     */
    this.connections = [];
  }

  /**
   *
   * @param {MouseEvent} event
   */
  include(event) {
    return DOMRectInclude(this.rect, event.offsetX, event.offsetY);
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {ImageBoardCoreModule} image
   */
  draw(c, image) {
    const [cx, cy] = image.r2a(this.bwp.rx, this.bwp.ry);
    const { size, color } = EditorWaypoint.styles[this.bwp.segment];
    const updatedSize = this.hover ? size + 2 : size;
    const x = this.rect.x = cx - (updatedSize / 2);
    const y = this.rect.y = cy - (updatedSize / 2);
    const w = this.rect.width = updatedSize;
    const h = this.rect.height = updatedSize;
    c.beginPath();
    c.fillStyle = color;
    c.fillRect(x, y, w, h);
    c.closePath();

    if (this.selected) {
      c.beginPath();
      c.strokeStyle = color;
      c.lineWidth = 1;
      c.strokeRect(x - 2, y - 2, w + 4, h + 4);
      c.closePath();
    }
  }
}
