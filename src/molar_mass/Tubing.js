export default class Tubing {
  connectedCylinder = null;

  transferButane(amountToTransfer) {
    if (this.connectedCylinder != null) {
      // TODO: implement transferring butane to cylinder
    }
  }

  connectCylinder(cylinder) {
    if (this.connectedCylinder != null)
      this.connectedCylinder = cylinder;
  }

  removeCylinder() {
    this.connectedCylinder = null;
  }
}