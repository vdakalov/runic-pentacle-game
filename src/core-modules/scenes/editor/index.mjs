import SceneCoreModule from '../../scene/index.mjs';
import ImageBoardCoreModule from '../../board/image.mjs';
import BoardCoreModule, { BoardWaypointKind } from '../../board/index.mjs';
import PointerBoardCoreModule from '../../board/pointer.js';
import ContextMenuCoreModule from '../../context-menu.mjs';
import MenuScene from '../menu.mjs';
import { createEnum, DOMRectInclude } from '../../../utils.mjs';

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
      [BoardWaypointKind.Track]: {
        size: 16,
        color: 'gray'
      },
      [BoardWaypointKind.Nature]: {
        size: 16,
        color: 'blue'
      },
      [BoardWaypointKind.Line]: {
        size: 16,
        color: 'green'
      },
      [BoardWaypointKind.Event]: {
        size: 16,
        color: 'red'
      }
    };

    this.core.load(
      BoardCoreModule,
      ImageBoardCoreModule,
      PointerBoardCoreModule,
    );

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
     * @property {boolean} hover
     * @property {boolean} active
     */
    /**
     *
     * @type {EditorWaypoint[]}
     */
    this._waypoints = this.board.waypoints
      .map(bwp => this._createWaypoint(bwp));
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

    this.canvas.element.addEventListener('click', this.onCanvasClick = this.onCanvasClick.bind(this));
    this.canvas.element.addEventListener('contextmenu',
      this.onCanvasContextMenu = this.onCanvasContextMenu.bind(this));

    this.canvas.clear();

    /**
     * @typedef {Object} EditorMode
     * @property {EditorModeId} id
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
    /**
     *
     * @type {ContextMenuItem[]}
     */
    const items = [
      { label: `Mode: ${this.mode.label}`, handler: this.nextMode.bind(this) },
      { label: '', handler() {} },
      { label: 'Close Editor', handler: this.close.bind(this) }
    ];

    switch (this.mode.id) {
      case EditorModeId.WayPoints:
        items.splice(1, 0,
          { label: '', handler() {} },
          { label: 'Create Waypoint', handler }
        );
        break;
    }

    this.cm.openAtMouseEvent(event, items);
  }

  /**
   *
   * @param {MouseEvent} event
   */
  onCanvasClick(event) {
    if (this.mode.id === EditorModeId.WayPoints) {
      const data = this.pointer.createEventData(event);
      const bwp = this.board.createWaypoint(BoardWaypointKind.Track, data.extra.left, data.extra.top);
      this._createWaypoint(bwp);
      console.log('Waypoint created');
    }
  }

  /**
   *
   * @param {BoardWaypoint} bwp
   * @returns {EditorWaypoint}
   * @private
   */
  _createWaypoint(bwp) {
    /**
     *
     * @type {EditorWaypoint}
     */
    const ewp = {
      bwp,
      rect: new DOMRect(),
      hover: false,
      active: false
    };
    this._waypoints.push(ewp);
    return ewp;
  }

  /**
   *
   * @param {PointerEventData} data
   * @returns {EditorWaypoint[]}
   * @private
   */
  _getWaypointByPed(data) {
    const { ax, ay } = data.extra;
    return this._waypoints
      .filter(wp => ax >= wp.rect.left && wp.rect.right > ax
        && ay >= wp.rect.top && wp.rect.bottom > ay);
  }

  nextMode() {
    this.modePointer = (this.modePointer + 1) % this.modes.length;
    const mode = this.modes[this.modePointer];
    this.canvas.cursor = mode.cursor;
  }

  /**
   *
   * @param {PointerEventData} data
   */
  onPointerMove(data) {
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

  onPointerDown(data) {
    this._waypointActive = this._waypointHover;
  }

  onPointerUp(data) {
    this._waypointActive = undefined;
  }

  /**
   *
   * @param {PointerEventData} data
   */
  onPointerTranslate(data) {
    if (this._waypointActive !== undefined) {
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

      if (ewp.hover) {
        this.canvas.c.beginPath();
        this.canvas.c.strokeStyle = color;
        this.canvas.c.strokeRect(x - 2, y - 2, w + 4, h + 4);
        this.canvas.c.closePath();
      }
    }
  }

  close() {
    this.changeScene(MenuScene);
  }
}
