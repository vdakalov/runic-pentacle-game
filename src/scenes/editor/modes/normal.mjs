import EditorMode from '../mode.mjs';
import ActiveTextItem from '../../../context-menu/items/active-text.mjs';
import l from '../../../i18n.mjs';

export default class NormalMode extends EditorMode {

  static description = 'Mode for view w/o editing';

  /**
   *
   * @param {EditorScene} editor
   */
  constructor(editor) {
    super(editor);
  }

  contextMenuBuilder(bpe, ewp) {
    return [
      new ActiveTextItem([l`Load`, l`Load game map`], this.editor.load.bind(this.editor)),
      new ActiveTextItem([l`Save`, l`Save game map`], this.editor.save.bind(this.editor))
    ];
  }
}
