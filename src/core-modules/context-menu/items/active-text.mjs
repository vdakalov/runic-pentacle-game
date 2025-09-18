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
   * - true - for update menu
   * - false - don't close menu
   * - undefined - just close menu
   *
   * In order to update menu from handler `cme` parameter should be defined for `ActiveTextItem`
   * @typedef {Function} ContextMenuItemHandler
   * @param {MouseEvent} event
   * @returns {boolean|void} true - reopen (update), false - don't close, void - close
   */
  /**
   *
   * @param {string} text Item text
   * @param {ContextMenuItemHandler} [handler] Inactive item if not specified
   * @param {boolean} [disabled]
   * @param {MouseEvent} [cme] Context Menu Event - Required for update menu from handler
   */
  constructor(text, handler, disabled, cme) {
    super(text, disabled);

    /**
     *
     * @type {ContextMenuItemHandler|undefined}
     * @private
     */
    this._handler = undefined;

    /**
     *
     * @type {MouseEvent|undefined}
     */
    this.contextMenuEvent = cme;

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
        if (this.contextMenuEvent === undefined) {
          throw new ReferenceError(`${this.constructor.name
          }: Unable update menu: No contextmenu event defined`);
        }
        this._menu.update(this.contextMenuEvent);
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
