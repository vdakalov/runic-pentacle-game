
export default class Core {
  constructor(init = []) {
    /**
     * @typedef {Object} CoreModuleReg
     * @property {typeof CoreModule} type
     * @property {CoreModule} instance
     */
    /**
     *
     * @type {Object.<string, CoreModuleReg>}
     */
    this.modules = {};

    for (const type of init) {
      this.load(type);
    }
  }

  /**
   *
   * @param {string} name
   * @private
   */
  _loaded(name) {
    console.debug(`%cCore%c: CoreModule loaded: %c${name}`,
      'color:darkmagenta; text-decoration: underline',
      'color:gray; text-decoration: none',
      'font-weight: bold');
  }

  /**
   *
   * @template T
   * @param {typeof T} type
   * @return {T}
   * @exception {ReferenceError} If there is not the module
   */
  get(type) {
    if (this.modules.hasOwnProperty(type.name)) {
      return this.modules[type.name].instance;
    }
    throw new ReferenceError(`Core: there is no module of ${type.name}`);
  }

  /**
   * @template T
   * @param {...(typeof CoreModule)[]} types
   * @returns {Promise<void>}
   */
  load(...types) {
    /**
     *
     * @type {Promise<void>[]}
     */
    const promises = [];
    for (let index = 0; index < types.length; index++) {
      /**
       *
       * @type {typeof CoreModule}
       */
      const type = types[index];
      if (this.modules.hasOwnProperty(type.name)) {
        throw new Error(`Core: Unable to load CoreModule "${type.name}": already loaded`);
      }
      /**
       * @type {CoreModule}
       */
      const instance = new type(this);
      this.modules[type.name] = { type, instance };
      if (instance.coreModulePromise !== undefined) {
        promises[promises.length] = instance.coreModulePromise
          .then(() => {
            this._loaded(type.name);
            const rest = types.slice(index + 1, types.length);
            if (rest.length !== 0) {
              return this.load(...rest);
            }
          });
        break;
      }
      this._loaded(type.name);
    }
    return Promise.all(promises);
  }

  /**
   * @template T
   * @param {...(typeof CoreModule)[]} types
   */
  unload(...types) {
    for (const type of types) {
      if (!this.modules.hasOwnProperty(type.name)) {
        throw new Error(`Core: Unable to unload CoreModule "${type.name}": unknown module (not loaded)`);
      }

      const { instance } = this.modules[type.name];
      instance.destroy();
      delete this.modules[type.name];
      console.debug(`%cCore%c: CoreModule unloaded: %c${type.name}`,
        'color:darkmagenta; text-decoration: underline',
        'color:gray; text-decoration: none',
        'font-weight: bold');
    }
  }
}
