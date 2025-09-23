import EditorMode from '../mode.mjs';
import { BoardWaypointSegment } from '../../../core-modules/board/waypoint.mjs';
import ActiveTextItem from '../../../context-menu/items/active-text.mjs';

export default class SettingsMode extends EditorMode {

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {EditorWaypoint} [ewp]
   * @returns {ContextMenuItem[]}
   */
  contextMenuBuilder(bpe, ewp) {
    const lOut = BoardWaypointSegment[BoardWaypointSegment.RingOuter];
    const lMid = BoardWaypointSegment[BoardWaypointSegment.RingMiddle];
    const lInn = BoardWaypointSegment[BoardWaypointSegment.RingInner];
    const bwpOut = this.editor.board.startings[BoardWaypointSegment.RingOuter];
    const bwpMid = this.editor.board.startings[BoardWaypointSegment.RingMiddle];
    const bwpInn = this.editor.board.startings[BoardWaypointSegment.RingInner];
    if (ewp === undefined) {
      return [
        new ActiveTextItem(`Unset starting for ${lOut}`,
          this.toggleStart.bind(this, undefined), bwpOut === undefined),
        new ActiveTextItem(`Unset starting for ${lMid}`,
          this.toggleStart.bind(this, undefined), bwpMid === undefined),
        new ActiveTextItem(`Unset starting for ${lInn}`,
          this.toggleStart.bind(this, undefined), bwpInn === undefined)
      ];
    }
    return [
      new ActiveTextItem(
        bwpOut === ewp.bwp
          ? `Unset starting for ${lOut}`
          : `Set as starting for ${lOut}`,
        this.toggleStart.bind(this, ewp, BoardWaypointSegment.RingOuter)),
      new ActiveTextItem(
        bwpMid === ewp.bwp
          ? `Unset starting for ${lMid}`
          : `Set as starting for ${lMid}`,
        this.toggleStart.bind(this, ewp, BoardWaypointSegment.RingMiddle)),
      new ActiveTextItem(
        bwpInn === ewp.bwp
          ? `Unset starting for ${lInn}`
          : `Set as starting for ${lInn}`,
        this.toggleStart.bind(this, ewp, BoardWaypointSegment.RingInner))
    ];
  }

  /**
   *
   * @param {EditorWaypoint} ewp
   * @param {BoardWaypointSegment} segment
   */
  toggleStart(ewp, segment) {
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
    return true;
  }
}
