const MockGpio = require("../MockGpio");

const OFF = 1;
const ON = 0;

const DRY = 1;
const WET = 0;
const piController = {
  // objIO exported to main server

  objIO: {
    pump: OFF,
    lastWater: null, // time door has been in current state

    //constants for LED values
    ON: ON,
    OFF: OFF,
  },
};

// exported functions
piController.setupIO = setupIO;
piController.heartbeat = heartbeat;
piController.ioStatus = ioStatus;

piController.turnOnPump = turnOnPump;
piController.turnOffPump = turnOffPump;

const CURRENT_ENV = process.env.NODE_ENV === "production" ? "production" : "dev";

// for Production it will look at the actuall Pi
// rest will use mockups driven by the ui
// prettier-ignore
function setupIO(){
    console.log(`PI Controller: Setup IO`);
if (CURRENT_ENV === 'production') {
  console.log('ENV Production');
    var onoff = require('onoff');
    const Gpio = onoff.Gpio;
    // piController.objIO.motion = new Gpio(4, 'in');
    // piController.objIO.door = new Gpio(23, 'in');
    piController.objIO.pump =  new Gpio(17, 'out');
    piController.objIO.pump.writeSync(piController.objIO.OFF);

  } else {
    // piController.objIO.motion = new MockGpio(0);
    // piController.objIO.door = new MockGpio(0);
    piController.objIO.pump = new MockGpio(OFF);

  }
  return piController.objIO;
}

let prevState;

function heartbeat() {
  const pumpState = piController.objIO.pump.readSync();
  return pumpState;
}

function ioStatus() {
  let pump = piController.objIO.pump.readSync();

  pump = pump === ON ? "ON" : "OFF";

  return `Pump Status: ${pump}`;
}

function turnOffPump() {
  const pump = piController.objIO.pump;
  pump.writeSync(OFF);
}

function turnOnPump() {
  const pump = piController.objIO.pump;
  pump.writeSync(ON);
}

module.exports = piController;
