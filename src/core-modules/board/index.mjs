import CoreModule from '../../core-module.mjs';
import StorageCoreModule from '../storage.mjs';
import BoardWaypoint, { BoardWaypointSegment } from './waypoint.mjs';
import BoardWaypointsConnection from './waypoints-connection.mjs';

const StorageKey = {
  Waypoints: 'Waypoints',
  Connections: 'Connections',
  Starting: 'Starting',
};

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
     *
     * @type {BoardWaypoint[]}
     */
    this.waypoints = [];

    /**
     *
     * @type {BoardWaypointsConnection[]}
     */
    this.connections = [];

    /**
     * INDEX points to BoardWaypointSegment value
     * VALUE is BoardWaypoint from this.waypoints
     * @type {BoardWaypoint[]}
     */
    this.startings = [];
  }

  destroy() {

  }

  load() {
    // load waypoints
    this.waypoints.length = 0;
    const waypoints = this._storage.get(this, StorageKey.Waypoints, []);
    for (let offset = 0; offset < waypoints.length; offset += 3) {
      this.createWaypoint(...waypoints.slice(offset, offset + 3));
    }

    // load connections
    this.connections.length = 0;
    const connections = this._storage.get(this, StorageKey.Connections, []);
    for (let offset = 0; offset < connections.length; offset += 3) {
      const [from, to] = connections
        .slice(offset, offset + 2)
        .map(i => this.waypoints[i]);
      const directed = connections[offset + 2] === 1;
      this.createWaypointsConnection(from, to, directed);
    }

    // load starting
    this.startings = this._storage.get(this, StorageKey.Starting, [])
      .map(i => i === -1 ? undefined : this.waypoints[i]);
  }

  save() {
    // save waypoints
    const waypoints = this.waypoints.reduce((acc, wp) => {
      acc.push(...wp.toObject());
      return acc;
    }, []);
    this._storage.set(this, StorageKey.Waypoints, waypoints);

    // save connections
    const connections = this.connections.reduce((acc, c) => {
      acc.push(
        this.waypoints.indexOf(c.from),
        this.waypoints.indexOf(c.to),
        c.directed ? 1 : 0);
      return acc;
    }, []);
    this._storage.set(this, StorageKey.Connections, connections);

    // save starting
    const starting = this.startings.map(wp => this.waypoints.indexOf(wp));
    this._storage.set(this, StorageKey.Starting, starting);
  }

  /**
   *
   * @param {BoardWaypointSegment} segment
   * @param {number} rx
   * @param {number} ry
   * @returns {BoardWaypoint}
   */
  createWaypoint(segment, rx, ry) {
    const bwp = new BoardWaypoint(segment, rx, ry);
    this.waypoints.push(bwp);
    return bwp;
  }

  /**
   *
   * @param {BoardWaypoint} bwp
   */
  deleteWaypoint(bwp) {
    this.waypoints.splice(this.waypoints.indexOf(bwp), 1);
  }

  /**
   *
   * @param {BoardWaypoint} from
   * @param {BoardWaypoint} to
   * @param {boolean} [directed]
   * @returns {BoardWaypointsConnection}
   */
  createWaypointsConnection(from, to, directed) {
    const conn = new BoardWaypointsConnection(from, to, directed);
    this.connections.push(conn);
    return conn;
  }

  /**
   *
   * @param {BoardWaypointsConnection} bwc
   * @returns {boolean} has connection deleted
   */
  deleteWaypointsConnection(bwc) {
    const index = this.connections.indexOf(bwc);
    if (index !== -1) {
      this.connections.splice(index, 1);
      bwc.destroy();
      return true;
    }
    return false;
  }

  /**
   *
   * @param {...BoardWaypointSegment[]} segments
   * @return {BoardWaypoint[]}
   */
  findWaypoints(...segments) {
    return this.waypoints
      .filter(bwp => segments.includes(bwp.segment));
  }
}
