import Liquid from "./liquids/Liquid.js";
import Water from "./liquids/Water.js";

export default class MultiFillableObject {
  /**
   * @type {Map<Liquid, Number>}
   */
  liquids = new Map();

  capacity;

  constructor(capacity) {
    this.capacity = capacity;
  }

  isFull() {
    return this.getCurrentLevel() == this.capacity;
  }

  fillCompletely(liquidType = Water) {
    this.addLiquid(this.capacity, liquidType);
  }

  emptyCompletely() {
    this.liquids.clear();
  }

  addLiquid(amountToAdd, liquidType = Water) {
    const currentLevel = this.getCurrentLevel();
    var newAmount = amountToAdd;
    // If new amount goes above capacity, reduce to reach capacity instead
    if (currentLevel + amountToAdd > this.capacity) {
      newAmount = this.capacity - currentLevel;
    }
    // If this object already contains this liquid, add to that amount
    if (this.liquids.has(liquidType)) {
      newAmount += this.liquids.get(liquidType);
    }
    this.liquids.set(liquidType, newAmount);
  }

  removeLiquid(amountToRemove, liquidType = null) {
    // If no type specified, evenly remove from each type to keep ratio the same
    if (liquidType == null) {
      const currentLevel = this.getCurrentLevel();
      // If trying to remove more than possible, clear all liquids and return
      if (amountToRemove >= currentLevel) {
        this.liquids.clear();
        return;
      }
      const percentToRemove = (currentLevel - amountToRemove) / currentLevel;
      for (const liquidInfo of this.liquids) {
        this.liquids.set(liquidInfo[0], liquidInfo[1] * percentToRemove);
      }
    }
    else if (this.liquids.has(liquidType)) {
      this.liquids.set(liquidType, this.liquids.get(liquidType) - amountToRemove);
      // Remove from liquid type if removing results in it being 0 or less
      if (this.liquids.get(liquidType) <= 0) {
        this.liquids.delete(liquidType);
      } 
    }
  }

  getCurrentLevel() {
    var total = 0;
    for (const liquidInfo of this.liquids) {
      total += liquidInfo[1];
    }
    return total;
  }
}