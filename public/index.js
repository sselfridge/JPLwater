// const axios = require("axios");

const getCurrentTime = () => {
  return moment().format("dddd, MMMM Do YYYY - h:mm:ss a");
};

const interval = setInterval(() => {
  const currentTime = getCurrentTime();
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
