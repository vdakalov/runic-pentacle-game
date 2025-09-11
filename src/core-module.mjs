
/**
 * @abstract
 */
export default class CoreModule {
  /**
   *
   * @param {Core} core
   */
  constructor(core) {
    /**
     *
     * @type {Core}
     * @protected
     * @readonly
     */
    this.core = core;
  }
}
