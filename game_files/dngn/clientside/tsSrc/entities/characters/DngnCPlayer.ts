import { DngnCCharacter } from "./DngnCCharacter";
import * as Classes from "./DngnCClasses";

export class Player extends DngnCCharacter {
  pid: string;
  _weapon_type: number;
  constructor(_pid: string) {
    super();
    this.pid = _pid;
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
    console.log('Healer: Heal. Weapon type: ' + this._weapon_type);
  }
}
