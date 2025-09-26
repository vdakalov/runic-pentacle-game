import CoreModule from '../../core-module.mjs';
import BoardCoreModule from '../../core-modules/board/index.mjs';
import { BoardWaypointSegment } from '../../core-modules/board/waypoint.mjs';
import Player, { Phase } from './player.mjs';
import Link from './link.mjs';
import l from '../../i18n.mjs';

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
     * @type {string}
     * @private
     */
    this._lastDicePromptValue = '';

    /**
     *
     * @type {BoardWaypoint[]}
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
      stack:
      for (const bwc of wp.connections) {
        const awp = bwc.getAnotherWaypoint(wp);
        switch (wp.segment) {
          case BoardWaypointSegment.Element: {
            if (awp.atLine && awp.segment !== segment && stack.indexOf(awp) === -1) {
              element = wp;
              segment = awp.segment;
              stack.push(awp);
              links.push(new Link(wp, awp, undefined, element, segment));
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
              links.push(new Link(wp, awp, undefined, element, segment));
              break stack;
            }
            break;
          }
          case BoardWaypointSegment.Event: {
            if (awp.segment === segment && stack.indexOf(awp) === -1) {
              stack.push(awp);
              links.push(new Link(wp, awp, undefined, element, segment));
              break stack;
            }
            break;
          }
        }
      }
    }

    // close first and last waypoints in link
    links.push(new Link(
      stack[stack.length - 1],
      stack[0], undefined,
      links[links.length - 1].bElWp,
      links[links.length - 1].lineSegment));

    // define forward element for every links
    element = stack[0];
    for (let index = links.length - 1; index >= 0; index--) {
      const link = links[index];
      link.fElWp = element;
      if (link.aWp.atElement) {
        element = link.aWp;
      }
    }

    // for (const link of links) {
    //   console.log(link.toString());
    // }
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
   * Ask user for dice value and return it or returns random dice-value
   * @returns {number}
   */
  promptDice() {
    const msg = l`Dice value` + ' [1-6] (' + l`cancel to random` + '):';
    const raw = this._lastDicePromptValue = window
      .prompt(msg, this._lastDicePromptValue) || '';
    const int = Number.parseInt(raw.trim());
    if (Number.isInteger(int) && int > 0 && 6 >= int) {
      return int;
    }
    const value = this.dice();
    window.alert(l`Dice value: ${value}`);
    return value;
  }

  /**
   * Check if waypoint is on the direction way
   * @param {BoardWaypoint} from
   * @param {BoardWaypoint} to
   * @param {number} direction
   * @returns {boolean}
   */
  onPlayerWay(from, to, direction) {
    const dir = to.rx - from.rx;
    return direction !== 0
      && ((direction > 0 && dir > 0) || (0 > direction && 0 > dir));
  }

  /**
   *
   * @param {Player} player Turn's player
   * @param {BoardWaypoint} wp Init waypoint
   * @param {number} dice Dice value
   * @param {number} [direction]
   * @returns {BoardWaypoint} Target turn waypoint
   */
  getTurnWaypoint(player, wp, dice, direction = 0) {
    switch (player.phase) {
      case Phase.Initial:
      case Phase.RingMoving:
        while (dice-- > 0) {
          wp = wp.connections
            .find(wpc => wpc.directed && wpc.from === wp && wpc.to
              .at(player.segment, BoardWaypointSegment.Element)).to;
        }
        break;
      case Phase.LinesMoving:
        while (dice-- > 0) {
          for (const wpc of wp.connections) {
            const awp = wpc.getAnotherWaypoint(wp);
            if (awp.at(player.segment) && this.onPlayerWay(wp, awp, direction)) {
              wp = awp;
              break;
            }
          }
        }
        break;
    }
    return wp;
  }
}
