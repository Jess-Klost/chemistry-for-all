export default class Thermometer {
  // temperature should be the ambient temperature in celsius by default
  static temperature = 23.3;

  static temperatureKelvin() {
    return this.temperature + 273.15;
  }
}