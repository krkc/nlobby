import { Entity } from "../DngnEntity";
import { Direction, Key } from "../../../DngnEnums";

const CHAR_WIDTH = 30;
const CHAR_HEIGHT = 40;

export class DngnCharacter extends Entity {
  pid: string;
  _hitPoints: number;
  constructor(_pid : string) {
    this.pid = _pid;
    this.width = CHAR_WIDTH;
    this.height = CHAR_HEIGHT;
    super();
  }
} // End class
