import { DngnCharacter } from "./DngnCharacter";
import * as Classes from "./DngnClasses";

export class Player extends DngnCharacter {
  _weapon_type: number;
  constructor(_pid: string) {
    super(_pid);
  }
}

export class PWarrior extends Player implements Classes.Warrior {
  constructor(_pid: string) {
    this._weapon_type = 0;
    super(_pid);
  }

  slash() {
    console.log('Warrior: Slash. Weapon type: ' + this._weapon_type);
  }
}

export class PMage extends Player implements Classes.Mage {
  constructor(_pid: string) {
    this._weapon_type = 1;
    super(_pid);
  }

  cast() {
    console.log('Mage: Cast. Weapon type: ' + this._weapon_type);
  }
}

export class PHealer extends Player implements Classes.Healer {
  constructor(_pid: string) {
    this._weapon_type = 2;
    super(_pid);
  }

  heal() {
    console.log('Healer: Heal. Weapon type:  ' + this._weapon_type);
  }
}
