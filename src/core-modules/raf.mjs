import CoreModule from '../core-module.mjs';

export default class RafCoreModule extends CoreModule {
  constructor(core) {
    super(core);

    /**
     * @typedef {Function} RafTickHandler
     * @param {DOMHighResTimeStamp} delay
     */
    /**
     *
     * @type {RafTickHandler[]}
     * @readonly
     * @private
     */
    this.handlers = [];

    /**
     *
     * @type {number}
     * @private
     */
    this.rafi = 0;
    this.tick = this.tick.bind(this);

    this.resume();
  }

  /**
   *
   * @param {DOMHighResTimeStamp} [delay=0]
   * @private
   */
  tick(delay = 0) {
    for (const handler of this.handlers) {
      handler(delay);
    }
    this.rafi = window.requestAnimationFrame(this.tick);
  }

  pause() {
    if (this.rafi !== 0) {
      window.cancelAnimationFrame(this.rafi);
      this.rafi = 0;
    }
  }

  resume() {
    if (this.rafi === 0) {
      this.tick();
    }
  }

  /**
   *
   * @param {RafTickHandler} handler
   * @param {number} [priority]
   */
  set(handler, priority = this.handlers.length) {
    this.handlers.splice(priority, 0, handler);
  }

  /**
   *
   * @param {RafTickHandler} handler
   */
  unset(handler) {
    const index = this.handlers.indexOf(handler);
    if (index !== -1) {
      this.handlers.splice(index, 1);
    }
  }
}
