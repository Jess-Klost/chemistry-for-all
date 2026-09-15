class Scale {
  objectsOnScale = new Array();
  pageContent = '<h1>Scale</h1><input type="button" id="back" value="Back" onclick="replaceElement(\'body\', oldContent, \'cylinderButton\')" /><p id="weight-reading"></p>';

  AddObjectToScale(object) {
    this.objectsOnScale.push(object);
  }   

  RemoveObjectFromScale(object) {
    this.objectsOnScale.splice(this.objectsOnScale.findIndex((element) => element == object), 1);
  }

  GetCurrentWeight() {
    var sum = 0;
    for (const object of this.objectsOnScale) {
      if (object.GetWeight() >= 0) // ignore objects with negative weight
        sum += object.GetWeight();
    }
    return sum;
  }
}

if (typeof exports !== 'undefined') {
  module.exports = Scale;
}