import EditorMode from '../mode.mjs';
import { Cursor } from '../../../../utils.mjs';

export default class ConnectionsMode extends EditorMode {
  /**
   *
   * @param {EditorScene} editor
   */
  constructor(editor) {
    super(editor);
    /**
     *
     * @type {EditorWaypoint|undefined}
     * @private
     */
    this._from = undefined;
    /**
     *
     * @type {EditorWaypoint|undefined}
     * @private
     */
    this._hover = undefined;
  }

  createContextMenu(bpe, ewp) {
    return ewp.connections.map((conn, i) => ({
      label: `Connection ${i + 1}`,
      handler: this.selectConnection.bind(this, ewp, conn, i)
    }));
  }

  onPointerMove(bpe) {
    if (this._hover !== undefined) {
      this._hover.hover = false;
      this._hover = undefined;
    }
    const ewp = this.editor.waypoints
      .find(wp => wp.include(bpe.origin));
    if (ewp !== undefined) {
      ewp.hover = true;
      this._hover = ewp;
    }
  }

  onPointerDown(bpe) {
    const ewp = this.editor.waypoints
      .find(wp => wp.include(bpe.origin));
    if (ewp !== undefined) {
      this._from = ewp;
      this.cursor = Cursor.Copy;
    }
  }

  onPointerUp(bpe) {
    if (this._from !== undefined) {
      this.editor.connection = undefined;
      this.cursor = Cursor.Default;
      const ewp = this.editor.waypoints
        .find(wp => wp.include(bpe.origin));
      if (ewp !== undefined && ewp !== this._from) {
        this.editor.createWaypointsConnection(this._from, ewp);
      }
      this._from = undefined;
    }
  }

  onPointerTranslate(bpe, down) {
    if (this._from !== undefined) {
      this.editor.connection = [this._from, bpe];
    }
  }

  /**
   *
   * @param {EditorWaypoint} ewp
   * @param {EditorWaypointsConnection} conn
   * @param {number} index Connection index
   * @param {MouseEvent} event
   */
  selectConnection(ewp, conn, index, event) {
    // todo continue here...
  }
}
