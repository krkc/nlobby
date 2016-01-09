// Server-side script for index.jade

exports.getContent = function(newuser, pNum) {

	return {
		title: "Game Lobby",
		userID: newuser,
		connStr: ':' + pNum
	};
};
