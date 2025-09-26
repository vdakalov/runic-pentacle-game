import CoreModule from '../core-module.mjs';

export default class StorageCoreModule extends CoreModule {
  constructor(core) {
    super(core);
    /**
     *
     * @type {Object.<string, Object.<string, *>>}
     * @private
     */
    this._data = {};

    this.coreModulePromise = window
      .fetch('/assets/storage.json')
      .then(response => response.json())
      .then(data => this.fromObject(data));
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

  /**
   *
   * @returns {Object<string, Object<string, *>>}
   */
  toObject() {
    return this._data;
  }

  /**
   *
   * @param {Object<string, Object<string, *>>} value
   */
  fromObject(value) {
    this._data = value;
  }

  /**
   *
   * @returns {string}
   */
  toJSON() {
    return JSON.stringify(this._data);
  }

  /**
   *
   * @param {string} value
   */
  fromJSON(value) {
    this._data = JSON.parse(value);
  }

  /**
   *
   * @returns {string}
   */
  toString() {
    return this.toJSON();
  }
}
