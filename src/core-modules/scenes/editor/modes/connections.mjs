import EditorMode from '../mode.mjs';
import { Cursor } from '../../../../utils.mjs';
import { EditorTheme } from '../../../../theme.mjs';

export default class ConnectionsMode extends EditorMode {
  /**
   *
   * @param {EditorScene} editor
   */
  constructor(editor) {
    super(editor);
    /**
     *
     * @type {[EditorWaypoint, BoardPointerEvent]|undefined}
     * @private
     */
    this._connectionUndone = undefined;
    /**
     *
     * @type {EditorWaypointsConnection|undefined}
     * @private
     */
    this._connectionActive = undefined;
    /**
     *
     * @type {EditorWaypoint|undefined}
     * @private
     */
    this._hover = undefined;
    /**
     *
     * @type {boolean}
     * @private
     */
    this._directed = false;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {ImageBoardCoreModule} image
   */
  draw(c, image) {
    if (this._connectionUndone !== undefined) {
      const [ewp, bpe] = this._connectionUndone;
      const [fx, fy] = image.r2a(ewp.bwp.rx, ewp.bwp.ry);
      c.beginPath();
      c.moveTo(fx, fy);
      c.lineTo(bpe.cx, bpe.cy);
      c.lineWidth = EditorTheme.Connection.Style.Undone.LineWidth;
      c.strokeStyle = EditorTheme.Connection.Style.Undone.Color;
      c.stroke();
      c.closePath();
    }
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {EditorWaypoint} [ewp]
   * @returns {ContextMenuItem[]}
   */
  createContextMenu(bpe, ewp) {
    if (this._connectionActive !== undefined) {
      const ewc = this._connectionActive;
      return [
        { label: ewc.directed ? 'Directed' : 'Non-directed',
          handler: this.toggleDirected.bind(this, bpe, ewc) },
        { label: 'Reverse', active: ewc.directed,
          handler: this.reverseActiveConnection.bind(this, bpe) },
        { label: 'Next', active: ewp !== undefined && ewp.connections.length > 1,
          handler: this.activateNextConnection.bind(this, bpe, ewp, this._connectionActive) },
        { label: 'Delete', handler: this.deleteActiveConnection.bind(this, bpe) },
        { label: 'Cancel', handler: this.deactivateConnection.bind(this, bpe) },
      ];
    }
    if (ewp === undefined) {
      return [
        { label: this._directed ? 'Def. Directed' : 'Def. Non-directed',
          handler: this.toggleDirected.bind(this, bpe, undefined) }
      ];
    }
    return ewp.connections.map((conn, i) => ({
      label: `Connection ${this.editor.connections.indexOf(conn) + 1}`,
      handler: this.activateConnection.bind(this, bpe, ewp, conn, i)
    }));
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
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

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerDown(bpe) {
    const ewp = this.editor.waypoints
      .find(wp => wp.include(bpe.origin));
    if (ewp !== undefined) {
      this._connectionUndone = [ewp, bpe];
      this.cursor = Cursor.Copy;
    }
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerUp(bpe) {
    if (this._connectionUndone !== undefined) {
      this.cursor = Cursor.Default;
      const ewp = this.editor.waypoints
        .find(wp => wp.include(bpe.origin));
      if (ewp !== undefined && ewp !== this._connectionUndone[0]) {
        this.editor.createWaypointsConnection(this._connectionUndone[0], ewp, this._directed);
        this.editor.save();
      }
      this._connectionUndone = undefined;
    }
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {BoardPointerEvent} down
   */
  onPointerTranslate(bpe, down) {
    if (this._connectionUndone !== undefined) {
      this._connectionUndone[1] = bpe;
    }
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {EditorWaypoint} ewp
   * @param {EditorWaypointsConnection} conn
   * @param {number} index Connection index
   * @param {MouseEvent} event
   */
  activateConnection(bpe, ewp, conn, index, event) {
    this.deactivateConnection(bpe, event);
    this._connectionActive = conn;
    this._connectionActive.active = true;
    event.stopPropagation();
    this.editor.onCanvasContextMenu(bpe.origin);
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {EditorWaypoint} ewp
   * @param {EditorWaypointsConnection} ewc
   * @param {MouseEvent} event
   */
  activateNextConnection(bpe, ewp, ewc, event) {
    const index = (ewp.connections.indexOf(ewc) + 1) % ewp.connections.length;
    this.activateConnection(bpe, ewp, ewp.connections[index], index, event);
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {MouseEvent} event
   */
  deactivateConnection(bpe, event) {
    if (this._connectionActive !== undefined) {
      this._connectionActive.active = false;
      this._connectionActive = undefined;
    }
    event.stopPropagation();
    this.editor.onCanvasContextMenu(bpe.origin);
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {MouseEvent} event
   */
  deleteActiveConnection(bpe, event) {
    if (this._connectionActive !== undefined) {
      this.editor.deleteWaypointsConnection(this._connectionActive);
      this.editor.save();
      this.deactivateConnection(bpe, event);
    }
    event.stopPropagation();
    this.editor.onCanvasContextMenu(bpe.origin);
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {EditorWaypointsConnection|undefined} ewc
   * @param {MouseEvent} event
   */
  toggleDirected(bpe, ewc, event) {
    if (ewc === undefined) {
      this._directed = !this._directed;
    } else {
      ewc.directed = !ewc.directed;
    }
    event.stopPropagation();
    this.editor.onCanvasContextMenu(bpe.origin);
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {MouseEvent} event
   */
  reverseActiveConnection(bpe, event) {
    if (this._connectionActive !== undefined) {
      this._connectionActive.reverse();
      this.editor.save();
      if (event !== undefined && bpe !== undefined) {
        event.stopPropagation();
        this.editor.onCanvasContextMenu(bpe.origin);
      }
    }
  }
}
