import CoreModule from '../../../core-module.mjs';

export default class GameCoreModule extends CoreModule {
  constructor(core) {
    super(core);

    /**
     *
     * @type {Player[]}
     */
    this.players = [];
  }
}
