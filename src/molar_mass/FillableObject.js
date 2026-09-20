class FillableObject {
  currentLevel = 0;
  capacity;

  isFull() {
    return this.currentLevel == this.capacity;
  }

  fillCompletely() {
    this.currentLevel = this.capacity;
  }

  emptyCompletely() {
    this.currentLevel = 0;
  }

  addLiquid(amountToAdd) {
    // Clamp amount, so that amount never falls goes below 0 or above capacity
    this.currentLevel += Math.max(0, Math.min(amountToAdd, this.capacity));
  }
}