var assert = require('chai').assert;
var nlGames = require('../controllers/ActiveGames.js');

describe('Active Games module', function () {

  describe('New Game', function () {
    var newGame;
    it('should create a new game', function () {
      newGame = nlGames.newGame('snakegame', '3', '4');
      assert.isNotNull(newGame, 'a value was returned');
      assert.isObject(newGame, 'an object was returned');
    }); // End it
  }); // End describe 'New Game'

  describe('Current Games', function () {
    var newGame = nlGames.newGame('snakegame', '1', '2');

    describe('Find Game', function () {
      var foundGame;
      it('should find a game by ID', function () {
        foundGame = nlGames.findGame(newGame.PlayerOne.ID);
        assert.isNotNull(foundGame, 'a value was returned');
        assert.isObject(foundGame, 'an object was returned');
        assert.equal(newGame.GameID, foundGame.GameID);
      }); // End it
    }); // End describe 'Find Game'
    describe('Remove Game', function () {
      it('should remove a game', function () {
        var pid = newGame.PlayerOne.ID;
        assert.isNotNull(newGame, 'the game object is not null');
        nlGames.removeGame(newGame);
        var foundGame;
        foundGame = nlGames.findGame(pid);
        assert.isNull(foundGame, 'the game object is null');
      }); // End it
    }); // End describe 'Remove Game'
  }); // End describe 'Current Games'

}); // End describe 'Active Games module'
