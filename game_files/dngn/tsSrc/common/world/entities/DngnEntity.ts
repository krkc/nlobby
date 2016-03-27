import { Direction, Key } from "../../../common/DngnEnums";

const MAX_VEL = 5;
const MAX_ACC = 3;
const CHAR_WIDTH = 5;
const CHAR_HEIGHT = 6;

export class Entity {
  _entityID: number;
  _location: { x: number, y: number };
  _velocity: { x: number, y: number }
  _acceleration: { x: number, y: number }
  _direction: Direction;
  spriteName: string;
  width: number;
  height: number;
  constructor() {
    this._entityID = 0;
    this._location = { x : 10, y : 90 };
    this._velocity = { x: 0, y: 0 };
    this._acceleration = { x: 0, y: 0 };
    this._direction = Direction.EAST;
    this.spriteName = null;
    this.width = 0;
    this.height = 0;
  }

  /**
   * This method begins a character movement
   *
   * @param _key - The key pressed by the user
   */
  public startMove(_key : Key) {
    if (_key == Key.Up) {
      // Accelerate north
      this._direction = Direction.NORTH;
      if (this._acceleration.y >= -MAX_ACC)
        this._acceleration.y += -1;
      if (this._velocity.y >= -MAX_VEL)
        this._velocity.y += this._acceleration.y;
    }
    if (_key == Key.Down) {
      // Accelerate south
      this._direction = Direction.SOUTH;
      if (this._acceleration.y <= MAX_ACC)
        this._acceleration.y += 1;
      if (this._velocity.y <= MAX_VEL)
        this._velocity.y += this._acceleration.y;
    }
    if (_key == Key.Left) {
      // Accelerate west
      this._direction = Direction.WEST;
      if (this._acceleration.y >= -MAX_ACC)
        this._acceleration.y += 1;
      if (this._velocity.x >= -MAX_VEL)
        this._velocity.x += this._acceleration.x;
    }
    if (_key == Key.Right) {
      // Accelerate east
      this._direction = Direction.EAST;
      if (this._acceleration.y <= MAX_ACC)
        this._acceleration.y += -1;
      if (this._velocity.x <= MAX_VEL)
        this._velocity.x += this._acceleration.x;
    }
    // Execute movement
    this.move(true);
  } // End startMove

  /**
   * This method moves the character's position on the map
   *
   * @param _accelerating - Indicates if player is accelerating or not
   * @return x and y axis locations for each side of the character
   */
  public move(_accelerating? : boolean) {
    if (this._velocity.x == 0 && this._velocity.y == 0)
      return null;
    // Move or decelerate horizontally
    if (this._velocity.x != 0) {
      this._location.x += this._velocity.x;
      if (!_accelerating)
        this._velocity.x += this._acceleration.x;
    }
    // Move or decelerate vertically
    if (this._velocity.y != 0) {
      this._location.y += this._velocity.y;
      if (!_accelerating)
        this._velocity.y += this._acceleration.y;
    }
    return this.getSides();
  } // End move

  /**
   * This method returns the boundaries of the character position
   */
  public getSides() {
    return [this._location.x, (this._location.x + CHAR_WIDTH),
            this._location.y, (this._location.y + CHAR_HEIGHT)];
  } // End getSides

  /**
   * This method tests for x-axis collisions
   *
   * @return {boolean} - Status of collision
   */
  public testXCollisions(_x1: number, _x2: number) {
    let myx2 = (this._location.x + CHAR_WIDTH);
    // Test my left side
    if (this._location.x >= _x1 && myx2 <= _x2) {
      // Collision detected
      return true;
    } else
    // Test my right side
    if (myx2 >= _x1 && this._location.x <= _x2) {
      // Collision detected
      return true;
    } else
    // Flip and test other character's sides (in case I'm wider)
    // Test their left side
    if (_x1 >= this._location.x && _x2 <= myx2) {
      // Collision detected
      return true;
    } else
    // Test their left side
    if (_x2 >= myx2 && _x1 <= this._location.x) {
      // Collision detected
      return true;
    } else {
      // No collisions detected
      return false;
    }
  }

  /**
   * This method tests for y-axis collisions
   *
   * @return {boolean} - Status of collision
   */
  public textYCollisions(_y1: number, _y2: number) {
    let myy2 = (this._location.y + CHAR_HEIGHT);
    // Test my top side
    if (this._location.y >= _y1 && myy2 <= _y2) {
      // Collision detected
      return true;
    } else
    // Test my bottom side
    if (myy2 >= _y1 && this._location.x <= _y2) {
      // Collision detected
      return true;
    } else
    // Flip and test other character's sides (in case I'm taller)
    // Test their top side
    if (_y1 >= this._location.y && _y2 <= myy2) {
      // Collision detected
      return true;
    } else
    // Test their bottom side
    if (_y2 >= myy2 && _y1 <= this._location.y) {
      // Collision detected
      return true;
    } else {
      // No collisions detected
      return false;
    }
  }

  /**
   * This method returns the movement direction of the player
   */
  public isMoving() {
    if (this._velocity.x > 0 || this._velocity.y > 0)
      return this._direction;
    else
      return null;
  }
}
