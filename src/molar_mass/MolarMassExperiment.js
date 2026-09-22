import Scale from "./Scale.js";
import Lighter from "./Lighter.js";
import Sink from "./Sink.js";
import WaterTrough from "./WaterTrough.js";
import Thermometer from "./Thermometer.js";
import PressureSensor from "./PressureSensor.js";

export class MolarMassExperiment {
  scale = new Scale();
  lighter = new Lighter();
  sink = new Sink();
  trough = new WaterTrough();
  thermometer = new Thermometer();
  pressureSensor = new PressureSensor();
}

export var molarMassExperiment = new MolarMassExperiment();