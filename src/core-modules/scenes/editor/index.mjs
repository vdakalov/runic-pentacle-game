import SceneCoreModule from '../../scene/index.mjs';
import ImageBoardCoreModule from '../../board/image.mjs';
import BoardCoreModule, { BoardWaypointKind } from '../../board/index.mjs';
import PointerBoardCoreModule from '../../board/pointer.js';
import ContextMenuCoreModule from '../../context-menu.mjs';
import MenuScene from '../menu.mjs';
import { createEnum, DOMRectInclude } from '../../../utils.mjs';
import StorageCoreModule from '../../storage.mjs';

/**
 *
 * @enum {number}
 * @readonly
 */
const EditorModeId = createEnum({
  Normal: 0,
  WayPoints: 1,
  Connections: 2
});

export default class EditorScene extends SceneCoreModule {

  /**
   *
   * @return {EditorMode}
   */
  get mode() {
    return this.modes[this.modePointer]
  }

  constructor(core) {
    super(core);

    /**
     * @typedef {Object} EditorWaypointStyle
     * @property {number} size
     * @property {string} color
     */
    /**
     * Waypoint style
     * @type {Object.<string, EditorWaypointStyle>}
     */
    this.wps = {
      [BoardWaypointKind.TrackOuter]: {
        size: 16,
        color: '#314026'
      },
      [BoardWaypointKind.TrackMiddle]: {
        size: 16,
        color: '#739559'
      },
      [BoardWaypointKind.TrackInner]: {
        size: 16,
        color: '#b5ea8c'
      },
      [BoardWaypointKind.Nature]: {
        size: 16,
        color: '#1684c9'
      },
      [BoardWaypointKind.Line]: {
        size: 16,
        color: '#8bc2e4'
      },
      [BoardWaypointKind.Event]: {
        size: 16,
        color: '#fb3f1e'
      }
    };

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
    this._storage = this.core.get(StorageCoreModule);
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

    /**
     * @typedef {Object} EditorWaypoint
     * @property {BoardWaypoint} bwp
     * @property {DOMRectReadOnly} rect
     * @property {EditorWaypoint[]} prev
     * @property {EditorWaypoint[]} next
     * @property {boolean} hover
     * @property {boolean} active
     */
    /**
     *
     * @type {EditorWaypoint[]}
     */
    this._waypoints = [];
    /**
     *
     * @type {BoardWaypointKind}
     * @private
     */
    this._waypointDefaultKind = BoardWaypointKind.TrackOuter;
    /**
     *
     * @type {BoardWaypointKind[]}
     * @private
     */
    this._waypointStartings = [
      BoardWaypointKind.TrackOuter,
      BoardWaypointKind.TrackMiddle,
      BoardWaypointKind.TrackInner,
    ];
    /**
     *
     * @type {EditorWaypoint|undefined}
     * @private
     */
    this._waypointHover = undefined;
    /**
     *
     * @type {EditorWaypoint|undefined}
     * @private
     */
    this._waypointActive = undefined;
    /**
     *
     * @type {EditorWaypoint|undefined}
     * @private
     */
    this._waypointToConnect = undefined;
    /**
     *
     * @type {EditorWaypoint|undefined}
     * @private
     */
    this._waypointToDisconnect = undefined;

    this.canvas.element.addEventListener('click', this.onCanvasClick = this.onCanvasClick.bind(this));
    this.canvas.element.addEventListener('contextmenu',
      this.onCanvasContextMenu = this.onCanvasContextMenu.bind(this));

    this.canvas.clear();

    /**
     * @typedef {Object} EditorMode
     * @property {number} id
     * @property {string} label
     * @property {string} cursor
     */
    /**
     *
     * @type {EditorMode[]}
     */
    this.modes = [
      { id: EditorModeId.Normal, label: 'Normal', cursor: '' },
      { id: EditorModeId.WayPoints, label: 'Way points', cursor: 'crosshair' },
      { id: EditorModeId.Connections, label: 'Connections', cursor: 'copy' }
    ];
    /**
     *
     * @type {number}
     */
    this.modePointer = 0;

    this.pointer.onPointerMove.push(this.onPointerMove = this.onPointerMove.bind(this));
    this.pointer.onPointerDown.push(this.onPointerDown = this.onPointerDown.bind(this));
    this.pointer.onPointerUp.push(this.onPointerUp = this.onPointerUp.bind(this));
    this.pointer.onPointerTranslate.push(this.onPointerTranslate = this.onPointerTranslate.bind(this));

    this._load();
  }

  destroy() {
    this.canvas.cursor = '';
    this.canvas.element.addEventListener('click', this.onCanvasClick);
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
    const data = this.pointer.createEventData(event);
    const ewp = this._getWaypointByPointerEventData(data);
    /**
     *
     * @type {ContextMenuItem[]}
     */
    const items = [
      { label: `Mode: ${this.mode.label}`, handler: this.nextMode.bind(this) },
    ];

    switch (this.mode.id) {
      case EditorModeId.WayPoints:
        items.push(
          { label: '', handler() {} },
          { label: 'Create Waypoint',
            handler: () => { this._createWaypoint(data); } });
        if (ewp !== undefined) {
          if (this._waypointToConnect === undefined) {
            items.push({ label: 'Connect wps', handler: () => this._waypointToConnect = ewp });
          } else if (ewp === this._waypointToConnect) {
            items.push({ label: 'Cancel connection', handler: () => this._waypointToConnect = undefined });
          } else {
            const prev = this._waypointToConnect;
            items.push({ label: 'Select to connect', handler: () => {
              this._connectWaypoints(prev, ewp);
              this._waypointToConnect = undefined;
              } });
          }
          if (ewp.next.length !== 0 || ewp.prev.length !== 0) {
            if (this._waypointToDisconnect === undefined) {
              items.push({ label: 'Disconnect wps', handler: () => this._waypointToDisconnect = ewp });
            } else if (ewp === this._waypointToDisconnect) {
              items.push({ label: 'Cancel disconnection', handler: () => this._waypointToDisconnect = undefined });
            } else {
              const target = this._waypointToDisconnect;
              items.push({ label: 'Select to disconnect', handler: () => {
                this._disconnectWaypoints(target, ewp);
                this._waypointToDisconnect = undefined;
                } });
            }
          }
          const kind = BoardWaypointKind[ewp.bwp.kind];
          items.push({ label: `Kind: ${kind}`, handler: () => this.nextBwpKind(ewp.bwp) });


          // CM-ITEM: STARTED

          /**
           *
           * @type {BoardWaypointKind[]}
           */
          const startLabel = ewp.bwp.starting === undefined
            ? 'None' : BoardWaypointKind[ewp.bwp.starting];
          items.push({ label: `Started: ${startLabel}`,
            handler: () => this._switchWaypointStarting(ewp) });

          // CM-ITEM: delete

          items.push({ label: 'Delete', handler: () => this._deleteWaypoint(ewp) });
        }
        break;
    }

    items.push(
      // { label: '', handler() {} },
      // { label: 'Load', handler: () => this._load() },
      // { label: 'Save', handler: () => this._save() },
      { label: '', handler() {} },
      { label: 'Close Editor', handler: this.close.bind(this) });
    this.cm.openAtMouseEvent(event, items);
  }

  /**
   *
   * @param {MouseEvent} event
   */
  onCanvasClick(event) {
    // if (this.mode.id === EditorModeId.WayPoints) {
    //   const data = this.pointer.createEventData(event);
    //   this._createWaypoint(data);
    //   console.log('Waypoint created');
    // }
  }

  /**
   *
   * @param {BoardWaypoint} bwp
   * @private
   */
  _initWaypoint(bwp) {
    return {
      bwp,
      rect: new DOMRect(),
      prev: [], next: [],
      hover: false, active: false
    };
  }

  _loadWaypoints() {
    this._waypoints = this.board.waypoints
      .map(bwp => this._initWaypoint(bwp));
    for (const ewp of this._waypoints) {
      for (const next of ewp.bwp.next) {
        const index = this.board.waypoints.indexOf(next);
        ewp.next.push(this._waypoints[index]);
        this._waypoints[index].prev.push(ewp);
      }
    }
  }

  /**
   *
   * @param {PointerEventData} data
   * @returns {EditorWaypoint}
   * @private
   */
  _createWaypoint(data) {
    const bwp = this.board.createWaypoint(this._waypointDefaultKind, data.extra.left, data.extra.top);
    /**
     *
     * @type {EditorWaypoint}
     */
    const ewp = this._initWaypoint(bwp);
    this._waypoints.push(ewp);
    this._save();
    return ewp;
  }

  /**
   *
   * @param {PointerEventData} data
   * @returns {EditorWaypoint}
   * @private
   */
  _getWaypointByPointerEventData(data) {
    const { ax, ay } = data.extra;
    return this._waypoints
      .find(wp => DOMRectInclude(wp.rect, ax, ay));
  }

  /**
   *
   * @param {EditorWaypoint} from
   * @param {EditorWaypoint} to
   * @private
   */
  _connectWaypoints(from, to) {
    if (from.prev.indexOf(to) !== -1) {
      return; // backward connection exists
    }
    if (from.next.indexOf(to) === -1) {
      this.board.connectWaypoints(from.bwp, to.bwp);
      from.next.push(to);
      to.prev.push(from);
      this._save();
    }
  }

  /**
   *
   * @param {EditorWaypoint} a
   * @param {EditorWaypoint} b
   * @private
   */
  _disconnectWaypoints(a, b) {
    const ani = a.next.indexOf(b);
    const api = a.prev.indexOf(b);
    const bni = b.next.indexOf(a);
    const bpi = b.prev.indexOf(a);
    if (ani !== -1) {
      this.board.disconnectWaypoints(a.bwp, b.bwp);
      a.next.splice(ani, 1);
    }
    if (api !== -1) {
      this.board.disconnectWaypoints(b.bwp, a.bwp);
      a.prev.splice(api, 1);
    }
    if (bni !== -1) {
      this.board.disconnectWaypoints(b.bwp, a.bwp);
      b.next.splice(bni, 1);
    }
    if (bpi !== -1) {
      this.board.disconnectWaypoints(a.bwp, b.bwp);
      b.prev.splice(bpi, 1);
    }
    this._save();
  }

  /**
   *
   * @param {EditorWaypoint} ewp
   * @private
   */
  _switchWaypointStarting(ewp) {
    if (ewp.bwp.starting === undefined) {
      this.board.setWaypointStartingKind(ewp.bwp, this._waypointStartings[0]);
    } else {
      const next = /** @type {BoardWaypointKind} */ ewp.bwp.starting + 1;
      if (next >= this._waypointStartings.length) {
        this.board.unsetStartingKinds([ewp.bwp.starting]);
      } else {
        this.board.setWaypointStartingKind(ewp.bwp, next);
      }
    }
    this._save();
  }

  /**
   *
   * @param {EditorWaypoint} ewp
   * @private
   */
  _deleteWaypoint(ewp) {
    if (!window.confirm('Are you sure?')) {
      return;
    }
    for (const prev of ewp.prev) {
      this._disconnectWaypoints(ewp, prev);
    }
    for (const next of ewp.next) {
      this._disconnectWaypoints(ewp, next);
    }
    this.board.deleteWaypoint(ewp.bwp);
    const index = this._waypoints.indexOf(ewp);
    if (index !== -1) {
      this._waypoints.splice(index, 1);
      this._save();
    }
  }

  nextMode() {
    this.modePointer = (this.modePointer + 1) % this.modes.length;
    const mode = this.modes[this.modePointer];
    this.canvas.cursor = mode.cursor;
  }

  /**
   *
   * @param {BoardWaypoint} bwp
   * @returns {BoardWaypointKind}
   */
  nextBwpKind(bwp) {
    if (BoardWaypointKind[bwp.kind + 1] !== undefined) {
      bwp.kind += 1;
    } else {
      bwp.kind = 0;
    }
    this._save();
    return this._waypointDefaultKind = bwp.kind;
  }

  /**
   *
   * @param {PointerEventData} data
   */
  onPointerMove(data) {
    if (this.mode.id === EditorModeId.WayPoints) {
      if (this._waypointHover !== undefined) {
        this._waypointHover.hover = false;
        this._waypointHover = undefined;
      }
      // update wp hover
      for (const ewp of this._waypoints) {
        if (DOMRectInclude(ewp.rect, data.extra.ax, data.extra.ay)) {
          this._waypointHover = ewp;
          ewp.hover = true;
          break;
        }
      }
      if (this._waypointHover !== undefined) {
        this.canvas.cursor = 'pointer';
      } else {
        this.canvas.cursor = this.mode.cursor;
      }
    }
  }

  onPointerDown(data) {
    if (this.mode.id === EditorModeId.WayPoints) {
      this._waypointActive = this._waypointHover;
    }
  }

  onPointerUp(data) {
    if (this.mode.id === EditorModeId.WayPoints) {
      if (this._waypointActive !== undefined) {
        this._save();
      }
      this._waypointActive = undefined;
    }
  }

  /**
   *
   * @param {PointerEventData} data
   */
  onPointerTranslate(data) {
    if (this.mode.id === EditorModeId.WayPoints && this._waypointActive !== undefined) {
      const ewp = this._waypointActive;
      const { size } = this.wps[ewp.bwp.kind];
      ewp.rect.x = data.extra.ax - (size / 2);
      ewp.rect.y = data.extra.ay - (size / 2);
      ewp.bwp.left = data.extra.left;
      ewp.bwp.top = data.extra.top;
    }
  }

  draw() {
    this.drawBoardWayPoints();
  }

  drawBoardWayPoints() {
    for (const ewp of this._waypoints) {
      const [ax, ay] = this.image.r2a(ewp.bwp.left, ewp.bwp.top);
      const { size, color } = this.wps[ewp.bwp.kind];
      const x = ewp.rect.x = ax - (size / 2);
      const y = ewp.rect.y = ay - (size / 2);
      const w = ewp.rect.width = size;
      const h = ewp.rect.height = size;
      this.canvas.c.beginPath();
      this.canvas.c.fillStyle = color;
      this.canvas.c.fillRect(x, y, w, h);
      this.canvas.c.closePath();
      if (ewp.bwp.starting !== undefined) {
        const { color } = this.wps[ewp.bwp.starting];
        this.canvas.c.beginPath();
        this.canvas.c.fillStyle = color;
        this.canvas.c.arc(ax, ay, size * .35, 0, this.TAU);
        this.canvas.c.fill();
        this.canvas.c.closePath();
      }

      if (ewp.hover) {
        this.canvas.c.beginPath();
        this.canvas.c.strokeStyle = color;
        this.canvas.c.strokeRect(x - 2, y - 2, w + 4, h + 4);
        this.canvas.c.closePath();
      }
    }

    for (const ewp of this._waypoints) {
      const [fx, fy] = this.image.r2a(ewp.bwp.left, ewp.bwp.top);
      for (const next of ewp.next) {
        const [tx, ty] = this.image.r2a(next.bwp.left, next.bwp.top);
        this.canvas.c.beginPath();
        this.canvas.c.moveTo(fx, fy);
        this.canvas.c.lineTo(tx, ty);
        this.canvas.c.strokeStyle = 'purple';
        this.canvas.c.lineWidth = 1;
        this.canvas.c.stroke();
        this.canvas.c.closePath();
      }
    }
  }

  close(force = false) {
    if (force !== true && !window.confirm('Are you sure?')) {
      return;
    }
    this.changeScene(MenuScene);
  }

  _load() {
    this._storage.restore();
    this.board.load();
    this._loadWaypoints();
  }

  _save() {
    this.board.save();
    this._storage.dump();
  }
}
