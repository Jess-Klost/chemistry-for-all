import MultiFillableObject from "./MultiFillableObject.js";
import Beaker from "./Beaker.js";

export default class Buret extends MultiFillableObject { //HOLLY WAS HERE
  capacity = 50;

  /**
   * @type {Beaker}
   */
  connectedBeaker = null;

  getBuretReading() {
    return this.capacity - this.getCurrentLevel();
  }

  releaseLiquid(targetAmount = 0.1) {
    // Get random number between +/-10% of targetIncrement
    // This adds some amount of error
    const variance = targetAmount * 0.1;
    const mlToRelease = Math.max(targetAmount + (Math.random() * (variance - -variance) + -variance), 0);
    
    // If tubing is connected, transfer butane through tubing
    if (this.connectedBeaker != null) {
      this.transferLiquid(this.connectedBeaker, mlToRelease);
    }
    else {
      this.removeLiquid(mlToRelease);
    }
  }

  /**
   * 
   * @param {Beaker} beaker 
   */
  connectBeaker(beaker) {
    if (this.connectedBeaker == null)
      this.connectedBeaker = beaker;
  }

  removeBeaker() {
    this.connectedBeaker = null;
  }

  hasBeaker() {
    return this.connectedBeaker != null;
  }
}