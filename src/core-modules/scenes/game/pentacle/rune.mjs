import SceneObject from '../../../scene/object.mjs';
import { BoardWaypointSegment } from '../../../board/waypoint.mjs';
import { TAU } from '../../../../utils.mjs';
import { Game } from '../../../../theme.mjs';

const elSeg = TAU / 5;
const segmentRotationMap = {
  [BoardWaypointSegment.LineVLeft]: elSeg * 4,
  [BoardWaypointSegment.LineVRight]: elSeg,
  [BoardWaypointSegment.LineHTop]: 0,
  [BoardWaypointSegment.LineHLeft]: elSeg * 3,
  [BoardWaypointSegment.LineHRight]: elSeg * 2,
};

export default class Rune extends SceneObject {
  /**
   *
   * @param {number} kind
   * @param {BoardWaypoint} wp
   * @param {ImageBoardCoreModule} image
   */
  constructor(kind, wp, image) {
    super();
    /**
     *
     * @type {number}
     */
    this.kind = kind;
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

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {boolean} [updateRect]
   */
  draw(c, updateRect = true) {
    const [ax, ay] = this.image.r2a(this.wp.rx, this.wp.ry);
    const a = segmentRotationMap[this.wp.segment] || 0;

    const w = this.rect.width = this.image.rect.width * Game.Pentacle.Rune.Width;
    const h = this.rect.height = this.image.rect.height * Game.Pentacle.Rune.Height;

    c.save();
    c.translate(ax, ay);
    c.rotate(a);

    c.beginPath();
    c.fillStyle = Game.Pentacle.Rune.Color;
    c.fillRect(-w/2, -h/2, w, h);
    c.closePath();

    c.restore();

  }
}
