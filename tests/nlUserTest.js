var assert = require('chai').assert;
var nlUsers = require('../controllers/ActiveUsers.js');

describe('Active Users module', function () {

  describe('New User', function () {
    it('should return a new user id', function (done) {
      nlUsers.newUser(1, function (err, newUuid) {
        if (err) done(err);
        assert.isNotNull(newUuid, 'a valid user id was created');
        done();
      });
    }); // End it
  }); // End describe 'New User'

  describe('Current Users', function () {
    var username;
    before(function (done) {
      nlUsers.newUser(1, function (err, newUuid) {
        if (err) done(err);
        username = newUuid;
        done();
      });
    }); // End before
    describe('Find User', function () {
      it('should find a user', function (done) {
        nlUsers.findUser(username, function (err, user) {
          if (err) done(err);
          assert.isNotNull(user, 'The user was found and returned');
          done();
        });
      }); // End it
    }); // End describe 'Find user'
    describe('List Users', function () {
      it('should return an array of all usernames', function (done) {
        nlUsers.listUsers(function (err, userList) {
          if (err) done(err);
          assert.isArray(userList, 'an array of usernames was returned');
          done();
        });
      }); // End it
    }); // End describe 'List Users'
    describe('Remove User', function () {
      it('should remove a user', function (done) {
        nlUsers.removeUser(username, function (err, status) {
          if (err) done(err);
          assert.isNotNull(status, 'a user was successfully removed');
          done();
        });
      }); // End it
    }); // End describe 'Remove User'
  }); // End describe 'Current Users'

}); // End describe 'Active Users module'
