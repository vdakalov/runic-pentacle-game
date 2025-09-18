import EditorMode from '../mode.mjs';
import { Cursor } from '../../../../utils.mjs';
import { EditorTheme } from '../../../../theme.mjs';
import ActiveTextItem from '../../../context-menu/items/active-text.mjs';

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
  contextMenuBuilder(bpe, ewp) {
    if (this._connectionActive !== undefined) {
      const ewc = this._connectionActive;
      return [
        new ActiveTextItem(ewc.directed ? 'Directed' : 'Non-directed',
          this.toggleDirected.bind(this, ewc), false, bpe.origin),
        new ActiveTextItem('Reverse', this.reverseActiveConnection.bind(this, ewc),
          !ewc.directed, bpe.origin),
        new ActiveTextItem('Next', this.activateNextConnection.bind(this, ewp, ewc),
          ewp === undefined || 2 > ewp.connections.length, bpe.origin),
        new ActiveTextItem('Delete', this.deleteConnection.bind(this, ewc), false, bpe.origin),
        new ActiveTextItem('Cancel', this.deactivateConnection.bind(this), false, bpe.origin),
      ];
    }
    if (ewp === undefined) {
      return [
        new ActiveTextItem(this._directed ? 'Def. Directed' : 'Def. Non-directed',
          this.toggleDirected.bind(this, undefined), false, bpe.origin)
      ];
    }
    return ewp.connections.map(ewc => new ActiveTextItem(
      `Connection ${this.editor.connections.indexOf(ewc) + 1}`,
      this.activateConnection.bind(this, ewc), false, bpe.origin));
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
   * @param {EditorWaypointsConnection} conn
   */
  activateConnection(conn) {
    this.deactivateConnection();
    this._connectionActive = conn;
    this._connectionActive.active = true;
    return true;
  }

  /**
   *
   * @param {EditorWaypoint} ewp
   * @param {EditorWaypointsConnection} ewc
   */
  activateNextConnection(ewp, ewc) {
    const index = (ewp.connections.indexOf(ewc) + 1) % ewp.connections.length;
    return this.activateConnection(ewp.connections[index]);
  }

  deactivateConnection() {
    if (this._connectionActive !== undefined) {
      this._connectionActive.active = false;
      this._connectionActive = undefined;
    }
    return true;
  }

  /**
   *
   * @param {EditorWaypointsConnection} ewc
   */
  deleteConnection(ewc) {
    this.editor.deleteWaypointsConnection(ewc);
    this.editor.save();
    if (this._connectionActive === ewc) {
      this.deactivateConnection();
    }
    return true;
  }

  /**
   *
   * @param {EditorWaypointsConnection|undefined} ewc
   */
  toggleDirected(ewc) {
    if (ewc === undefined) {
      this._directed = !this._directed;
    } else {
      ewc.directed = !ewc.directed;
    }
    return true;
  }

  /**
   *
   * @param {EditorWaypointsConnection} ewc
   * @returns {boolean}
   */
  reverseActiveConnection(ewc) {
    ewc.reverse();
    this.editor.save();
    return true;
  }
}
