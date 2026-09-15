module.exports = class Scale {
  objectsOnScale = new Array();

  AddObjectToScale(object) {
    this.objectsOnScale.push(object);
  }   

  RemoveObjectFromScale(object) {
    this.objectsOnScale.splice(this.objectsOnScale.findIndex((element) => element == object), 1);
  }

  GetCurrentWeight() {
    var sum = 0;
    for (const object of this.objectsOnScale) {
      sum += object.GetWeight();
    }
    return sum;
  }
}