import CoreModule from '../../core-module.mjs';
import StorageCoreModule from '../storage.mjs';
import BoardWaypoint, { BoardWaypointSegment } from './waypoint.mjs';
import BoardWaypointsConnection from './waypoints-connection.mjs';

const StoreKey = {
  Waypoints: 'Waypoints',
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
  }

  destroy() {

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
   * @returns {BoardWaypointsConnection}
   */
  createWaypointsConnection(from, to) {
    const conn = new BoardWaypointsConnection(from, to);
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
}
