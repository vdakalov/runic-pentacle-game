import SceneCoreModule from '../../scene/index.mjs';
import ImageBoardCoreModule from '../../board/image.mjs';
import BoardCoreModule from '../../board/index.mjs';
import PointerBoardCoreModule from '../../board/pointer/index.js';
import MenuScene from '../menu.mjs';
import StorageCoreModule from '../../storage.mjs';
import ContextMenuCtrl from '../../context-menu/ctrl.js';
import ActiveTextItem from '../../context-menu/items/active-text.mjs';
import SeparatorItem from '../../context-menu/items/separator.js';
import NormalMode from './modes/normal.mjs';
import WayPointsMode from './modes/waypoints.mjs';
import ConnectionsMode from './modes/connections.mjs';
import SettingsMode from './modes/settings.mjs';
import EditorWaypoint from './waypoint.mjs';
import EditorWaypointsConnection from './waypoints-connection.mjs';
import { EditorTheme } from '../../../theme.mjs';
import { BoardWaypointSegment } from '../../board/waypoint.mjs';
import { TAU } from '../../../utils.mjs';

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
      new SettingsMode(this),
    ];
    /**
     *
     * @type {EditorMode}
     * @private
     */
    this._mode = this._modes[0];

    /**
     *
     * @type {boolean}
     * @private
     */
    this._modeSelection = false;

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
     * @type {ContextMenuCtrl}
     */
    this.cmc = new ContextMenuCtrl(this.canvas.element, this._contextMenuBuilder.bind(this));

    this.pointer.onPointerClick.push(this.onPointerClick = this.onPointerClick.bind(this));
    this.pointer.onPointerMove.push(this.onPointerMove = this.onPointerMove.bind(this));
    this.pointer.onPointerDown.push(this.onPointerDown = this.onPointerDown.bind(this));
    this.pointer.onPointerUp.push(this.onPointerUp = this.onPointerUp.bind(this));
    this.pointer.onPointerTranslate.push(this.onPointerTranslate = this.onPointerTranslate.bind(this));

    this.canvas.clear();

    this.load();
  }

  destroy() {
    this.pointer.onPointerMove.splice(this.pointer.onPointerMove.indexOf(this.onPointerMove), 1);
    this.pointer.onPointerDown.splice(this.pointer.onPointerDown.indexOf(this.onPointerDown), 1);
    this.pointer.onPointerUp.splice(this.pointer.onPointerUp.indexOf(this.onPointerUp), 1);
    this.pointer.onPointerTranslate.splice(this.pointer.onPointerTranslate.indexOf(this.onPointerTranslate), 1);
    this.canvas.cursor = '';
    this.cmc.destroy();
    this.core.unload(
      BoardCoreModule,
      ImageBoardCoreModule,
      PointerBoardCoreModule,
    );
    super.destroy();
  }

  load() {
    this.storage.restore();
    this.board.load();

    this.waypoints = this.board.waypoints
      .map(bwp => new EditorWaypoint(bwp));

    this.connections = this.board.connections
      .map(bwc => {
        const fi = this.board.waypoints.indexOf(bwc.from);
        const ti = this.board.waypoints.indexOf(bwc.to);
        return new EditorWaypointsConnection(this.waypoints[fi], this.waypoints[ti], bwc);
      });
  }

  save() {
    this.board.save();
    this.storage.dump();
  }

  /**
   *
   * @param {MouseEvent} event
   * @returns {ContextMenuItem[]}
   */
  _contextMenuBuilder(event) {
    const bpe = this.pointer.createBoardPointerEvent(event);
    const ewp = this.waypoints.find(wp => wp.include(event));

    /**
     *
     * @type {ContextMenuItem[]}
     */
    const items = this._mode.contextMenuBuilder(bpe, ewp);

    items.push(
      new SeparatorItem(items.length === 0),
      new ActiveTextItem(`Mode: ${this._mode.constructor.name }`, () => {
        this._modeSelection = !this._modeSelection;
        return true;
      }, false, event),
      ...this._modes.map(mode => new ActiveTextItem(mode.constructor.name,
        mode === this._mode ? undefined : this.selectMode.bind(this, mode),
        !this._modeSelection, event)),
      new SeparatorItem(!this._modeSelection)
    );

    items.push(new ActiveTextItem('Close Editor', this.changeScene.bind(this, MenuScene)));
    return items;
  }

  /**
   *
   * @param {EditorMode} mode
   */
  selectMode(mode) {
    this._mode = mode;
    this._modeSelection = false;
    return true;
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
   * @param {boolean} [directed]
   * @returns {EditorWaypointsConnection}
   */
  createWaypointsConnection(from, to, directed) {
    const bwc = this.board.createWaypointsConnection(from.bwp, to.bwp, directed);
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
    for (const ewp of this.waypoints) {
      ewp.draw(this.canvas.c, this.image);
    }

    for (const [segment, bwp] of this.board.startings.entries()) {
      const [x, y] = this.image.r2a(bwp.rx, bwp.ry);
      let theme = { size: 6, color: '#ffffff' };
      switch (segment) {
        case BoardWaypointSegment.RingOuter: theme = EditorTheme.Waypoint.StartingMarks.RingOuter; break;
        case BoardWaypointSegment.RingMiddle: theme = EditorTheme.Waypoint.StartingMarks.RingMiddle; break;
        case BoardWaypointSegment.RingInner: theme = EditorTheme.Waypoint.StartingMarks.RingInner; break;
      }
      const { color, size } = theme;
      this.canvas.c.beginPath();
      this.canvas.c.arc(x, y, size, 0, TAU);
      this.canvas.c.fillStyle = color;
      this.canvas.c.fill();
      this.canvas.c.closePath();
    }
  }
}
