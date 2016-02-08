// -- Client-side -- //


/**
 * @file Client for dngn game
 * @author Christopher Kurek [cakurek1@gmail.com]
 * @copyright Christopher Kurek 2015
 * @license GPLv3
 */

 export interface Warrior {
   slash(): void;
 }

 export interface Mage {
   cast(): void;
 }

 export interface Healer {
   heal(): void;
 }
