import FillableObject from "./FillableObject.js";

export default class Cylinder extends FillableObject {
  capacity = 50;

  // Pick an amount of difference in displaced level added when the cylinder
  // is not leveled with the water trough, this represents the effect of the 
  // water vapor
  // TODO: verify if this is chemically accurate
  static AMOUNT_TO_ADD_WHEN_NOT_LEVELED = Math.random();

  waterTrough = null;
  isInvertedInTrough = false;
  isLeveledWithTroughWater = false;

  submergeInWaterTrough(waterTrough) {
    this.waterTrough = waterTrough;
    this.isInvertedInTrough = false;
    this.isLeveledWithTroughWater = false;
  }

  removeFromWaterTrough() {
    if (this.waterTrough != null && this.isInvertedInTrough) {
      this.waterTrough.addLiquid(this.removeLiquid(this.capacity));
      this.waterTrough = null;
    }
    this.isInvertedInTrough = false;
    this.isLeveledWithTroughWater = false;
  }

  invertInWaterTrough() {
    if (this.waterTrough != null) {
      this.isInvertedInTrough = true;
      this.addLiquid(this.waterTrough.removeLiquid(this.capacity));
    }
  }

  setIsLeveledWithTroughWater(state) {
    // Must be inverted in trough to level it with trough water
    if (state && this.isInvertedInTrough) {
      this.isLeveledWithTroughWater = true;
    }
    else {
      this.isLeveledWithTroughWater = false;
    }
  }

  transferButane(amountToTransfer) {
    // Only displace water if in the proper set up
    if (this.waterTrough != null && this.isInvertedInTrough 
      && !this.isLeveledWithTroughWater) {
      this.waterTrough.addLiquid(this.removeLiquid(amountToTransfer));
    }
  }

  getDisplacedLevel() {
    if (this.isLeveledWithTroughWater) {
      return this.capacity - this.currentLevel;
    }
    else {
      return Math.max(this.capacity - (this.currentLevel - Cylinder.AMOUNT_TO_ADD_WHEN_NOT_LEVELED), 0);
    }
  }
}