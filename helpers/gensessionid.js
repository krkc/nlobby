var hashids = require('hashids');

hashids = new hashids('salty');

exports.genuuid = function(sessionNum) {

	var id = hashids.encode(sessionNum);
	var hashedID = id + sessionNum;

	return hashedID;
}


exports.deleteSessionID = function(sessionNum) {
	
}