// -- Client-side script for the game page --


/**
 * @file Client-side script for the nlobby game page
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license MIT
 */

// Connect to game room
var ngroom = NgRoom('192.168.1.7:3000');

/**
 * @function readyStatus
 * @desc Checks the ready state of the game and informs server
 */
function readyStatus()
{
	// Check ready state and inform server
	if (client.checkGameReady()) {
		dataToServer({
			readyID: myID
		});
	} else {
		dataToServer({
			readyID: null
		});
	}
}
