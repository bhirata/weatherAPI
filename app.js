(function () {
  "use strict";

  var app = require('express')();
  var bodyParser = require('body-parser');
  var request = require("request");

  require('dotenv').config({silent: true});
  app.use(bodyParser.json());

  app.get('/weather', function (req, res) {
    let weatherURL = process.env.WEATHER_URL;
    let appendWeatherURL = "api/weather/v1/geocode";
    let latitude = req.query.latitude || "-23.61";
    let longitude = req.query.longitude || "-46.64";
    let productGroup = "observations.json";

    let language = req.query.language || "en-US";
    let units = req.query.units || "m";
    let languageURL = ["language", language].join("=");
    let unitsURL = ["units", units].join("=");
    let varURL = [languageURL, unitsURL].join("&");

    let finalURL = [weatherURL, appendWeatherURL, latitude, longitude, productGroup].join("/");
    finalURL = [finalURL, varURL].join("?");

    let id = req.query;
    console.log(finalURL);
    console.log(id);

    let options = {
      method: 'GET',
      url: finalURL,
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Accept": "application/json"
      }
    };

    request(options, function (error, response, body) {
      if (error){
        console.log(error);
        throw new Error(error);
      } else {
        body = JSON.parse(body);

        let weatherInfo = {
          temperature : body.observation.temp,
          feels_like : body.observation.feels_like,
          day_ind : body.observation.day_ind,
          wx_phrase : body.observation.wx_phrase
        };

        if (weatherInfo.temperature){
          if (weatherInfo.temperature <= 15) {
            weatherInfo.temperature_phrase = 'muito frio';
          } else if (weatherInfo.temperature <= 20){
            weatherInfo.temperature_phrase = 'frio'
          } else if (weatherInfo.temperature <= 25){
            weatherInfo.temperature_phrase = 'bom'
          } else if (weatherInfo.temperature <= 30){
            weatherInfo.temperature_phrase = 'calor'
          } else {
            weatherInfo.temperature_phrase = 'muito calor'
          }
        }

        res.send(weatherInfo);
      }
    });
  });


  let port = process.env.PORT || '3000';
  app.listen(port, () => {
    console.log("Starting server on port: " + port);
  });

})();