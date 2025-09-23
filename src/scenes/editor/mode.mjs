/**
 * @abstract
 */
export default class EditorMode {

  /**
   *
   * @param {EditorScene} editor
   */
  constructor(editor) {
    /**
     *
     * @type {EditorScene}
     * @readonly
     * @protected
     */
    this.editor = editor;
    /**
     *
     * @type {string}
     */
    this.cursor = '';
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {EditorWaypoint} [ewp]
   * @returns {ContextMenuItem[]}
   */
  contextMenuBuilder(bpe, ewp) {
    return [];
  }

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerClick(bpe) {}

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerMove(bpe) {}

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerDown(bpe) {}

  /**
   *
   * @param {BoardPointerEvent} bpe
   */
  onPointerUp(bpe) {}

  /**
   *
   * @param {BoardPointerEvent} bpe
   * @param {BoardPointerEvent} down
   */
  onPointerTranslate(bpe, down) {}

  /**
   *
   * @param {CanvasRenderingContext2D} c
   * @param {ImageBoardCoreModule} image
   */
  draw(c, image) {}
}
