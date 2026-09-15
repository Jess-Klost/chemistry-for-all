class WeightedObject {
  weight = 0;

  constructor(weight) {
    this.weight = weight;
  }

  GetWeight() {
    return this.weight;
  }
}

if (typeof exports !== 'undefined') {
  module.exports = WeightedObject;
}