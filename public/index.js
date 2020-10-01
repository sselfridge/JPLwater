// const axios = require("axios");

const TIME_FORMAT = "MMMM Do YYYY, h:mm:ss a";
const TIME_FORMAT_DAY = "dddd MMMM Do YYYY, h:mm:ss a";

const getCurrentTime = () => {
  return moment().format(TIME_FORMAT_DAY);
};

const interval = setInterval(() => {
  const currentTime = getCurrentTime();
  console.log("currentTime: ", currentTime);
  const currentTimeElement = document.getElementById("currentTime");
  currentTimeElement.innerText = currentTime;

  axios
    .get("/pump/info")
    .then(({ data }) => {
      const { pumpStatus, pumpTime } = data;

      const pumpStatusElm = document.getElementById("pumpStatus");
      pumpStatusElm.innerText = pumpStatus;

      const pumpTimeElm = document.getElementById("lastPumpTime");
      pumpTimeElm.innerText = pumpTime;
    })
    .catch((error) => {
      console.log(error);
    });
}, 1000);

const setPumpDuration = () => {
  const value = document.getElementById("timeInput");

  axios
    .post(`/pump/duration/${value.value}`)
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .then(function () {
      // always executed
    });

  location.reload("/");
};
