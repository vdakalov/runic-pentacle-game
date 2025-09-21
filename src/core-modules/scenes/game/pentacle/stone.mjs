import SceneObject from '../../../scene/object.mjs';
import { createEnum, TAU } from '../../../../utils.mjs';
import { Game } from '../../../../theme.mjs';

/**
 *
 * @enum {number}
 * @readonly
 */
export const StoneKind = createEnum({
  Energy: 0,
  Information: 1,
  Motivation: 2
});

export default class Stone extends SceneObject {

  /**
   *
   * @type {Object.<StoneKind, { Size: number; Color: string }>}
   */
  static style = {
    [StoneKind.Energy]: Game.Pentacle.Stones.Energy,
    [StoneKind.Information]: Game.Pentacle.Stones.Information,
    [StoneKind.Motivation]: Game.Pentacle.Stones.Motivation,
  };

  /**
   *
   * @param {StoneKind} kind
   * @param {BoardWaypoint} wp
   * @param {ImageBoardCoreModule} image
   */
  constructor(kind, wp, image) {
    const { Size } = Stone.style[kind];
    super(0, 0, image.rect.width * Size, image.rect.height * Size);
    /**
     *
     * @type {StoneKind}
     * @readonly
     */
    this.kind = kind;
    /**
     *
     * @type {BoardWaypoint}
     * @readonly
     */
    this.wp = wp;
    /**
     *
     * @type {ImageBoardCoreModule}
     * @readonly
     */
    this.image = image;
  }

  draw(c, updateRect = true) {
    const { Size, Color } = Stone.style[this.kind];
    const [ax, ay] = this.image.r2a(this.wp.rx, this.wp.ry);
    const x = this.rect.x = ax;
    const y = this.rect.y = ay;
    const d = this.rect.width = this.image.rect.width * Size;

    c.beginPath();
    c.fillStyle = Color;
    c.arc(x, y, d * 0.5, 0, TAU);
    c.fill();
    c.closePath();
  }
}
