import EditorMode from '../mode.mjs';

export default class NormalMode extends EditorMode {
  /**
   *
   * @param {EditorScene} editor
   */
  constructor(editor) {
    super(editor);
  }

  createContextMenu(bpe, ewp) {
    return [
      { label: 'Load', handler: () => this.editor.load() },
      { label: 'Save', handler: () => this.editor.save() }
    ];
  }
}
