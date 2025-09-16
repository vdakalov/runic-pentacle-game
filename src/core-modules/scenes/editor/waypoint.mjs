import { BoardWaypointSegment } from '../../board/waypoint.mjs';
import { DOMRectInclude } from '../../../utils.mjs';
import { EditorTheme } from '../../../theme.mjs';

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
    [BoardWaypointSegment.RingOuter]: EditorTheme.Waypoint.SegmentStyle.RingOuter,
    [BoardWaypointSegment.RingMiddle]: EditorTheme.Waypoint.SegmentStyle.RingMiddle,
    [BoardWaypointSegment.RingInner]: EditorTheme.Waypoint.SegmentStyle.RingInner,
    [BoardWaypointSegment.Element]: EditorTheme.Waypoint.SegmentStyle.Element,
    [BoardWaypointSegment.LineVLeft]: EditorTheme.Waypoint.SegmentStyle.Line,
    [BoardWaypointSegment.LineVRight]: EditorTheme.Waypoint.SegmentStyle.Line,
    [BoardWaypointSegment.LineHTop]: EditorTheme.Waypoint.SegmentStyle.Line,
    [BoardWaypointSegment.LineHLeft]: EditorTheme.Waypoint.SegmentStyle.Line,
    [BoardWaypointSegment.LineHRight]: EditorTheme.Waypoint.SegmentStyle.Line,
    [BoardWaypointSegment.Event]: EditorTheme.Waypoint.SegmentStyle.Event
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
    const updatedSize = this.hover ? size * EditorTheme.Waypoint.ResizeOnHover : size;
    const x = this.rect.x = cx - (updatedSize / 2);
    const y = this.rect.y = cy - (updatedSize / 2);
    const w = this.rect.width = updatedSize;
    const h = this.rect.height = updatedSize;
    c.beginPath();
    c.fillStyle = color;
    c.fillRect(x, y, w, h);
    c.closePath();

    if (this.selected) {
      const { LineWidth, Margin } = EditorTheme.Waypoint.SelectionFrame;
      c.beginPath();
      c.strokeStyle = color;
      c.lineWidth = LineWidth;
      c.strokeRect(x - Margin, y - Margin, w + Margin * 2, h + Margin * 2);
      c.closePath();
    }
  }
}
