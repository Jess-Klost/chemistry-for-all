export default class ButterflyClamp {
  connectedBuret = null;

  connectBuret(buret) {
    if (this.connectedBuret == null)
      this.connectedBuret = buret;
  }

  removeBuret() {
    this.connectedBuret = null;
  }

  hasBuret() {
    return this.connectedBuret != null;
  }
}