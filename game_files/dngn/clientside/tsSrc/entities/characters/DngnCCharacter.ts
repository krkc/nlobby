// -- Client-side -- //


/**
 * @file Client for dngn game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */


/**
 * @class
 */
export class DngnCCharacter {
  hitPoints: number;
  location: {
    x: number,
    y: number
  };
  direction: string;
  velocity: number;
  acceleration: number;
  constructor() {
    this.hitPoints = 10;
  }
}
