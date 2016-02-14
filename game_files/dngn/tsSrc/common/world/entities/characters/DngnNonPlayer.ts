import { DngnCharacter } from "./DngnCharacter";

export class NonPlayer extends DngnCharacter {
  constructor(_pid: string) {
    super(this.pid);
  }
}

export class NPWarrior extends NonPlayer {
  constructor(_pid: string) {
    super(_pid);
  }
}

export class NPMage extends NonPlayer {
  constructor(_pid: string) {
    super(_pid);
  }
}

export class NPHealer extends NonPlayer {
  constructor(_pid: string) {
    super(_pid);
    
  }
}
