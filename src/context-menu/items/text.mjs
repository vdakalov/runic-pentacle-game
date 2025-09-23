import ContextMenuItem from '../item.mjs';

export default class TextItem extends ContextMenuItem {

  /**
   *
   * @return {string}
   */
  get text() {
    return this._element.textContent;
  }

  /**
   *
   * @param {string} value
   */
  set text(value) {
    this._element.textContent = value;
  }

  /**
   *
   * @param {string} text Item text
   * @param {boolean} [disabled]
   */
  constructor(text, disabled) {
    super(disabled);

    /**
     *
     * @type {string}
     */
    this.text = text;
  }
}
