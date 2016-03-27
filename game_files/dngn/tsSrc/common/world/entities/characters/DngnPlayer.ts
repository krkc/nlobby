import { DngnCharacter } from "./DngnCharacter";
import * as Classes from "./DngnClasses";

export class Player extends DngnCharacter {
  _weapon_type: number;
  constructor(_pid?: string) {
    if (_pid)
      super(_pid);
    else
      super("NULLPLAYER");
  }
}

export class PWarrior extends Player implements Classes.Warrior {
  constructor(_pid: string) {
    super(_pid);
    this._weapon_type = 0;
    this.spriteName = "warrior_m";
  }

  slash() {
    console.log('Warrior: Slash. Weapon type: ' + this._weapon_type);
  }
}

export class PMage extends Player implements Classes.Mage {
  constructor(_pid: string) {
    super(_pid);
    this._weapon_type = 1;
  }

  cast() {
    console.log('Mage: Cast. Weapon type: ' + this._weapon_type);
  }
}

export class PHealer extends Player implements Classes.Healer {
  constructor(_pid: string) {
    super(_pid);
    this._weapon_type = 2;
  }

  heal() {
    console.log('Healer: Heal. Weapon type:  ' + this._weapon_type);
  } // End heal
} // End class 'PHealer'
