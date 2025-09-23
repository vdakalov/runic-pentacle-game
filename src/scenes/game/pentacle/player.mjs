import SceneObject from '../../../core-modules/scene/object.mjs';
import { BoardWaypointSegment } from '../../../core-modules/board/waypoint.mjs';
import Player, { Phase } from '../player.mjs';
import { Game } from '../../../theme.mjs';

export default class PlayerObject extends SceneObject {

  /**
   *
   * @return {BoardWaypointSegment}
   */
  get segment() {
    return this.game.segment;
  }

  /**
   *
   * @return {string}
   */
  get segmentName() {
    return BoardWaypointSegment[this.segment];
  }

  /**
   *
   * @returns {Phase}
   */
  get phase() {
    return this.game.phase;
  }

  /**
   *
   * @returns {string}
   */
  get phaseName() {
    return this.game.phaseName;
  }

  /**
   *
   * @returns {boolean}
   */
  get isPhaseInitial() {
    return this.phase === Phase.Initial;
  }

  /**
   *
   * @returns {boolean}
   */
  get isPhaseRingMoving() {
    return this.phase === Phase.RingMoving;
  }

  /**
   *
   * @returns {boolean}
   */
  get isPhaseLineMoving() {
    return this.phase === Phase.RingMoving;
  }

  /**
   *
   * @param {Player} game
   * @param {BoardWaypoint} wp
   * @param {ImageBoardCoreModule} image
   */
  constructor(game, wp, image) {
    super();
    /**
     *
     * @type {Player}
     */
    this.game = game;
    /**
     *
     * @type {BoardWaypoint}
     */
    this.wp = wp;
    /**
     * For each pentacle's line there is a shift by x
     * coordinate between their waypoints. So it is
     * possible to define moving direction through that
     * 2d axis
     * @type {number}
     */
    this.movingDirection = 0;
    /**
     *
     * @type {ImageBoardCoreModule}
     */
    this.image = image;
    /**
     *
     * @type {[x: number,y: number]}
     */
    this.position = [-1, -1];
  }

  /**
   *
   * @return {[x: number, y: number]}
   * @private
   */
  _getPosition() {
    const d = this.image.rect.width * 0.042;
    if (d === 0) {
      return [-1, -1];
    }
    const r = d / 2;
    let [x, y] = this.image.r2a(this.wp.rx, this.wp.ry);
    if (this.wp.segment === BoardWaypointSegment.Element) {
      x += (Math.random() * d) - r;
      y += (Math.random() * d) - r;
    }
    return [x, y];
  }

  _updatePosition() {
    this.position = this._getPosition();
  }

  /**
   *
   * @param {BoardWaypoint} wp
   */
  setWaypoint(wp) {
    this.wp = wp;
    this._updatePosition();
  }

  /**
   *
   * @param {Phase} value
   * @param {BoardWaypointSegment} segment
   */
  setPhase(value, segment = this.segment) {
    this.game.phase = value;
    this.game.segment = segment;
  }

  draw(c, updateRect = true) {
    const [ax, ay] = this.position;
    if (!Number.isFinite(ax) || !Number.isFinite(ay) || ax === -1 || ay === -1) {
      // todo position does not updates on window resize
      this._updatePosition();
      return;
    }
    const { Color, Size } = Game.Players[this.game.initialSegment];
    const s = this.image.rect.width * Size;
    const hs = s / 2;

    c.beginPath();
    c.fillStyle = Color;
    c.fillRect(ax - hs, ay - hs, s, s);
    c.closePath();
  }
}
