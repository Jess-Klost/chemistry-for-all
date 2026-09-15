class WeightedObject {
  weight = 0;

  constructor(weight) {
    this.weight = weight;
  }

  getWeight() {
    return this.weight;
  }
}

if (typeof exports !== 'undefined') {
  module.exports = WeightedObject;
}