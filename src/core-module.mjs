
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
    /**
     * Define it if module is async
     * @type {Promise<void>|undefined}
     */
    this.coreModulePromise = undefined;
  }
}
