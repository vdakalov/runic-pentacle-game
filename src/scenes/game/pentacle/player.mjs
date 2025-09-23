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
     * Relative waypoint position
     * @type {[rx: number, ry: number, a: number]}
     * @private
     */
    this.position = [];
    /**
     *
     * @type {ImageBoardCoreModule}
     */
    this.image = image;
    /**
     *
     * @type {number}
     */
    this.direction = 0;

    this._defineWaypointPosition();
  }

  /**
   * Shift wp position on Elements wp
   * @private
   */
  _defineWaypointPosition() {
    this.position = [this.wp.rx, this.wp.ry, 0];
    if (this.wp.atElement) {
      const d = 0.042;
      const r = 0.021;
      this.position[0] += (Math.random() * d) - r;
      this.position[1] += (Math.random() * d) - r;
    }
  }

  /**
   *
   * @param {BoardWaypoint} wp
   */
  setWaypoint(wp) {
    this.wp = wp;
    this._defineWaypointPosition();
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
    const [rx, ry, a] = this.position;
    const [ax, ay] = this.image.r2a(rx, ry);
    const { Color, Size } = Game.Players[this.game.initialSegment];
    const s = this.image.rect.width * Size;
    const hs = s / 2;

    c.save();
    c.translate(ax, ay);
    c.rotate(a);

    c.beginPath();
    c.fillStyle = Color;
    c.fillRect(-hs, -hs, s, s);
    c.closePath();

    c.restore();

    this.position[2] += 0.01;
  }
}
