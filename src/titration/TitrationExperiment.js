import Cylinder from "./Cylinder.js";
import Beaker from "./Beaker.js";

export default class TitrationExperiment {
  cylinder10Ml = new Cylinder(10);
  cylinder25Ml = new Cylinder(25);
  cylinder50Ml = new Cylinder(50);  
  beaker = new Beaker();
  wasteBeaker = new Beaker(600);
}

export var titrationExperiment = new TitrationExperiment();
