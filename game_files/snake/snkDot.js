// -- Server-side --

/**
 * @file Manages the dot object
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */



/**
 * @class Dot
 * @desc Class representing Dot player
 */
var Dot = function ()
{
  'use strict';

  // -- Private -- //

  // For a 100x100 map, each square is 5
  var xLoc = 50;    /* Starting position on x-axis */
  var yLoc = 40;    /* Starting position on y-axis */
  var score = 0;    /* Dot player's running score */
  var set = false;  /* Indicates if dot is currently set in-game */




  // -- Public -- //

  /**
   * @property XLoc
   * @memberof Dot
   * @return {Array} - x-axis locations of dot
   * @desc Getter for current dot x-axis location
   * @public
   */
  Object.defineProperty(Dot, 'XLoc', {
    get: function() { return xLoc; },
    enumerable: true,
    configurable: true
  });

  /**
   * @property YLoc
   * @memberof Dot
   * @return {Array} - y-axis locations of dot blocks
   * @desc Getter for current dot y-axis location
   * @public
   */
  Object.defineProperty(Dot, 'YLoc', {
    get: function() { return yLoc; },
    enumerable: true,
    configurable: true
  });

  /**
   * @property Score
   * @memberof Dot
   * @return {Integer} - score of the current dot player
   * @desc Getter for current dot player's running score
   * @public
   */
  Object.defineProperty(Dot, 'Score', {
    get: function() { return score; },
    enumerable: true,
    configurable: true
  });

  /**
   * @property DotSet
   * @memberof Dot
   * @param {Boolean} newStatus - Updated set status for dot (when used as setter)
   * @return {Boolean} - confirmation that dot is set (when used as getter)
   * @desc Updates dot set status or returns confirmation that dot is set
   * @public
   */
  Object.defineProperty(Dot, 'DotSet', {
    get: function() { return set; },
    set: function(newStatus) { set = newStatus; },
    enumerable: true,
    configurable: true
  });

};

module.exports = Dot;
