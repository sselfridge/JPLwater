const express = require("express");
const path = require("path");
const fs = require("fs");
const m = require("moment");
// const config = require("../config/keys");
// const mongooseStart = require("./bin/mongoose");
const pi = require("./controllers/piController");
const PumpController = require("./controllers/pumpController");

// mongooseStart();

const app = express();

// app.use(express.static(path.join(__dirname, "../build")));
app.use(express.static(path.join(__dirname, "..", "public")));

const CURRENT_ENV = process.env.NODE_ENV === "production" ? "production" : "dev";
const piStartTime = m();
const objIO = pi.setupIO();
const Pump = new PumpController(objIO);
let intervalCount = 0;

// if (CURRENT_ENV === "dev") {
const logInterval = setInterval(() => {
  console.log(Pump.getStatus());
  intervalCount++;
}, 1000);
// }

const eventCheck = (CC) => {
  const { doorOpenTime, motionStopTime, motionStartTime } = CC;
  const now = m();

  const idleAlertTimeMin = 45;

  const openDuration = parseInt(m(now - doorOpenTime).minutes());
  const timeSinceMotion = parseInt(m(now - motionStopTime).minutes());

  if (intervalCount % 25 === 0) {
    console.log(`Open Duration: ${openDuration} min - Time Since Motion: ${timeSinceMotion} min`);
  }

  // motion currently going on, no action
  // if (motionStartTime > motionStopTime) return;

  if (timeSinceMotion === 45) {
    let str = `Garage Alert:${now.format("hh:mm A")}\n`;
    str += `Door has been open for ${openDuration}min\n`;
    str += `with no motion for ${timeSinceMotion}min`;
    client.sendMsg(101, str);
  }

  if (now.format("hh:mm") === "23:00") {
    let str = `Garage Alert:${now.format("hh:mm A")}\n`;
    str += `Its ${now.format("hh:mm A")} and the garage door is still open`;
    str += `Door has been open for ${openDuration}min\n`;
    str += `with no motion for ${timeSinceMotion}min`;
    client.sendMsg(11, str);
  }
};

app.post("/sms", (req, res) => {});
// get current door status
app.get("/door", (req, res) => {
  // console.log(`/door`);
  res.json(roomInUse);
});

app.get("/pump/info", (req, res) => {
  const currentStatus = Pump.checkPump();

  const info = {
    pumpTime: Pump.getPumpTime(),
    pumpStatus: Pump.checkPump() === Pump.ON ? "ON" : "OFF",
  };

  res.send(info);
});

app.get("/pump/:state", (req, res) => {
  console.log(`/pump/:state`);
  const state = req.params.state.toLowerCase();
  const newStatus = Pump.checkPump();
  try {
    if (state === "on") {
      Pump.turnOn();
    } else {
      Pump.turnOff();
    }
  } catch (error) {
    console.log("error: ", error);
  }

  res.redirect("/");
});

app.post("/pump/duration/:amount", (req, res) => {
  const amount = req.params.amount;
  Pump.setPumpDuration(amount);
  res.send("Done");
});

app.get("/", function (req, res) {
  console.log("get /");

  try {
    const template = fs.readFileSync("build/index.html", "utf-8");

    let html = makeHtml(template);

    res.send(html);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/unauthorized", (req, res) => {
  res.send("You aren't authorized to access this");
});

// catch all 404 function
app.use(function (req, res) {
  res.status(404).json("Something broke! Check url and try again?");
});

// other catch all, might be better error reporting
app.use(({ errCode, error }, req, res, next) => {
  console.log("Error Code:");
  console.log(errCode);
  console.log(error);
  res.status(errCode).json({ error });
});

const makeHtml = (template) => {
  console.log("Make HTML");
  const data = Pump.getData();
  const timeFormat = "MMMM Do YYYY, h:mm:ss a";
  data.startTime = piStartTime.format(timeFormat);
  data.startTimeFromNow = m(piStartTime).fromNow();
  data.intervalCount = intervalCount;
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const element = data[key];
      const regex = new RegExp("{" + key + "}");
      template = template.replace(regex, element);
    }
  }

  return template;
};

const port = CURRENT_ENV === "production" ? 5000 : 3001;

app.listen(port);
console.log(`Listening on ${port}`);
