// Server-side script for game.jade

function getTitle() {
	return 'Playing Game...';
}

function getBody() {
	return 'testBodytest';
}

exports.getContent = function(sessionids) {

	return { title: getTitle(), bodyContent: getBody()};
}