import SceneCoreModule from '../../scene/index.mjs';
import ImageBoardCoreModule from '../../board/image.mjs';
import BoardCoreModule from '../../board/index.mjs';
import PointerBoardCoreModule from '../../board/pointer/index.js';
import ContextMenuCoreModule from '../../context-menu.mjs';
import MenuScene from '../menu.mjs';
import StorageCoreModule from '../../storage.mjs';
import NormalMode from './modes/normal.mjs';
import WayPointsMode from './modes/waypoints.mjs';
import ConnectionsMode from './modes/connections.mjs';
import EditorWaypoint from './waypoint.mjs';
import EditorWaypointsConnection from './waypoints-connection.mjs';
import { getPointBetween } from '../../../utils.mjs';

export default class EditorScene extends SceneCoreModule {

  constructor(core) {
    super(core);

    /**
     *
     * @type {EditorWaypoint[]}
     */
    this.waypoints = [];

    /**
     *
     * @type {EditorWaypointsConnection[]}
     */
    this.connections = [];

    /**
     *
     * @type {(typeof EditorMode)[]}
     * @readonly
     * @private
     */
    this._modes = [
      new NormalMode(this),
      new WayPointsMode(this),
      new ConnectionsMode(this),
    ];
    /**
     *
     * @type {EditorMode}
     * @private
     */
    this._mode = this._modes[0];

    this.core.load(
      BoardCoreModule,
      ImageBoardCoreModule,
      PointerBoardCoreModule,
    );

    /**
     *
     * @type {StorageCoreModule}
     * @private
     */
    this.storage = this.core.get(StorageCoreModule);
    /**
     *
     * @type {BoardCoreModule}
     */
    this.board = this.core.get(BoardCoreModule);
    /**
     *
     * @type {ImageBoardCoreModule}
     */
    this.image = this.core.get(ImageBoardCoreModule);
    /**
     *
     * @type {PointerBoardCoreModule}
     */
    this.pointer = this.core.get(PointerBoardCoreModule);
    /**
     *
     * @type {ContextMenuCoreModule}
     */
    this.cm = this.core.get(ContextMenuCoreModule);

    this.canvas.element.addEventListener('contextmenu',
      this.onCanvasContextMenu = this.onCanvasContextMenu.bind(this));

    this.pointer.onPointerClick.push(this.onPointerClick = this.onPointerClick.bind(this));
    this.pointer.onPointerMove.push(this.onPointerMove = this.onPointerMove.bind(this));
    this.pointer.onPointerDown.push(this.onPointerDown = this.onPointerDown.bind(this));
    this.pointer.onPointerUp.push(this.onPointerUp = this.onPointerUp.bind(this));
    this.pointer.onPointerTranslate.push(this.onPointerTranslate = this.onPointerTranslate.bind(this));

    this.canvas.clear();
  }

  destroy() {
    this.pointer.onPointerMove.splice(this.pointer.onPointerMove.indexOf(this.onPointerMove), 1);
    this.pointer.onPointerDown.splice(this.pointer.onPointerDown.indexOf(this.onPointerDown), 1);
    this.pointer.onPointerUp.splice(this.pointer.onPointerUp.indexOf(this.onPointerUp), 1);
    this.pointer.onPointerTranslate.splice(this.pointer.onPointerTranslate.indexOf(this.onPointerTranslate), 1);
    this.canvas.cursor = '';
    this.canvas.element.removeEventListener('contextmenu', this.onCanvasContextMenu);
    this.core.unload(
      BoardCoreModule,
      ImageBoardCoreModule,
      PointerBoardCoreModule,
    );
    super.destroy();
  }

  /**
   *
   * @param {MouseEvent} event
   */
  onCanvasContextMenu(event) {
    event.preventDefault();
    const bpe = this.pointer.createBoardPointerEvent(event);
    const ewp = this.waypoints.find(wp => wp.include(event));

    /**
     *
     * @type {ContextMenuItem[]}
     */
    const items = this._mode.createContextMenu(bpe, ewp);

    items.push(
      { active: items.length !== 0 },
      { label: `Mode: ${this._mode.constructor.name }`,
        handler: this.nextMode.bind(this, event) },
      { label: 'Close Editor',
        handler: this.close.bind(this) });
    this.cm.openAtMouseEvent(event, items);
  }

  /**
   *
   * @param {MouseEvent} origin
   * @param {MouseEvent} event
   */
  nextMode(origin, event) {
    event.stopPropagation();
    const index = this._modes.indexOf(this._mode);
    const next = (index + 1) % this._modes.length;
    this._mode = this._modes[next];
    this.onCanvasContextMenu(origin);
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerClick(bpe) {
    this._mode.onPointerClick(bpe);
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerMove(bpe) {
    this._mode.onPointerMove(bpe);
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerDown(bpe) {
    this._mode.onPointerDown(bpe);
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerUp(bpe) {
    this._mode.onPointerUp(bpe);
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {BoardPointerEvent} down
   */
  onPointerTranslate(bpe, down) {
    this._mode.onPointerTranslate(bpe, down);
  }

  /**
   * Returns canvas absolute point (in px) between two waypoints with angle
   * @param {EditorWaypoint} a
   * @param {EditorWaypoint} b
   * @param {number} distance
   * @return {[x: number, y: number, a: number]}
   */
  getPointBetweenWaypoints(a, b, distance) {
    const ax = a.rect.x + (a.rect.width / 2);
    const ay = a.rect.y + (a.rect.height / 2);
    const bx = b.rect.x + (b.rect.width / 2);
    const by = b.rect.y + (b.rect.height / 2);
    return getPointBetween(ax, ay, bx, by, distance);
  }

  /**
   *
   * @param {BoardWaypointSegment} segment
   * @param {number} rx
   * @param {number} ry
   * @returns {EditorWaypoint}
   */
  createWaypoint(segment, rx, ry) {
    const bwp = this.board.createWaypoint(segment, rx, ry);
    const ewp = new EditorWaypoint(bwp);
    this.waypoints.push(ewp);
    return ewp;
  }

  /**
   *
   * @param {EditorWaypoint} ewp
   */
  deleteWaypoint(ewp) {
    this.waypoints.splice(this.waypoints.indexOf(ewp), 1);
    this.board.deleteWaypoint(ewp.bwp);
  }

  /**
   *
   * @param {EditorWaypoint} from
   * @param {EditorWaypoint} to
   * @returns {EditorWaypointsConnection}
   */
  createWaypointsConnection(from, to) {
    const bwc = this.board.createWaypointsConnection(from.bwp, to.bwp);
    const conn = new EditorWaypointsConnection(from, to, bwc);
    this.connections.push(conn);
    return conn;
  }

  /**
   *
   * @param {EditorWaypointsConnection} ewc
   */
  deleteWaypointsConnection(ewc) {
    this.board.deleteWaypointsConnection(ewc.bwc);
    const index = this.connections.indexOf(ewc);
    if (index !== -1) {
      this.connections.splice(index, 1);
      ewc.destroy();
    }
  }

  draw() {
    this.canvas.cursor = this._mode.cursor;

    this._mode.draw(this.canvas.c, this.image);

    // draw connections
    for (const conn of this.connections) {
      conn.draw(this.canvas.c, this.image);
    }

    // draw waypoints
    for (const wp of this.waypoints) {
      wp.draw(this.canvas.c, this.image);
    }
  }

  close(force = false) {
    if (force !== true && !window.confirm('Are you sure?')) {
      return;
    }
    this.changeScene(MenuScene);
  }
}
