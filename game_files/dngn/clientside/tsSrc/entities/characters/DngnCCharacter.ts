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
  pid: string;
  location: {
    x: number,
    y: number
  };
  direction: string;
  constructor(_pid : string) {
    this.pid = _pid;
  }
}
