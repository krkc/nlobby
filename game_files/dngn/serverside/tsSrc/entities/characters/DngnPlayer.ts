import { DngnCharacter } from "./DngnCharacter";

export class DngnPlayer extends DngnCharacter {
  constructor(_pid: string) {
    super(_pid);

  }

  public move (keybd : any) {
    enum Key { Left = 37, Up = 38, Right = 39, Down = 40, Space = 32 };
    if (keybd.key == Key.Up) {

    }
    if (keybd.key == Key.Down) {

    }
    if (keybd.key == Key.Left) {

    }
    if (keybd.key == Key.Right) {

    }
  }
}
