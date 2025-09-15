import { Cursor } from '../../../../utils.mjs';
import EditorMode from '../mode.mjs';
import BoardWaypoint, { BoardWaypointSegment } from '../../../board/waypoint.mjs';

export default class WayPointsMode extends EditorMode {
  /**
   *
   * @param {EditorScene} editor
   */
  constructor(editor) {
    super(editor);
    this.cursor = Cursor.CrossHair;
    /**
     *
     * @type {BoardWaypointSegment}
     */
    this.segment = BoardWaypointSegment.RingOuter;
    /**
     *
     * @type {EditorWaypoint|undefined}
     */
    this.hover = undefined;
    /**
     *
     * @type {EditorWaypoint|undefined}
     */
    this.active = undefined;
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {EditorWaypoint} [ewp]
   * @returns {ContextMenuItem[]}
   */
  createContextMenu(bpe, ewp) {
    return [
      { label: `Def. Seg.: ${BoardWaypointSegment[this.segment]}`, active: ewp === undefined,
        handler: this.nextSegment.bind(this, bpe) },
      { label: `Wp Seg.: ${ewp && BoardWaypointSegment[ewp.segment]}`, active: ewp !== undefined,
        handler: this.nextSegment.bind(this, bpe, ewp) },
      { label: 'Delete', active: ewp !== undefined,
        handler: this.deleteWaypoint.bind(this, ewp) }
    ];
  }

  onPointerClick(bpe) {
    if (this.editor.cm.opened) {
      return;
    }
    const ewp = this.editor.createWaypoint(this.segment, bpe.rx, bpe.ry);
    ewp.hover = true;
  }

  onPointerMove(bpe) {
    if (this.hover !== undefined) {
      this.hover.hover = false;
    }
    this.hover = this.editor.waypoints
      .find(wp => wp.include(bpe.origin));
    if (this.hover !== undefined) {
      this.hover.hover = true;
      this.cursor = Cursor.Move;
    } else {
      this.cursor = Cursor.CrossHair;
    }
  }

  onPointerDown(bpe) {
    this.active = this.editor.waypoints
      .find(wp => wp.include(bpe.origin));
  }

  onPointerUp(bpe) {
    if (this.active !== undefined) {
      bpe.origin.preventDefault();
    }
    this.active = undefined;
  }

  onPointerTranslate(bpe, down) {
    if (this.active !== undefined) {
      this.active.bwp.rx = bpe.rx;
      this.active.bwp.ry = bpe.ry;
    }
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {EditorWaypoint} [ewp]
   * @param {MouseEvent} event
   */
  nextSegment(bpe, ewp, event) {
    event.stopPropagation();
    if (ewp !== undefined) {
      ewp.segment = BoardWaypoint.getNextSegment(ewp.segment);
    } else {
      this.segment = BoardWaypoint.getNextSegment(this.segment);
    }
    this.editor.onCanvasContextMenu(bpe.origin);
  }

  /**
   *
   * @param {EditorWaypoint} ewp
   */
  deleteWaypoint(ewp) {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    this.editor.deleteWaypoint(ewp);
  }
}
