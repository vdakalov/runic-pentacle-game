import CoreModule from '../../core-module.mjs';
import { createEnum } from '../../utils.mjs';

/**
 *
 * @enum {string}
 * @readonly
 */
export const BoardCellKind = createEnum({
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
     * @typedef {Object} BoardCell
     * @property {number} top
     * @property {number} left
     * @property {BoardCellKind} kind
     */
    /**
     *
     * @type {BoardCell[]}
     */
    this.cells = [];
  }

  destroy() {

  }
}
