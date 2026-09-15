module.exports = class WeightedObject {
  weight = 0;

  constructor(weight) {
    this.weight = weight;
  }

  GetWeight() {
    return this.weight;
  }
}