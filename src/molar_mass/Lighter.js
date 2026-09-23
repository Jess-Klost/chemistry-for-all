import WeightedObject from "./WeightedObject.js ";

// TODO: Find actual value for grams in a ml of butane
const BUTANE_GRAMS_PER_ML = 0.002272727;

export default class Lighter extends WeightedObject {
  // TODO: Find actual mass of an empty lighter
  mass = 14;
  // TODO: Find actual amount of butane in lighter
  mlOfButane = 100;

  connectedTubing = null;

  getMass() {
    // Mass is the mass of the lighter plus the mass of the butane inside
    return this.mass + (this.mlOfButane * BUTANE_GRAMS_PER_ML);
  }

  /**
   * Reduces mlOfButane by a value within 0.1 mL of targetIncrement.
   * 
   * The actual amount of butane removed is a randomly selected number between 
   * targetIncrement - 0.1 mL and targetIncrement + 1 mL.
   * 
   * If connectedTubing is not null (meaning there is tubing connected to the lighter),
   * the butane will be transferred through the tubing. Otherwise, the butane will 
   * simply be removed from the lighter like normal.
   *  
   * @param {Number} targetIncrement The desired amount of butane in mL to be released from the lighter.   
   */
  releaseButane(targetIncrement = 0.5) {
    // Get random number between -0.1 and 0.1, and add to targetIncrement to add
    // some amount of error.
    var mlToRelease = targetIncrement + (Math.random() * (0.1 - -0.1) + -0.1);
    
    // If trying to release more butane than is currently in the lighter, 
    // empty exactly the amount in the lighter
    if (mlToRelease > this.mlOfButane) {
      mlToRelease = this.mlOfButane;
    }
    
    this.mlOfButane -= mlToRelease
    
    // If tubing is connected, transfer butane through tubing
    if (this.connectedTubing != null) {
      this.connectedTubing.transferButane(mlToRelease);
    }
  }

  connectTubing(tubing) {
    if (tubing != null)
      this.connectTubing = tubing;
  }
  
  removedTubing() {
    this.connectTubing = null;
  }
}