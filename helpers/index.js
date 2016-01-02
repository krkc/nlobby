// Server-side script for index.jade

exports.getContent = function(newuser, users) {

	return {
		title: "Game Lobby",
		bodyContent: users,
		userID: newuser.Uuid_h
	};
};
