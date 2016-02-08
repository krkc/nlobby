import { DngnCCharacter } from "./DngnCCharacter";
import * as Classes from "./DngnCClasses";

export class NonPlayer extends DngnCCharacter {
  constructor() {
    super();
    //
  }
}

export class NPWarrior extends NonPlayer implements Classes.Warrior {
  constructor() {
    super();
  }

  slash() {

  }
}

export class NPMage extends NonPlayer implements Classes.Mage {
  constructor() {
    super();
  }

  cast() {

  }
}

export class NPHealer extends NonPlayer implements Classes.Healer {
  constructor() {
    super();
  }

  heal() {

  }
}
