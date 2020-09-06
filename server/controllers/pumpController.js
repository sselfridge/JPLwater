const m = require("moment");

class PumpController {
  constructor(objIO) {
    console.log("Initialize State");

    this.lastPumpTime = null;

    this.ON = objIO.ON;
    this.OFF = objIO.OFF;
  }

  checkPump(doorStatus) {
    const prevDoorStatus = this.doorStatus;

    if (doorStatus !== prevDoorStatus) {
      if (doorStatus === this.OPEN) {
        console.log("DOOR OPENED");
        this.doorOpenTime = m();
      } else if (doorStatus === this.CLOSED) {
        console.log("DOOR CLOSED");
        this.doorCloseTime = m();

        const start = this.doorOpenTime;
        const end = this.doorCloseTime;
        createEvent("door", "close", start, end);
      } else {
        console.error("Invalid door state");
      }

      this.doorStatus = doorStatus;
    }
  }

  getData() {
    const formatStr = "dddd, MMMM Do YYYY - h:mm:ss a";
    const formatStr2 = "h:mm:ss a";
    const { doorOpenTime, doorCloseTime, motionStopTime, doorStatus, OPEN } = this;
    const motionDuration = m(motionStopTime).fromNow();
    const doorStatusText = doorStatus === OPEN ? "OPEN" : "CLOSED";
    const mostRecentDoorEvent = Math.max(doorCloseTime, doorOpenTime);
    const doorDuration = m(mostRecentDoorEvent).fromNow();

    return {
      currentTime: m().format(formatStr),
      doorStatus: doorStatusText,
      doorDuration,
      motionDuration,
      motionTime: m(motionStopTime).format(formatStr2),
      doorTime: m(mostRecentDoorEvent).format(formatStr2),
      intervalCount,
    };
  }
}

module.exports = PumpController;
