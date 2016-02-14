export enum Classes { Warrior, Mage, Healer };


export interface Warrior {
  slash(): void;
}

export interface Mage {
  cast(): void;
}

export interface Healer {
  heal(): void;
}
