const m = require("moment");

class PumpController {
  constructor(objIO) {
    console.log("Initialize State");

    this.lastPumpTime = m();
    this.pump = objIO.pump;
    this.pumpDuration = 10;
    this.ON = objIO.ON;
    this.OFF = objIO.OFF;

    this.turnOff = this.turnOff.bind(this);
    this.turnOn = this.turnOn.bind(this);
    this.getStatus = this.getStatus.bind(this);
  }

  checkPump() {
    const pumpStatus = this.pump.readSync();
    return pumpStatus;
  }

  getPumpTime() {
    const str = this.lastPumpTime.format("hh:mm:ss a");

    return str;
  }

  setPumpDuration(input) {
    const seconds = parseInt(input, 10);
    this.pumpDuration = seconds;
  }

  turnOn(timeout = 1000 * this.pumpDuration) {
    this.pump.writeSync(this.ON);
    this.lastPumpTime = m();
    if (timeout !== 0) {
      setTimeout(this.turnOff, timeout);
    }
  }

  turnOff(timeout = 0) {
    console.log("Turn Pump Off");
    this.pump.writeSync(this.OFF);
  }

  getStatus() {
    const status = this.pump.readSync() === this.ON ? "ON" : "OFF";
    const time = this.lastPumpTime;
    const statusString = `Pump is: ${status}  - last run at: ${time}`;
    return statusString;
  }

  getData() {
    const formatStr = "dddd, MMMM Do YYYY - h:mm:ss a";
    const formatStr2 = "hh:mm:ss a";
    const { lastPumpTime, ON, pumpDuration } = this;
    const pumpStatus = this.pump.readSync();
    const pumpStatusText = pumpStatus === ON ? "ON" : "OFF";

    return {
      currentTime: m().format(formatStr),
      pumpStatus: pumpStatusText,
      pumpDuration,
      lastPumpTime: m(lastPumpTime).format(formatStr2),
    };
  }
}

module.exports = PumpController;
