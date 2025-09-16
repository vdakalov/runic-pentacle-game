import CoreModule from '../core-module.mjs';

export default class StorageCoreModule extends CoreModule {
  constructor(core) {
    super(core);
    this._key = this.constructor.name;
    /**
     *
     * @type {Object.<string, Object.<string, *>>}
     * @private
     */
    this._data = {};
  }

  /**
   *
   * @param {Object} obj
   * @param {string} key
   * @param {*} [init]
   * @return {*}
   */
  get(obj, key, init) {
    if (this._data.hasOwnProperty(obj.constructor.name)) {
      if (this._data[obj.constructor.name].hasOwnProperty(key)) {
        return this._data[obj.constructor.name][key];
      }
    }
    return init;
  }

  /**
   *
   * @param {Object} obj
   * @param {string} key
   * @param {*} value
   */
  set(obj, key, value) {
    if (!this._data.hasOwnProperty(obj.constructor.name)) {
      this._data[obj.constructor.name] = {};
    }
    this._data[obj.constructor.name][key] = value;
  }

  /**
   *
   * @param {Object} [obj]
   * @param {string} [key]
   */
  unset(obj, key) {
    if (obj === undefined) {
      this._data = {};
    } else if (key === undefined) {
      this._data[obj.constructor.name] = {};
    } else if (this._data.hasOwnProperty(obj.constructor.name)) {
      delete this._data[obj.constructor.name][key];
    }
  }

  dump() {
    const json = JSON.stringify(this._data);
    window.localStorage.setItem(this._key, json);
  }

  restore() {
    const json = window.localStorage.getItem(this._key) || '{}';
    this._data = JSON.parse(json);
  }
}
