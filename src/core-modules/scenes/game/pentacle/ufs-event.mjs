import SceneObject from '../../../scene/object.mjs';
import { Game } from '../../../../theme.mjs';
import { TAU } from '../../../../utils.mjs';

/**
 * Unforeseen event
 */
export default class UfsEvent extends SceneObject {
  /**
   *
   * @param {BoardWaypoint} wp
   * @param {ImageBoardCoreModule} image
   */
  constructor(wp, image) {
    super();
    /**
     *
     * @type {BoardWaypoint}
     */
    this.wp = wp;
    /**
     *
     * @type {ImageBoardCoreModule}
     */
    this.image = image;
  }

  draw(c, updateRect = true) {
    const [ax, ay] = this.image.r2a(this.wp.rx, this.wp.ry);
    const s = this.image.rect.width * Game.Pentacle.UfsEvent.Size;

    c.beginPath();
    c.fillStyle = Game.Pentacle.UfsEvent.Color;
    c.arc(ax, ay, s, 0, TAU);
    c.fill();
    c.closePath();
  }
}
