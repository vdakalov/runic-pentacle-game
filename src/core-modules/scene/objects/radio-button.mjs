import SceneObject from '../object.mjs';
import { TAU } from '../../../utils.mjs';

export default class RadioButtonObject extends SceneObject {
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    super(x, y, 24, 24);
  }

  draw(c, updateRect = true) {
    c.beginPath();
    c.arc(this.rect.x, this.rect.y, this.rect.width / 2, 0, TAU);
    c.closePath();
  }
}
