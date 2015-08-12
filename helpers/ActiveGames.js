
var ActiveGames = function () {

  // Private data members
  this.sessions = [];

};

// Public methods
ActiveGames.prototype.newGame = function (p1, p2) {
  this.sessions.push({
    GameID: p1 + p2,   /*  */
    PlayerOne: {
      PlayerID: p1,
      XLoc: -1,
      YLoc: -1,
      Score: 0
    },
    PlayerTwo: {
      PlayerID: p2,
      XLoc: -1,
      YLoc: -1,
      Score: 0
    }
  });

  return this.sessions[this.sessions.length-1];
};

ActiveGames.prototype.findGame = function (pid) {
  for (var game of this.sessions) {
    if ((game.PlayerOne.PlayerID === pid) || (game.PlayerTwo.PlayerID === pid)) {
      return game;
    } else {
      return 0;
    }
  }
};

module.exports = new ActiveGames();
