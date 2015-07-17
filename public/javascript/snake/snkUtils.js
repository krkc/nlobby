//	-----------------------------------------------------
//	Function:		RCU()
//	Parameters:		None
//	Return:			None
//	Description:	Defines units relative to the game
//                canvas. (Relative Canvas Units)
//	-----------------------------------------------------


function RCU(cHeight, cWidth) {

  while (rcux.length > 0)
    rcux.pop();
  while (rcuy.length > 0)
    rcuy.pop();

  for (var i = 0; i <= 1.01; i += .01) {
      rcux.push(Math.floor(cWidth * i));
      rcuy.push(Math.floor(cHeight * i));
  }

}
