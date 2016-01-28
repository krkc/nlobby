var assert = require('chai').assert;
var snkGame = require('../game_files/snake/serverside/snkGame');
var games = require('../controllers/ActiveGames');

describe('Server Message Tests', function () {
  var newGame = games.newGame('snake', '5', '6');

  describe('Player Ready', function (done) {
    it('should start game when 2 players are ready', function (done) {
      newGame.runData({ PlayerReady: true });
      assert.isNull(newGame.Message, 'Message is null');
      newGame.runData({ PlayerReady: true });
      assert.isNotNull(newGame.Message, 'Message is not null');
      done();
    }); // End it
  }); // End describe 'Player Ready'
}); // End describe 'Server Message Tests'
