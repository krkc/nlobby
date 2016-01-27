/**
 * @file Server-side script for game.jade
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */


// Server-side script for index.jade

exports.getIContent = function(newuser, port) {

	return {
		title: "Game Lobby",
		userID: newuser,
		connStr: ':' + port
	};
};


// -- Server-side script for game.jade --

/**
 * @function getTitle
 * @return {String} String containing the generated page title
 * @desc Generate a page title for the current view.
 */
function getTitle() {
	return 'Playing Game...';
}

/**
 * @function getBody
 * @return {String} String containing the body content
 * @desc Generate content for the page body.
 */
function getBody() {
	return 'testBodytest';
}

/**
 * @function getContent
 * @return {Object} A JSON object containing data for the current view
 */
exports.getGContent = function(port) {
	return {
		title: getTitle(),
		bodyContent: getBody(),
		connStr: ':' + port,
		toastMsg: 'Toast Test'
	};
};
