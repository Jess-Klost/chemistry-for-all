const Scale = require('./Scale');
const WeightedObject = require('./WeightedObject');

describe("Scale", () => {
  describe("AddObjectToScale", () => {
    let scale;
    let weightedObjects;

    beforeAll(() => {
      scale = new Scale();
      // Various weighted objects to add
      weightedObjects = [ 
        new WeightedObject(25),
        new WeightedObject(2),
      ];
    });

    test("Should start with no objects on the scale", () => {
      expect(scale.objectsOnScale.length).toStrictEqual(0);
    });

    test("Should add object to the empty array", () => {
      scale.AddObjectToScale(weightedObjects[0]);
      expect(scale.objectsOnScale).toStrictEqual([weightedObjects[0]]);
    });

    test("Should add object to end array if other items are present", () => {
      scale.AddObjectToScale(weightedObjects[1]);
      expect(scale.objectsOnScale).toStrictEqual([weightedObjects[0], weightedObjects[1]]);
    });
  });

  describe("RemoveObjectFromScale", () => {
    let scale;
    let weightedObjects;

    beforeEach(() => {
      scale = new Scale();
      // Various weighted objects to add and remove
      weightedObjects = [ 
        new WeightedObject(25),
        new WeightedObject(2),
        new WeightedObject(1),
        new WeightedObject(5)
      ];

      scale.AddObjectToScale(weightedObjects[0]);
      scale.AddObjectToScale(weightedObjects[1]);
      scale.AddObjectToScale(weightedObjects[2]);
      scale.AddObjectToScale(weightedObjects[3]);
    });

    test("Should remove item from front of the array", () => {
      scale.RemoveObjectFromScale(weightedObjects[0]);
      expect(scale.objectsOnScale).toStrictEqual([weightedObjects[1],
         weightedObjects[2], weightedObjects[3]]);
    });

    test("Should remove item from end of the array", () => {
      scale.RemoveObjectFromScale(weightedObjects[3]);
      expect(scale.objectsOnScale).toStrictEqual([weightedObjects[0], 
          weightedObjects[1], weightedObjects[2]]);
    });

    test("Should remove item from middle of the array", () => {
      scale.RemoveObjectFromScale(weightedObjects[2]);
      expect(scale.objectsOnScale).toStrictEqual([weightedObjects[0],
          weightedObjects[1], weightedObjects[3]]);
    });

    test("Should remove first duplicate from array", () => {
      scale.AddObjectToScale(new WeightedObject(1));
      scale.RemoveObjectFromScale(weightedObjects[2]);
      expect(scale.objectsOnScale).toStrictEqual([weightedObjects[0],
          weightedObjects[1], weightedObjects[3], new WeightedObject(1)]);
    });
  });

  describe("GetCurrentWeight", () => {
    let scale;
    
    beforeEach(() => {
      scale = new Scale();
    });

    test("Scale with no objects should have weight 0", () => {
      expect(scale.GetCurrentWeight()).toBe(0);
    });

    test("Scale with single object of weight 25 should return 25", () => {
      scale.AddObjectToScale(new WeightedObject(25));
      expect(scale.GetCurrentWeight()).toBe(25);
    });

    test("Scale with multiple objects should total the sum of their weights", () => {
      scale.AddObjectToScale(new WeightedObject(25));
      scale.AddObjectToScale(new WeightedObject(1));
      scale.AddObjectToScale(new WeightedObject(50));
      scale.AddObjectToScale(new WeightedObject(1000));
      expect(scale.GetCurrentWeight()).toBe(1076);
    });

    test("Object with 0 weight should not influence weight", () => {
      scale.AddObjectToScale(new WeightedObject(0));
      scale.AddObjectToScale(new WeightedObject(0));
      scale.AddObjectToScale(new WeightedObject(0));
      scale.AddObjectToScale(new WeightedObject(0));
      scale.AddObjectToScale(new WeightedObject(0));
      expect(scale.GetCurrentWeight()).toBe(0);
      scale.AddObjectToScale(new WeightedObject(1));
      expect(scale.GetCurrentWeight()).toBe(1);
    });

    test("Objects with negative weight should not influence weight", () => {
      scale.AddObjectToScale(new WeightedObject(-25));
      scale.AddObjectToScale(new WeightedObject(-1000));
      scale.AddObjectToScale(new WeightedObject(-200));
      scale.AddObjectToScale(new WeightedObject(-2));
      expect(scale.GetCurrentWeight()).toBe(0);
      scale.AddObjectToScale(new WeightedObject(1));
      expect(scale.GetCurrentWeight()).toBe(1);
    });
  });
});