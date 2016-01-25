'use strict';

class DngnGame {
  constructor(_pid1, _pid2) {
    this.player1 = { pid: _pid1 };
    this.player2 = { pid: _pid2 };
    console.log('DngnGame test.');
  }

}

module.exports = DngnGame;
