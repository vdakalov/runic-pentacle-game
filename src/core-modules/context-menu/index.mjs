

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
    this._element.textContent = '';
    for (const item of this.builder(event)) {
      if (item.disabled) {
        item.detach();
        continue;
      }
      item.attach(this._element, this);
    }
  }

  close() {
    if (this._element.parentElement !== null) {
      this._element.parentElement.removeChild(this._element);
    }
  }
}
