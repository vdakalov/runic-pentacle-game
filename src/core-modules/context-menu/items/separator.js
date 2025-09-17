import ContextMenuItem from '../item.mjs';

export default class SeparatorItem extends ContextMenuItem {
  /**
   *
   * @param {boolean} [disabled]
   */
  constructor(disabled) {
    super(disabled);
    this._element.appendChild(window.document.createElement('hr'));
  }
}
