import SceneObject from '../object.mjs';

export default class LabelSceneObject extends SceneObject {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {string} text
   */
  constructor(x, y, text) {
    super();
    this.x = x;
    this.y = y;
    /**
     * @typedef {Object} LabelSceneFont
     * @property {'italic'|'oblique'} [style]
     * @property {'small-caps'} [variant]
     * @property {'bold'} [weight]
     * @property {number|string} size Type of number means px
     * @property {number} [lineHeight]
     * @property {'courier'|'serif'|'sans-serif'|'Arial'|'monospace'|'cursive'|'fantasy'|'system-ui'} family
     */
    /**
     *
     * @type {LabelSceneFont}
     */
    this.font = {
      style: undefined,
      variant: undefined,
      weight: undefined,
      size: 10,
      lineHeight: undefined,
      family: 'sans-serif'
    };
    this.color = '#2c2a28';
    this.text = text;
  }

  createCanvasFontValue() {
    let value = '';
    if (this.font.style !== undefined) {
      value += this.font.style + ' ';
    }
    if (this.font.variant !== undefined) {
      value += this.font.variant + ' ';
    }
    if (this.font.weight !== undefined) {
      value += this.font.weight + ' ';
    }
    if (Number.isFinite(this.font.size)) {
      value += `${this.font.size}px`;
    } else if (this.font.size !== undefined) {
      value += this.font.size;
    }
    if (Number.isFinite(this.font.lineHeight)) {
      value += '/' + this.font.lineHeight + ' ';
    } else {
      value += ' ';
    }
    value += this.font.family;
    return value;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c
   */
  updateRect(c) {
    c.font = this.createCanvasFontValue();
    const m = c.measureText(this.text);
    this.rect.x = this.x - (m.width / 2);
    this.rect.y = this.y - m.actualBoundingBoxAscent;
    this.rect.width = m.width;
    this.rect.height = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {boolean} [updateRect=true]
   *
   * @return {TextMetrics}
   */
  draw(c, updateRect = true) {
    if (updateRect) {
      this.updateRect(c);
    }

    c.fillStyle = this.color;
    c.fillText(this.text, this.rect.x, this.y);
  }
}
