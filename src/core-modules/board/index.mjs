import CoreModule from '../../core-module.mjs';
import StorageCoreModule from '../storage.mjs';
import { createEnum } from '../../utils.mjs';

const StoreKey = {
  Waypoints: 'Waypoints',
  Starting: 'Starting',
};

/**
 *
 * @enum {string}
 * @readonly
 */
export const BoardWaypointKind = createEnum({
  /**
   * Track cells for first game stage
   */
  TrackOuter: 0,
  TrackMiddle: 1,
  TrackInner: 2,
  /**
   * Pentacle vertex circle (air, ground, fire, etc.)
   */
  Nature: 3,
  /**
   * Pentacle line (diagonal) cell
   */
  Line: 4,
  /**
   * Pentacle suddenly event cell
   */
  Event: 5,
});

export default class BoardCoreModule extends CoreModule {
  constructor(core) {
    super(core);

    /**
     *
     * @type {StorageCoreModule}
     * @private
     */
    this._storage = this.core.get(StorageCoreModule);

    /**
     * @typedef {Object} BoardWaypoint
     * @property {number} top
     * @property {number} left
     * @property {BoardWaypointKind} kind
     * @property {BoardWaypoint[]} next
     * @property {BoardWaypointKind} [starting]
     */
    /**
     *
     * @type {BoardWaypoint[]}
     */
    this.waypoints = [];

    /**
     * Start waypoints pointers (indices)
     * key - is a BoardWaypointKind
     * value - is a BoardWaypoint
     * @type {BoardWaypoint[]}
     * @private
     */
    this._starting = [];

    this.load();
  }

  destroy() {

  }

  save() {
    const waypoints = this.waypoints
      .map(wp => ({
        ...wp,
        next: wp.next.map(n => this.waypoints.indexOf(n))
      }));
    const starting = this._starting
      .map(wp => this.waypoints.indexOf(wp));
    this._storage.set(this, StoreKey.Waypoints, waypoints);
    this._storage.set(this, StoreKey.Starting, starting);
  }

  load() {
    this.waypoints = this._storage.get(this, StoreKey.Waypoints) || [];
    for (const wp of this.waypoints) {
      wp.next = wp.next.map(i => this.waypoints[i]);
    }
    this._starting = (this._storage.get(this, StoreKey.Starting) || [])
      .map(i => this.waypoints[i]);
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
      kind, left, top,
      next: []
    };
    this.waypoints.push(wp);
    return wp;
  }

  /**
   *
   * @param {BoardWaypoint} value
   * @returns {boolean}
   */
  deleteWaypoint(value) {
    const index = this.waypoints.indexOf(value);
    if (index !== -1) {
      while (value.next.length !== 0) {
        this.disconnectWaypoints(value, value.next[value.next.length - 1]);
      }
      this.waypoints.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   *
   * @param {BoardWaypoint} from
   * @param {BoardWaypoint} to
   */
  connectWaypoints(from, to) {
    const back = to.next.indexOf(from);
    if (back !== -1) {
      throw new Error(`${this.constructor.name}: Unable to connect waypoints: backward connection already defined`);
    }
    const index = from.next.indexOf(to);
    if (index === -1) {
      from.next.push(to);
    }
  }

  /**
   *
   * @param {BoardWaypoint} a
   * @param {BoardWaypoint} b
   */
  disconnectWaypoints(a, b) {
    const fi = a.next.indexOf(b);
    const bi = b.next.indexOf(a);
    if (fi !== -1) {
      a.next.splice(fi, 1);
    }
    if (bi !== -1) {
      b.next.splice(bi, 1);
    }
  }

  /**
   *
   * @param {BoardWaypointKind} kind
   * @returns {BoardWaypoint|undefined}
   */
  getKindStartingWaypoint(kind) {
    if (this._starting.hasOwnProperty(kind)) {
      return this._starting[kind];
    }
  }

  /**
   *
   * @param {BoardWaypoint} wp
   * @param {BoardWaypointKind} kind
   * @returns {boolean} true if changes has been made
   */
  setWaypointStartingKind(wp, kind) {
    if (wp.starting !== undefined) {
      delete this._starting[wp.starting];
      delete wp.starting;
    }
    if (this._starting.hasOwnProperty(kind)) {
      delete this._starting[kind].starting;
    }
    wp.starting = kind;
    this._starting[kind] = wp;
  }

  /**
   *
   * @param {BoardWaypointKind[]} kinds
   */
  unsetStartingKinds(kinds) {
    for (const kind of kinds) {
      if (this._starting.hasOwnProperty(kind)) {
        delete this._starting[kind].starting
        delete this._starting[kind];
      }
    }
  }
}
