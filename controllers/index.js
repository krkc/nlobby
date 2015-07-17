// Server-side script for index.jade

getTitle = function() {
	return "Game Lobby";
}

getBody = function(sessids) {

	return sessids;
}

exports.getContent = function(sessionids) {

	return { title: getTitle(), bodyContent: getBody(sessionids), userID: sessionids[sessionids.length-1] };
}