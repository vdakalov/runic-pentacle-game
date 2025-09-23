/**
 * Context menu class
 * Creates menu DOM and control it
 * Warning: does not listen to contextmenu event
 * only open and close methods available!
 */
export default class ContextMenu {

  /**
   * Is menu opened
   * @returns {boolean}
   */
  get opened() {
    return this._element.parentElement != null;
  }

  /**
   * @typedef {Function} ContextMenuBuilder
   * @param {MouseEvent} event
   * @returns {ContextMenuItem[]}
   */
  /**
   *
   * @param {ContextMenuBuilder} builder
   */
  constructor(builder) {
    /**
     *
     * @type {ContextMenuBuilder}
     */
    this.builder = builder;

    /**
     *
     * @type {HTMLUListElement}
     * @readonly
     * @private
     */
    this._element = window.document.createElement('ul');
    this._element.className = this.constructor.name;
    this._element.addEventListener('click', this._onElementClick.bind(this));

    /**
     *
     * @type {ContextMenuItem[]}
     * @private
     */
    this._items = [];

    window.addEventListener('click', this.close = this.close.bind(this));
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  _onElementClick(event) {
    event.stopPropagation();
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @returns {[x: number, y: number]}
   * @private
   */
  _correctPosition(x, y) {
    return [
      x - Math.max(0, (x + this._element.offsetWidth) - window.innerWidth),
      y - Math.max(0, (y + this._element.offsetHeight) - window.innerHeight)
    ];
  }

  /**
   *
   * @param {MouseEvent} event
   */
  open(event) {
    this.update(event);
    if (this._element.parentElement === null) {
      window.document.body.appendChild(this._element);
    }
    const [x, y] = this._correctPosition(event.clientX, event.clientY);
    this._element.style.left = `${x}px`;
    this._element.style.top = `${y}px`;
  }

  /**
   *
   * @param {MouseEvent} event
   */
  update(event) {
    for (const item of this._items) {
      item.detach();
    }
    this._items.length = 0;
    this._element.textContent = '';
    for (const item of this.builder(event)) {
      if (item.disabled) {
        continue;
      }
      item.attach(this._element, this);
      this._items.push(item);
    }
  }

  close() {
    if (this._element.parentElement !== null) {
      this._element.parentElement.removeChild(this._element);
    }
  }
}
