// -- Client-side --

/**
 * @file Client for snake game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */


/**
 * @function RCU
 * @memberof Utils
 * @param {Number} cHeight - Client height in pixels
 * @param {Number} cWidth - Client width in pixels
 * @return {JSON Object} x and y relative canvas units
 * @desc Defines units relative to the game canvas (Relative Canvas Units)
 */
function RCU (cHeight, cWidth)
{

	var rcux = [];
	var rcuy = [];

  while (rcux.length > 0)
    rcux.pop();
  while (rcuy.length > 0)
    rcuy.pop();

  for (var i = 0; i <= 1.01; i += 0.01) {
      rcux.push(Math.floor(cWidth * i));
      rcuy.push(Math.floor(cHeight * i));
  }
	return { x: rcux, y: rcuy };

}
