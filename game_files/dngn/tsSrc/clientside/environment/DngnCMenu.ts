// -- Client-side -- //


/**
 * @file Environment for dngn game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2016
 * @license GPLv3
 */

import { CanvasUnits, CAlign } from "./DngnRCU";
import { Key } from "../../common/DngnMessages";
import { Classes } from "../../common/world/entities/characters/DngnClasses";

export class Menu {
  displayed: boolean;   /* indicates if menu is currently displayed */
  width: number;        /* Menu width in pixels */
  height: number;       /* Menu height in pixels */
  position: { x: number, y: number }; /* x and y location of menu */
  headingText: string;
  htWidth: number;
  heading: { text: string, width: number, height: number, vOffset: number, hOffset: number };
  classProfiles: ClassProfile[];
  callback: any;
  constructor(_avatars : { warrior: HTMLImageElement }) {
    this.displayed = false;
    this.width = 0;
    this.height = 0;
    this.position = { x: 0, y: 0 };
    this.heading = { text: "Please choose a class", width: 0,
                      height: 0, vOffset: 0, hOffset: 0 };
    this.classProfiles = [new ClassProfile(_avatars.warrior, Classes.Warrior),
        new ClassProfile(_avatars.warrior, Classes.Warrior),
        new ClassProfile(_avatars.warrior, Classes.Warrior)];
    this.callback = null;
  }

  public setLayout(_glol: CanvasRenderingContext2D, _rcu: CanvasUnits, _orientation: string, _cb?: (_selectedClass: Classes) => void) {
    if (_cb) this.callback = _cb;

    if (_orientation == "landscape") {
      this.width = _rcu.y[79];
      this.height = _rcu.y[74];
      this.heading.height = _rcu.y[5];
    } else if (_orientation == "portrait") {
      this.width = _rcu.x[95];
      this.height = _rcu.x[74];
      this.heading.height = _rcu.x[6];
    }
    // Prepare heading
    _glol.font = this.heading.height + "px Arial";
    this.heading.width = _glol.measureText(this.heading.text).width;
    this.heading.vOffset = (this.height * 0.125);
    this.heading.hOffset = (this.width / 2) - (this.heading.width / 2);
    // Prepare class profiles
    for (let profile of this.classProfiles) {
      profile.width = this.width * 0.2;
      profile.height = this.height * 0.6;
      profile.avatar.width = profile.width;
      profile.avatar.height = profile.height;
      profile.positionOffset.y = (this.height * 0.3);
    }
    this.classProfiles[0].positionOffset.x = ((this.width/4) - (this.classProfiles[0].width / 2));
    this.classProfiles[1].positionOffset.x = ((this.width/2) - (this.classProfiles[1].width / 2));
    this.classProfiles[2].positionOffset.x = ((this.width/4*3) - (this.classProfiles[2].width / 2));
  }

  /**
  * This method displays text to the user
  *
  * @param {screenPosition} pos - Text-alignment
  * @param {number} width - Width (in percentage) of the text displayed
  * @param {number} height - Height (in percentage) of the text displayed
  * @param {string} text - The text to be displayed
  * @return {boolean} - Indication of success/failure
  */
  public show(glol: CanvasRenderingContext2D, align: { x: number, y: number }) {
    this.position.x = align.x;
    this.position.y = align.y;
    // Display menu Background
    glol.fillStyle = "#222288";
    glol.fillRect(this.position.x, this.position.y, this.width, this.height);
    // Display heading
    glol.fillStyle = "#aaaaaa";
    glol.fillText(this.heading.text, this.position.x + this.heading.hOffset,
                    this.position.y + this.heading.vOffset);
    // Display each class profile
    for (let _profile of this.classProfiles) {
      glol.drawImage(_profile.avatar, this.position.x + _profile.positionOffset.x,
                      this.position.y + _profile.positionOffset.y,
                      _profile.avatar.width, _profile.avatar.height);
    }

    this.displayed = true;
    return true;
  }

  /**
   * This method hides the class selection menu
   *
   * @param glol - The canvas rendering context
   */
  public hide(glol: CanvasRenderingContext2D) {
    glol.clearRect(this.position.x, this.position.y, this.width, this.height);
    this.displayed = false;
  }

  public onClick(mouseX: number, mouseY: number) {
    for (let _profile of this.classProfiles) {
      let leftSide = this.position.x + _profile.positionOffset.x;
      let rightSide = leftSide + _profile.width;
      let topSide = this.position.y + _profile.positionOffset.y;
      let bottomSide = topSide + _profile.height;
      if (mouseX > leftSide && mouseX < rightSide) {
        if (mouseY > topSide && mouseY < bottomSide) {
          this.callback(_profile.classID);
        }
      }
    }
  }

  public onKey(keyCode: number) {
    if (keyCode == Key.One)
      this.callback(Classes.Warrior);
    else if (keyCode == Key.Two)
      this.callback(Classes.Mage);
    else if (keyCode == Key.Three)
      this.callback(Classes.Healer);
  }
}

class ClassProfile {
  classID: Classes;
  width: number;
  height: number;
  positionOffset: { x: number, y: number };
  avatar: HTMLImageElement;
  constructor(_avatar : HTMLImageElement, _classID : Classes) {
    this.classID = 0;
    this.width = 0;
    this.height = 0;
    this.positionOffset = { x: 0, y: 0 };
    this.avatar = _avatar;
  }
}
