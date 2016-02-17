export enum CAlign {
  TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT,
  TOP_XCENTERED, BOTTOM_XCENTERED, LEFT_YCENTERED, RIGHT_YCENTERED,
  BULLSEYE
}

export class CanvasUnits {
  x: number[];    /* Grid values along the x-axis */
  y: number[];    /* Grid values along the y-axis */
  constructor() {
    this.x = [];
    this.y = [];
  }

  /**
	 * @function setRCU
	 * @memberof CanvasUnits
	 * @param _cwidth - total canvas width
   * @param _cheight - total canvas height
	 *
	 * @desc Defines units relative to the game canvas (Relative Canvas Units)
	 */
	public setRCU (_cwidth: number, _cheight: number) {
		// Empty any grid values
	  while (this.x.length > 0)
	    this.x.pop();
	  while (this.y.length > 0)
	    this.y.pop();
		// Fill x and y grid values
	  for (let i = 0; i <= 1; i += 0.01) {
	      this.x.push(Math.floor(_cwidth * i));
	      this.y.push(Math.floor(_cheight * i));
	  }
	}

  /**
   * This method calculates the x and y positions
   *  for common canvas alignments.
   *
   * @param align - Canvas alignment position
   * @param width - Amount to offset horizontally
   * @param height - Amount to offset vertically
   * @return - An object containing x and y positions
   */
  public getRCU (align: CAlign, width: number, height: number) {
    if (align == CAlign.TOP_LEFT)
      return { x: 0, y: 0 };
    if (align == CAlign.TOP_RIGHT)
      return { x: this.x[100] - width, y: 0 };
    if (align == CAlign.BOTTOM_LEFT)
      return { x: 0, y: this.y[100] - height }
    if (align == CAlign.BOTTOM_RIGHT)
      return { x: this.x[100] - width, y: this.y[100] - height }
    if (align == CAlign.TOP_XCENTERED)
      return { x: this.x[50] - (width / 2), y: 0 }
    if (align == CAlign.BOTTOM_XCENTERED)
      return { x: this.x[50] - (width / 2), y: this.y[100] - height }
    if (align == CAlign.LEFT_YCENTERED)
      return { x: 0, y: this.y[50] - (width / 2) }
    if (align == CAlign.RIGHT_YCENTERED)
      return { x: this.x[100] - width, y: this.y[50] - (width / 2) }
    if (align == CAlign.BULLSEYE)
      return { x: this.x[50] - (width / 2), y: this.y[50] - (width / 2) }
  }

}
