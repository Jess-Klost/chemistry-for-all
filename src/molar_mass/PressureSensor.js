export default class PressureSensor {
  // pressure should be the ambient pressure in torr by default
  static pressure = 749.7;

  static pressureATM() {
    return this.pressure * 0.001315789;
  }
}