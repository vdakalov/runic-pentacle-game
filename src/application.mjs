import Core from './core.mjs';
import RafCoreModule from './core-modules/raf.mjs';
import CanvasCoreModule from './core-modules/canvas/index.mjs';
import ResizeCanvasCoreModule from './core-modules/canvas/resize.mjs';
import MountCanvasCoreModule from './core-modules/canvas/mount.mjs';
import ContextMenuCoreModule from './core-modules/context-menu.mjs';
import MenuSceneCoreModule from './core-modules/scenes/menu.mjs';

export default class Application {
  constructor() {
    /**
     *
     * @type {Core}
     * @readonly
     * @private
     */
    this.core = new Core([
      // raf modules
      RafCoreModule,

      // canvas modules
      CanvasCoreModule,
      ResizeCanvasCoreModule,
      MountCanvasCoreModule,

      // context menu modules
      ContextMenuCoreModule,

      // Scenes
      MenuSceneCoreModule,

      // board modules
      // ImageBoardCoreModule,
      // ContextMenuBoardCoreModule,
    ]);

    // start request animation frame system
    this.core.get(RafCoreModule).resume();
  }

  /**
   *
   * @private
   */
  _dump() {
    window.localStorage.setItem('board_cells', JSON.stringify(this.board.cells));
  }

  /**
   *
   * @param {MouseEvent} event
   * @return {ContextMenuItem[]}
   * @private
   */
  _createContextMenuItems(event) {
    const x = event.offsetX;
    const y = event.offsetY;
    const cacheIndex = this.boardCellsCache
      .findIndex(({ rect: { left: l, top: t, right: r, bottom: b } }) =>
        x >= l && r > x && y >= t && b > y);
    const items = [
      { label: 'Create Track cell',
        handler: this._onCreateCell.bind(this, BoardCellKind.Track, event) },
      { label: 'Create Nature cell',
        handler: this._onCreateCell.bind(this, BoardCellKind.Nature, event) },
      { label: 'Create Line cell',
        handler: this._onCreateCell.bind(this, BoardCellKind.Line, event) },
      { label: 'Create Event cell',
        handler: this._onCreateCell.bind(this, BoardCellKind.Event, event) }
    ];

    if (cacheIndex !== -1) {
      const cache = this.boardCellsCache[cacheIndex];
      const index = this.board.cells.indexOf(cache.cell);
      items.unshift({
        label: `Delete ${BoardCellKind[cache.cell.kind]}#${index} cell`,
        handler: this._onDeleteCell.bind(this, cacheIndex, index)
      });
      if (this.connect == null) {
        items.unshift({
          label: `Connect from`,
          handler: this._onConnectFrom.bind(this, cache)
        });
      } else {
        items.unshift({
          label: `Connect to`,
          handler: this._onConnectTo.bind(this, cache)
        })
      }
    }

    return items;
  }

  /**
   *
   * @param {BoardCellKind} kind
   * @param {MouseEvent} event
   * @private
   */
  _onCreateCell(kind, event) {
    const x = event.offsetX;
    const y = event.offsetY;
    /**
     *
     * @type {BoardCell}
     */
    const cell = {
      kind,
      top: (y - this.boardRect.y) / this.boardRect.height,
      left: (x - this.boardRect.x) / this.boardRect.width,
    };
    this.board.cells.push(cell);
    this._dump();
  }

  /**
   *
   * @param {number} cacheIndex
   * @param {number} index
   * @private
   */
  _onDeleteCell(cacheIndex, index) {
    this.boardCellsCache.splice(cacheIndex, 1);
    this.board.cells.splice(index, 1);
    this._dump();
  }

  /**
   *
   * @private
   */
  _drawBoardCells() {
    for (const cell of this.board.cells) {
      const [x, y] = this._createCellAbsPos(cell);
      const rect = new DOMRectReadOnly(x - 8, y - 8, 16, 16);
      this.boardCellsCache.push({ cell, rect });
      this.c.beginPath();
      switch (cell.kind) {
        case BoardCellKind.Track: this.c.fillStyle = 'red'; break;
        case BoardCellKind.Nature: this.c.fillStyle = 'green'; break;
        case BoardCellKind.Line: this.c.fillStyle = 'blue'; break;
        case BoardCellKind.Event: this.c.fillStyle = 'orange'; break;
      }
      this.c.fillRect(x, y, rect.width, rect.height);
      this.c.closePath();
    }
  }
}
