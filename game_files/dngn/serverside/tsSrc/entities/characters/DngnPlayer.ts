import { DngnCharacter } from "./DngnCharacter";

export class Player extends DngnCharacter {
  constructor(_pid: string) {
    super(_pid);
  }
}

export class PWarrior extends Player {
  constructor(_pid: string) {
    super(_pid);
  }
}

export class PMage extends Player {
  constructor(_pid: string) {
    super(_pid);
  }
}

export class PHealer extends Player {
  constructor(_pid: string) {
    super(_pid);
  }
}
