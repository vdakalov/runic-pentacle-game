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
   * @returns {string}
   */
  get title() {
    return this._element.title;
  }

  /**
   *
   * @param {string} value
   */
  set title(value) {
    this._element.title = value;
  }

  /**
   * @typedef {string|[text:string,title?:string]} TextItemText
   */
  /**
   *
   * @param {TextItemText} text Item text
   * @param {boolean} [disabled]
   */
  constructor(text, disabled) {
    super(disabled);

    if (Array.isArray(text)) {
      this.title = text[1];
      text = text[0];
    }

    /**
     *
     * @type {string}
     */
    this.text = text;
  }
}
