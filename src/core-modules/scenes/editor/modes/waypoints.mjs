import { Cursor } from '../../../../utils.mjs';
import EditorMode from '../mode.mjs';
import BoardWaypoint, { BoardWaypointSegment } from '../../../board/waypoint.mjs';

class EditorWaypointSelection {
  /**
   *
   * @param {EditorWaypoint} ewp
   */
  constructor(ewp) {
    /**
     *
     * @type {EditorWaypoint}
     * @readonly
     */
    this.ewp = ewp;
    /**
     *
     * @type {number}
     * @readonly
     */
    this.rx = this.ewp.bwp.rx;
    /**
     *
     * @type {number}
     * @readonly
     */
    this.ry = this.ewp.bwp.ry;

    this.ewp.selected = true;
  }

  destroy() {
    this.ewp.selected = false;
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {BoardPointerEvent} down
   */
  move(bpe, down) {
    this.ewp.bwp.rx = this.rx + (bpe.rx - down.rx);
    this.ewp.bwp.ry = this.ry + (bpe.ry - down.ry);
  }
}

export default class WayPointsMode extends EditorMode {
  /**
   *
   * @param {EditorScene} editor
   */
  constructor(editor) {
    super(editor);
    /**
     *
     * @type {string}
     */
    this.cursor = Cursor.CrossHair;
    /**
     *
     * @type {BoardWaypointSegment}
     */
    this.segment = BoardWaypointSegment.RingOuter;
    /**
     *
     * @type {EditorWaypoint|undefined}
     * @private
     */
    this._hovered = undefined;
    /**
     *
     * @type {EditorWaypointSelection[]}
     */
    this.selections = [];
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

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerClick(bpe) {
    if (this.editor.cm.opened) {
      return;
    }
    const ewp = this.editor.waypoints.find(wp => wp.include(bpe.origin));
    if (ewp === undefined) {
      const ewp = this.editor.createWaypoint(this.segment, bpe.rx, bpe.ry)
      this.setHover(ewp);
      this.setSelected([ewp]);
    }
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerMove(bpe) {
    const ewp = this.editor.waypoints
      .find(wp => wp.include(bpe.origin));
    if (ewp !== undefined) {
      this.setHover(ewp);
      this.cursor = Cursor.Move;
    } else {
      this.unsetHover();
      this.cursor = Cursor.CrossHair;
    }
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerDown(bpe) {
    const ewp = this.editor.waypoints
      .find(wp => wp.include(bpe.origin));
    if (ewp !== undefined) {
      if (!this.isSelected(ewp)) {
        this.setSelected([ewp], bpe.origin.ctrlKey);
      }
    } else {
      this.deselectAll();
    }
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerUp(bpe) {
    if (this.selections.length !== 0) {
      bpe.origin.preventDefault();
    }
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {BoardPointerEvent} down
   */
  onPointerTranslate(bpe, down) {
    for (const ews of this.selections) {
      ews.move(bpe, down);
    }
  }

  /**
   *
   * @param {EditorWaypoint} ewp
   */
  setHover(ewp) {
    if (this._hovered === ewp) {
      return;
    }
    this.unsetHover();
    this._hovered = ewp;
    this._hovered.hover = true;
  }

  unsetHover() {
    if (this._hovered !== undefined) {
      this._hovered.hover = false;
      this._hovered = undefined;
    }
  }

  /**
   *
   * @param {EditorWaypoint} ewp
   * @return {boolean}
   */
  isSelected(ewp) {
    return this.selections.find(ews => ews.ewp === ewp) !== undefined;
  }

  /**
   *
   * @param {EditorWaypoint[]} wps
   * @param {boolean} [append=false]
   */
  setSelected(wps, append = false) {
    if (append === false) {
      this.deselectAll();
    }
    for (const ewp of wps) {
      this.selections.push(new EditorWaypointSelection(ewp));
    }
  }

  deselectAll() {
    while (this.selections.length !== 0) {
      this.selections.pop().destroy();
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
