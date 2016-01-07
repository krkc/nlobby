// Server-side script for index.jade

exports.getContent = function(newuser) {

	return {
		title: "Game Lobby",
		userID: newuser
	};
};
