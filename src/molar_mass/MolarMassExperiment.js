import Scale from "./Scale.js";
import Lighter from "./Lighter.js";
import Sink from "./Sink.js";
import WaterTrough from "./WaterTrough.js";

export class MolarMassExperiment {
  scale = new Scale();
  lighter = new Lighter();
  sink = new Sink();
  trough = new WaterTrough();
}

export var molarMassExperiment = new MolarMassExperiment();