import EditorMode from '../mode.mjs';
import ActiveTextItem from '../../../context-menu/items/active-text.mjs';
import l from '../../../i18n.mjs';

export default class NormalMode extends EditorMode {
  /**
   *
   * @param {EditorScene} editor
   */
  constructor(editor) {
    super(editor);
  }

  contextMenuBuilder(bpe, ewp) {
    return [
      new ActiveTextItem(l`Load`, this.editor.load.bind(this.editor)),
      new ActiveTextItem(l`Save`, this.editor.save.bind(this.editor))
    ];
  }
}
