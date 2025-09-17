import { getObjectPrototypes } from '../../utils.mjs';

/**
 * @abstract
 */
export default class ContextMenuItem {

  /**
   * @param {boolean} [disabled=false] Should item be present in menu
   */
  constructor(disabled = false) {
    /**
     *
     * @type {HTMLLIElement}
     * @readonly
     * @protected
     */
    this._element = window.document.createElement('li');
    this._element.classList.add(...getObjectPrototypes(this, 1).map(p => p.name));

    /**
     *
     * @type {ContextMenu|undefined}
     * @protected
     */
    this._menu = undefined;

    /**
     *
     * @type {boolean}
     */
    this.disabled = disabled;
  }

  destroy() {
    this.detach();
  }

  /**
   *
   * @param {HTMLUListElement} element
   * @param {ContextMenu} menu
   */
  attach(element, menu) {
    element.appendChild(this._element);
    this._menu = menu;
  }

  detach() {
    this._menu = undefined;
    if (this._element.parentElement !== null) {
      this._element.parentElement.removeChild(this._element);
    }
  }
}
