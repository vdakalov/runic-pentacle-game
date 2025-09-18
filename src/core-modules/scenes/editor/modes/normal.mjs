import EditorMode from '../mode.mjs';
import ActiveTextItem from '../../../context-menu/items/active-text.mjs';

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
      new ActiveTextItem('Load', this.editor.load.bind(this.editor)),
      new ActiveTextItem('Save', this.editor.save.bind(this.editor))
    ];
  }
}
