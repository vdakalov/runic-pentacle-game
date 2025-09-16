import EditorMode from '../mode.mjs';
import { BoardWaypointSegment } from '../../../board/waypoint.mjs';

export default class SettingsMode extends EditorMode {

  /**
   *
   * @param {EditorScene} editor
   */
  constructor(editor) {
    super(editor);
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {EditorWaypoint} [ewp]
   * @returns {ContextMenuItem[]}
   */
  createContextMenu(bpe, ewp) {
    const lOut = BoardWaypointSegment[BoardWaypointSegment.RingOuter];
    const lMid = BoardWaypointSegment[BoardWaypointSegment.RingMiddle];
    const lInn = BoardWaypointSegment[BoardWaypointSegment.RingInner];
    const bwpOut = this.editor.board.startings[BoardWaypointSegment.RingOuter];
    const bwpMid = this.editor.board.startings[BoardWaypointSegment.RingMiddle];
    const bwpInn = this.editor.board.startings[BoardWaypointSegment.RingInner];
    if (ewp === undefined) {
      return [
        { label: `Unset starting for ${lOut}`, active: bwpOut !== undefined,
          handler: () => this.toggleStart.bind(this, bpe, undefined) },
        { label: `Unset starting for ${lMid}`, active: bwpMid !== undefined,
          handler: () => this.toggleStart.bind(this, bpe, undefined) },
        { label: `Unset starting for ${lInn}`, active: bwpInn !== undefined,
          handler: () => this.toggleStart.bind(this, bpe, undefined) },
      ];
    }
    return [
      { label: bwpOut === ewp.bwp
          ? `Unset starting for ${lOut}`
          : `Set as starting for ${lOut}`,
        handler: this.toggleStart.bind(this, bpe, ewp, BoardWaypointSegment.RingOuter) },
      { label: bwpMid === ewp.bwp
          ? `Unset starting for ${lMid}`
          : `Set as starting for ${lMid}`,
        handler: this.toggleStart.bind(this, bpe, ewp, BoardWaypointSegment.RingMiddle) },
      { label: bwpInn === ewp.bwp
          ? `Unset starting for ${lInn}`
          : `Set as starting for ${lInn}`,
        handler: this.toggleStart.bind(this, bpe, ewp, BoardWaypointSegment.RingInner) }
    ];
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {EditorWaypoint} ewp
   * @param {BoardWaypointSegment} segment
   * @param {MouseEvent} event
   */
  toggleStart(bpe, ewp, segment, event) {
    if (this.editor.board.startings[segment] !== undefined && ewp !== undefined) {
      if (this.editor.board.startings[segment] === ewp.bwp) {
        this.editor.board.startings[segment] = undefined;
      } else {
        this.editor.board.startings[segment] = ewp.bwp;
      }
    } else if (ewp === undefined) {
      this.editor.board.startings[segment] = undefined;
    } else if (this.editor.board.startings[segment] === undefined) {
      this.editor.board.startings[segment] = ewp.bwp;
    }
    this.editor.save();
    event.stopPropagation();
    this.editor.onCanvasContextMenu(bpe.origin);
  }
}
