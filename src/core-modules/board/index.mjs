import CoreModule from '../../core-module.mjs';
import { createEnum } from '../../utils.mjs';

/**
 *
 * @enum {string}
 * @readonly
 */
export const BoardWaypointKind = createEnum({
  /**
   * Track cells for first game stage
   */
  Track: 0,
  /**
   * Pentacle vertex circle (air, ground, fire, etc.)
   */
  Nature: 1,
  /**
   * Pentacle line (diagonal) cell
   */
  Line: 2,
  /**
   * Pentacle suddenly event cell
   */
  Event: 3,
});

export default class BoardCoreModule extends CoreModule {
  constructor(core) {
    super(core);

    /**
     * @typedef {Object} BoardWaypoint
     * @property {number} top
     * @property {number} left
     * @property {BoardWaypointKind} kind
     */
    /**
     *
     * @type {BoardWaypoint[]}
     */
    this.waypoints = [];
  }

  destroy() {

  }

  /**
   *
   * @param {BoardWaypointKind} kind
   * @param {number} left
   * @param {number} top
   */
  createWaypoint(kind, left, top) {
    /**
     *
     * @type {BoardWaypoint}
     */
    const wp = {
      kind, left, top
    };
    this.waypoints.push(wp);
    return wp;
  }
}
