import CoreModule from '../../core-module.mjs';
import BoardCoreModule from '../../core-modules/board/index.mjs';
import { BoardWaypointSegment } from '../../core-modules/board/waypoint.mjs';
import Player, { Phase } from './player.mjs';
import Link from './link.mjs';
import l from '../../i18n.mjs';
import LinkCursor from './link-cursor.mjs';

export default class GameCoreModule extends CoreModule {
  constructor(core) {
    super(core);

    /**
     *
     * @type {BoardCoreModule}
     */
    this.board = this.core.get(BoardCoreModule);

    /**
     *
     * @type {Player[]}
     */
    this.players = [
      new Player(BoardWaypointSegment.RingMiddle)
    ];

    /**
     *
     * @type {Link[]}
     */
    this.links = [];

    this._initialize();
  }

  _initialize() {
    // try to find any wp at element segment
    /**
     *
     * @type {BoardWaypoint}
     */
    let element = this.board.waypoints
      .find(bwp => bwp.atElement);
    // exit, if there is not any wp at element segment
    if (element === undefined) {
      return;
    }
    /**
     *
     * @type {BoardWaypointSegment}
     */
    let segment = undefined;
    /**
     *
     * @type {Link|undefined}
     */
    let link = undefined;
    /**
     *
     * @type {Link[]}
     */
    const links = this.links = [];
    /**
     *
     * @type {BoardWaypoint[]}
     */
    const stack = [element];
    // iterate over all pentacle's lines/events/elements
    // and stack wp on each step
    for (let index = 0; index < stack.length; index++) {
      const wp = stack[index];
      if (links.length > 1) {
        links[links.length - 2].b = links[links.length - 1];
      }
      stack:
      for (const bwc of wp.connections) {
        const awp = bwc.another(wp);
        switch (wp.segment) {
          case BoardWaypointSegment.Element: {
            if (awp.atLine && awp.segment !== segment && stack.indexOf(awp) === -1) {
              element = wp;
              segment = awp.segment;
              stack.push(awp);
              links.push(new Link(
                links.length,
                element,
                undefined,
                wp, awp,
                segment,
                links[links.length - 1],
                undefined));
              break stack;
            }
            break;
          }
          case segment: {
            const pass = (awp.segment === BoardWaypointSegment.Event && awp !== stack[index - 1])
              || (awp.segment === BoardWaypointSegment.Element && stack.indexOf(awp) === -1)
              || (awp.segment === segment && stack.indexOf(awp) === -1);
            if (pass) {
              stack.push(awp);
              links.push(new Link(
                links.length,
                element, undefined,
                wp, awp,
                segment,
                links[links.length - 1],
                undefined));
              break stack;
            }
            break;
          }
          case BoardWaypointSegment.Event: {
            if (awp.segment === segment && stack.indexOf(awp) === -1) {
              stack.push(awp);
              links.push(new Link(
                links.length,
                element, undefined,
                wp, awp,
                segment,
                links[links.length - 1],
                undefined));
              break stack;
            }
            break;
          }
        }
      }
    }

    // close first and last waypoints in link
    links.push(new Link(
      links.length,
      element, // A target
      stack[0], // B target
      stack[stack.length - 1], // A leader
      stack[0], // B leader
      links[links.length - 1].lineSegment,
      links[links.length - 1], links[0]
    ));
    links[0].a = links[links.length - 2].b = links[links.length - 1];


    // define forward element for every links
    element = stack[0];
    for (let index = links.length - 1; index >= 0; index--) {
      const link = links[index];
      link.bt = element;
      if (link.at.atElement && link.at === link.al) {
        element = link.at;
      }
    }

    // debug
    // links.forEach(l => console.log(l.toString()));
  }

  destroy() {
    this.players.length = 0;
    this._lastDicePromptValue = '';
    // this.core.unload(BoardCoreModule);
  }

  /**
   * Random number on dice (int in range 1-6)
   * @returns {number}
   */
  dice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  /**
   *
   * @param {BoardWaypoint} wp
   * @param {BoardWaypointSegment} segment
   * @returns {BoardWaypoint}
   */
  getRingMoveOption(wp, segment) {
    return wp.connections
      .find(wpc => wpc.directed && wpc.from === wp && wpc.to
        .at(segment, BoardWaypointSegment.Element)).to;
  }

  /**
   *
   * @param {PlayerObject} player
   * @returns {Link[]}
   */
  getElementMoveOptions(player) {
    return this.links
      .filter(l => l.has(player.wp));
  }
}
