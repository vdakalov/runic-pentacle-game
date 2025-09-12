import CoreModule from '../core-module.mjs';
import { getNodeParents, hasNodeParent } from '../utils.mjs';

export default class ContextMenuCoreModule extends CoreModule {
  /**
   *
   * @param {Core} core
   */
  constructor(core) {
    super(core);

    /**
     *
     * @type {HTMLUListElement}
     * @readonly
     */
    this.element = window.document.createElement('ul');
    this.element.className = this.constructor.name;
    this.element.addEventListener('click', this.onElementClick.bind(this));

    /**
     *
     * @type {ContextMenuItem[]}
     * @private
     */
    this.items = [];

    this.close = this.close.bind(this);

    window.addEventListener('click', this.close);
  }

  /**
   *
   * @param {MouseEvent} event
   * @private
   */
  onElementClick(event) {
    if (event.target instanceof HTMLElement) {
      if (event.target === this.element) {
        event.stopPropagation();
        return;
      }
      let parent = event.target;
      while (parent != null) {
        if (parent.tagName === 'LI') {
          const index = Array
            .from(this.element.childNodes)
            .indexOf(parent);
          if (index !== -1) {
            const item = this.items[index];
            if (item !== undefined && item.label.length !== 0) {
              item.handler(event);
              break;
            }
          }
        }
        parent = parent.parentNode;
      }
    }
  }

  close() {
    if (this.element.parentElement != null) {
      this.element.parentElement.removeChild(this.element);
    }
  }

  /**
   * @typedef {Function} ContextMenuItemHandler
   * @param {MouseEvent} event
   */
  /**
   * @typedef {Object} ContextMenuItem
   * @property {string} label
   * @property {ContextMenuItemHandler} handler
   */
  /**
   *
   * @param {number} left
   * @param {number} top
   * @param {ContextMenuItem[]} items
   */
  open(left, top, items) {
    this.items = items;

    this.element.style.left = `${left}px`;
    this.element.style.top = `${top}px`;
    this.element.textContent = '';

    window.document.body.appendChild(this.element);

    for (const item of items) {
      if (item.label.length === 0) {
        this.element.appendChild(window.document.createElement('hr'));
        continue;
      }
      const li = this.element
        .appendChild(window.document.createElement('li'));
      li.textContent = item.label;
    }

    const overWidth = (left + this.element.offsetWidth) - window.innerWidth;
    if (overWidth > 0) {
      this.element.style.left = `${left - overWidth}px`;
    }

    const overHeight = (top + this.element.offsetHeight) - window.innerHeight;
    if (overHeight > 0) {
      this.element.style.top = `${top - overHeight}px`;
    }
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {ContextMenuItem[]} items
   */
  openAtMouseEvent(event, items) {
    this.open(event.clientX, event.clientY, items);
  }
}
