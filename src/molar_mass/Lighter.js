import WeightedObject from "./WeightedObject.js ";

// TODO: Find actual value for grams in a ml of butane
const BUTANE_GRAMS_PER_ML = 0.002272727;

export default class Lighter extends WeightedObject {
  // TODO: Find actual mass of an empty lighter
  mass = 14;
  // TODO: Find actual amount of butane in lighter
  mlOfButane = 100;

  getMass() {
    // Mass is the mass of the lighter plus the mass of the butane inside
    return this.mass + (this.mlOfButane * BUTANE_GRAMS_PER_ML);
  }
}