import { DngnCharacter } from "./DngnCharacter";

export class DngnNonPlayer extends DngnCharacter {
  constructor() {
    super(this.pid);
  }
}
