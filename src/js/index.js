// bug prevents me from doing fetches w/o this
import "regenerator-runtime/runtime";

// import variables
import { keys } from "./keys";
import { DOMSelectors } from "./DOM";

const celciusToF = (C) => C * (9 / 5) + 32;
// simple helper to convert celcius => an obsolete measurement of temperature

async function returnFetch(entry) {
  // universal function to do fetching,

  try {
    // fetch the data from api
    const response = await fetch(entry);
    const data = await response.json();
    // return the data back
    return data;
  } catch (error) {
    // if error, let me know on the console
    console.log(error);
    return 1;
  }
}

async function display(temp, aqi, place) {
  // function for displaying the results
  let entry = `https://pixabay.com/api/?q=${place}&orientation=horizontal&min_width=1920&min_height=1080&editors_choice=1&category=places&key=${keys.pixabay}`;
  let answer = await returnFetch(entry);

  if (answer.hits.length === 0) {
    entry = `https://pixabay.com/api/?id=3625405&key=${keys.pixabay}`;
    answer = await returnFetch(entry);
  }

  const BG = answer.hits[0].largeImageURL;

  console.log(BG);
  console.log(temp, aqi);
}

async function fetchAirQuality(location = "") {
  // used to get AQI and Temp from current location or coordinates
  let entry;
  // choose api entry point according to parameter values
  if (location == undefined) {
    entry = `https://api.airvisual.com/v2/nearest_city?key=${keys.airVisual}`;
  } else {
    entry = `https://api.airvisual.com/v2/nearest_city?lat=${location.lat}&lon=${location.lng}&key=${keys.airVisual}`;
  }
  // get answer from fetching entry and return to `display`
  const answer = await returnFetch(entry);

  // return fahrenheit temperature + air quality index
  const temp = celciusToF(answer.data.current.weather.tp);
  const aqi = answer.data.current.pollution.aqius;
  
  // get location/place name
  const place = answer.data.state;
  
  // display the result
  display(temp, aqi, place);
}

async function fetchLocation(query) {
  // used to get the coords from a search query (airVisual api doesn't have this feature)
  const entry = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${keys.openCage}`;

  // get coords from openCage and return to `fetchAirQuality`
  const answer = await returnFetch(entry);
  const target = answer.results[0];

  // coords of the first result from forward geocoding
  const lat = target.geometry.lat;
  const lng = target.geometry.lng;

  // pass to `fetchAirQuality`
  fetchAirQuality({ lat, lng });
}

function init() {
  // fetchLocation("Illinois");
  // fetchAirQuality();
}
init();
