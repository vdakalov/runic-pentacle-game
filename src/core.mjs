
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
   */
  load(...types) {
    for (const type of types) {
      if (this.modules.hasOwnProperty(type.name)) {
        throw new Error(`Core: Unable to load CoreModule "${type.name}": already loaded`);
      }
      this.modules[type.name] = {
        type, instance: new type(this)
      };
      console.debug(`%cCore%c: CoreModule loaded: %c${type.name}`,
        'color:darkmagenta; text-decoration: underline',
        'color:gray; text-decoration: none',
        'font-weight: bold');
    }
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
