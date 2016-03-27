// -- Client-side -- //


/**
 * @file Environment for dngn game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2016
 * @license GPLv3
 */

import { Menu } from "./DngnCMenu";
import { HUD } from "./DngnCHUD";
import { CanvasUnits, CAlign } from "./DngnRCU";
import { Classes } from "../../common/world/entities/characters/DngnClasses";
import { Player } from "../../common/world/entities/characters/DngnPlayer";

declare type envCallback = () => void;

export class Environment {
  canvbg : HTMLCanvasElement;   /* Background canvas element */
  canvfg : HTMLCanvasElement;   /* Foreground canvas element */
  canvol : HTMLCanvasElement;   /* HUD Overlay canvas element */
  wWidth : number;            /* Window width */
  wHeight : number;           /* Window height */
  existingWidth : number;     /* Used for preventing vertical resizing */
  wOrientation : string;      /* Screen orientation (landscape/portrait) */
  glbg : CanvasRenderingContext2D;  /* 2D rendering context for background */
  glfg : CanvasRenderingContext2D;  /* 2D rendering context for foreground */
  glol : CanvasRenderingContext2D;  /* 2D rendering context for HUD overlay */
  rcu : CanvasUnits;
  titleMenu : Menu;           /* Class-selection menu */
  hud : HUD;                  /* Heads-up-display */
  backgroundSprite: HTMLImageElement;
  bgStateChanged: boolean;
  characterSprite: { warrior_m: HTMLImageElement };     /* Sprite to be used for game characters */
  classAvatar: {
    warrior : HTMLImageElement
  }
  assetsToLoad: number;
  constructor() {
    this._getPageElements();
    this._setCanvas();
    this._setCanvasContext();
    this.rcu = new CanvasUnits();
    this.rcu.setRCU(this.canvfg.width, this.canvfg.height);
    this.bgStateChanged = true;
    // Initialize default image placeholder objects
    this.backgroundSprite = new Image();
    this.characterSprite = { warrior_m: new Image() };
    this.classAvatar = { warrior: new Image() };
    this.assetsToLoad = 3;
    // Create class selection menu and Heads-up-display
    this.titleMenu = new Menu(this.classAvatar);
    this.hud = new HUD();
  }

  get Foreground () {
    return this.glfg;
  }

  get Overlay () {
    return this.glol;
  }

  public loadAssets(callback : envCallback) {
    this.backgroundSprite.src = "textures/brick_1.png";
    this.characterSprite["warrior_m"].src = "textures/warrior_m.png";
    this.classAvatar.warrior.src = "textures/warrior_class_profile.png";
    this.backgroundSprite.onload = () => { this.checkAssetsLoaded(callback) };
    this.characterSprite["warrior_m"].onload = () => { this.checkAssetsLoaded(callback) };
    this.classAvatar.warrior.onload = () => { this.checkAssetsLoaded(callback) };
  }

  public checkAssetsLoaded(_done: envCallback) {
    if (--this.assetsToLoad == 0) {
      _done();
    }
  }

  /**
   * Retreive all needed DOM page elements
   */
  private _getPageElements() {
    this.canvbg = <HTMLCanvasElement>document.getElementById("canvbg");
    this.canvfg = <HTMLCanvasElement>document.getElementById("canvfg");
    this.canvol = <HTMLCanvasElement>document.getElementById("canvol");
  }

  /**
   * Specify the canvas attributes for the page
   */
  private _setCanvas() {
    this.wWidth = window.innerWidth;
    this.wHeight = window.innerHeight;
    this.existingWidth = this.wWidth;
    // Specify canvas size based on window dimensions
    if (this.wWidth > this.wHeight) {
      this.wOrientation = "landscape";
      let landscapeHeight = Math.floor(this.wHeight - (this.wHeight * 0.1)).toString();
      let landscapeWidth = Math.floor(this.wWidth - (this.wWidth * 0.4)).toString();
      this.canvbg.setAttribute('width', landscapeWidth);
      this.canvbg.setAttribute('height', landscapeHeight);
      this.canvfg.setAttribute('width', landscapeWidth);
      this.canvfg.setAttribute('height', landscapeHeight);
      this.canvol.setAttribute('width', landscapeWidth);
      this.canvol.setAttribute('height', landscapeHeight);
    } else {
      let portraitWidth = Math.floor(this.wWidth - (this.wWidth * 0.01)).toString();
      let portraitHeight = Math.floor(this.wHeight - (this.wHeight * 0.006)).toString();
      this.wOrientation = "portrait";
      this.canvbg.setAttribute('width', portraitWidth);
      this.canvbg.setAttribute('height', portraitHeight);
      this.canvfg.setAttribute('width', portraitWidth);
      this.canvfg.setAttribute('height', portraitHeight);
      this.canvol.setAttribute('width', portraitWidth);
      this.canvol.setAttribute('height', portraitHeight);
    }
  }

  private _setCanvasContext() {
    // Establish a 2D drawing context.
		try {
			this.glbg = this.canvbg.getContext("2d");
			this.glfg = this.canvfg.getContext("2d");
      this.glol = this.canvol.getContext("2d");				/* Drawing context object */
		}
		catch(e){
			console.log("Error establishing drawing context.");
		}
  }

  /**
   * This method redraws the entire scene
   */
  public drawScene(ents: Player[]) {
    // Clear scene
    this.glfg.clearRect(0,0,this.canvfg.width, this.canvfg.height);
    // Redraw scene entities
    for (let ent of ents) {
      this.glfg.drawImage(this.characterSprite[ent.spriteName], this.rcu[ent._location.x], this.rcu[ent._location.y],
                      this.rcu[ent.width], this.rcu[ent.height]);
    }

  }

  /**
   * This method redraws the background canvas
   */
  public drawBackground() {
    this.glbg.drawImage(this.backgroundSprite, 0, 0,
                    this.canvbg.width, this.canvbg.height);
  }

  /**
		* @function promptMenu
		* @memberof Environment
    * @param _callback - Callback function to call when class selected
		*
		* @desc Prompts a class-selection menu to the user
	*/
	public promptMenu(_callback? : (_selectedClass: Classes) => void) {
    if (_callback) {
      this.titleMenu.setLayout(this.glol, this.rcu, this.wOrientation, _callback);
    }
    this.titleMenu.setLayout(this.glol, this.rcu, this.wOrientation);
    this.titleMenu.show(this.glol, this.rcu.getRCU(CAlign.BULLSEYE, this.titleMenu.width, this.titleMenu.height));
		// User has selected a class
	}

  /**
		* @function hideMenu
		* @memberof Environment
		*
		* @desc Hides the class-selection menu
	*/
  public hideMenu() {
    if (this.titleMenu.displayed)
      this.titleMenu.hide(this.glol);
  }

  public onResize(EnvContext: Environment, event: Event) {
    EnvContext._setCanvas();
    EnvContext.rcu.setRCU(EnvContext.canvfg.width, EnvContext.canvfg.height);
    if (EnvContext.titleMenu.displayed)
      EnvContext.promptMenu();
  } // End onResize
} // End class 'Environment'
