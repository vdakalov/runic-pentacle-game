import ContextMenu from './index.mjs';

export default class ContextMenuCtrl {
  /**
   *
   * @param {Node} target
   * @param {ContextMenuBuilder} builder
   */
  constructor(target, builder) {
    /**
     *
     * @type {Node}
     * @readonly
     * @private
     */
    this._target = target;

    /**
     *
     * @type {ContextMenu}
     * @readonly
     */
    this.menu = new ContextMenu(builder);

    this._target.addEventListener('contextmenu', this._onContextMenu = this._onContextMenu.bind(this));
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  _onContextMenu(event) {
    event.preventDefault();
    this.menu.open(event);
  }

  destroy() {
    this._target.removeEventListener('contextmenu', this._onContextMenu);
  }
}
