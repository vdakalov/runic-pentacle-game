import LabelSceneObject from './label.mjs';

export default class ButtonSceneObject extends LabelSceneObject {
  /**
   *
   * @param {number} x
   * @param {number} y
   * @param {string} label
   * @param {Function} handler
   */
  constructor(x, y, label, handler) {
    super(x, y, label);
    this.handler = handler;
    this.padding = 8;
    this.font.size = 24;
  }

  onClick(event) {
    this.handler(event);
  }

  drawUnderline(c) {
    c.beginPath();
    c.lineWidth = 2;
    c.moveTo(this.rect.left, this.rect.bottom + 2);
    c.lineTo(this.rect.right, this.rect.bottom + 2);
    c.strokeStyle = this.color;
    c.stroke();
    c.closePath();
  }

  draw(c, updateRect) {
    super.draw(c);

    if (this.hover) {
      c.fillStyle = 'rgb(120, 120, 120)';
      const p = this.padding;
      c.fillRect(this.rect.x - p, this.rect.y - p, this.rect.width + p + p, this.rect.height + p + p);
      const color = this.color;
      this.color = c.strokeStyle = '#ededed';
      super.draw(c, false);
      this.drawUnderline(c);
      this.color = c.strokeStyle = color;
    } else {
      this.drawUnderline(c);
    }
  }
}
