import EditorMode from '../mode.mjs';
import ActiveTextItem from '../../../context-menu/items/active-text.mjs';
import l from '../../../i18n.mjs';
import lt from '../../../long-text.mjs';

export default class NormalMode extends EditorMode {

  static description = lt.Application.Scene.Editor.Mode.Normal.Description;

  /**
   *
   * @param {EditorScene} editor
   */
  constructor(editor) {
    super(editor);

    this._lt = lt.Application.Scene.Editor.Mode.Normal;
  }

  contextMenuBuilder(bpe, ewp) {
    return [
      new ActiveTextItem([
        l(this._lt.Load.ContextMenu.Text),
        l(this._lt.Load.ContextMenu.Title)
      ], this.editor.load.bind(this.editor)),
      new ActiveTextItem([
        l(this._lt.Save.ContextMenu.Text),
        l(this._lt.Save.ContextMenu.Title)
      ], this.editor.save.bind(this.editor))
    ];
  }
}
