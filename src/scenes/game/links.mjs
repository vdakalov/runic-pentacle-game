
export default class Links {
  /**
   *
   * @param {Link[]} links
   */
  constructor(links) {
    /**
     *
     * @type {Link[]}
     */
    this.links = links;
  }

  /**
   *
   * @param {Link} link
   * @param {BoardWaypoint} target
   * @return {Link}
   */
  next(link, target) {
    switch (target) {
      case link.al:
        for (const l of this.links) {
          if (l !== link && l.attainable(target)) {

          }
        }
        break;
      case link.bl:

        break;
    }
  }
}


/*
LINKS:     [ SET ]
           /  |  \
 LINK:   [at] [bl] [c]
        /  \/  \/  \
   WP: [1] [2] [3] [4]

*/
