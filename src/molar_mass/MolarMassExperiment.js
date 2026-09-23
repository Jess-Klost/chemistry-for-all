import Scale from "./Scale.js";
import Lighter from "./Lighter.js";
import Sink from "./Sink.js";
import WaterTrough from "./WaterTrough.js";
import Thermometer from "./Thermometer.js";
import Tubing from "./Tubing.js"

export class MolarMassExperiment {
  scale = new Scale();
  lighter = new Lighter();  
  sink = new Sink();
  trough = new WaterTrough();
  thermometer = new Thermometer();
  tubing = new Tubing();
}

export var molarMassExperiment = new MolarMassExperiment();