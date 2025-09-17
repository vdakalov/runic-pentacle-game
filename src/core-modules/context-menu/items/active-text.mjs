import TextItem from './text.mjs';

export default class ActiveTextItem extends TextItem {

  /**
   *
   * @return {ContextMenuItemHandler|undefined}
   */
  get handler() {
    return this._handler;
  }

  /**
   *
   * @param {ContextMenuItemHandler|undefined} value
   */
  set handler(value) {
    this._handler = value;
    this._element.classList
      .toggle('inactive', !this.isActive);
  }

  /**
   *
   * @return {boolean}
   */
  get isActive() {
    return typeof this._handler === 'function';
  }

  /**
   * The handler can returns:
   * - true - for reopen (update) menu
   * - false - don't close menu
   * - undefined - just close menu
   * @typedef {Function} ContextMenuItemHandler
   * @param {MouseEvent} event
   * @returns {boolean|void} true - reopen (update), false - don't close, void - close
   */
  /**
   *
   * @param {string} text Item text
   * @param {ContextMenuItemHandler} [handler] Inactive item if not specified
   * @param {boolean} [disabled]
   */
  constructor(text, handler, disabled) {
    super(text, disabled);

    /**
     *
     * @type {ContextMenuItemHandler|undefined}
     * @private
     */
    this._handler = undefined;

    this.handler = handler;

    this._element.addEventListener('click', this._onActivate = this._onActivate.bind(this))
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  _onActivate(event) {
    if (typeof this._handler === 'function') {
      const result = this._handler(event);
      if (result === true) {
        this._menu.update();
      } else if (result !== false) {
        this._menu.close();
      }
    }
  }

  destroy() {
    this._element.removeEventListener('click', this._onActivate);
    super.destroy();
  }
}
