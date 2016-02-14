// -- Client-side -- //


/**
 * @file Environment for dngn game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2016
 * @license GPLv3
 */

export enum textAlign {
  NONE, TOP, BOTTOM, LEFT, RIGHT, XCENTERED, YCENTERED,
  TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT,
  TOP_XCENTERED, BOTTOM_XCENTERED, LEFT_YCENTERED, RIGHT_YCENTERED
}

export class Menu {
 constructor() {

 }

 /**
  * This method displays text to the user
  *
  * @param {screenPosition} pos - Text-alignment
  * @param {number} width - Width (in percentage) of the text displayed
  * @param {number} height - Height (in percentage) of the text displayed
  * @param {string} text - The text to be displayed
  * @return {boolean} - Indication of success/failure
  */
 public showText(align: textAlign, width: number, height: number, text: string, x_position?: number, y_position?: number) {
   if (align == textAlign.NONE) {

   }
 }
}
