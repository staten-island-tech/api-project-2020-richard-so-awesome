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

async function display(temp, aqi, placeQuery) {
  // function for displaying the results
  console.log(placeQuery);
  const entry = `https://pixabay.com/api/?q=${placeQuery}&category=places&key=${keys.pixabay}`;
  const answer = await returnFetch(entry);
  console.log(answer);

  const BG = answer.hits[0].largeImageURL;

  console.log(BG);
  console.log(temp, aqi);
}

function fetchBG(query) {
}

async function fetchAirQuality(lat = "", long = "") {
  // used to get AQI and Temp from current location or coordinates

  let entry;
  // choose api entry point according to parameter values
  if (lat === undefined || long === undefined) {
    entry = `https://api.airvisual.com/v2/nearest_city?key=${keys.airVisual}`;
  } else {
    entry = `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${long}&key=${keys.airVisual}`;
  }
  // get answer from fetching entry and return to `display`
  const answer = await returnFetch(entry);
  console.log(answer);

  // return fahrenheit temperature + air quality index
  const temp = celciusToF(answer.data.current.weather.tp);
  const aqi = answer.data.current.pollution.aqius;
  const placeQuery = `${answer.data.city}`
  // display the result
  display(temp, aqi, placeQuery);
}

async function fetchLocation(query) {
  // used to get the coords from a search query (airVisual api doesn't have this feature)

  const entry = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${keys.openCage}`;

  // get coords from openCage and return to `fetchAirQuality`
  const answer = await returnFetch(entry);

  // return coords of the first result from forward geocoding
  const geometry = answer.results[0].geometry;

  // pass to `fetchAirQuality`
  fetchAirQuality(geometry.lat, geometry.lng);
}

function init() {
  fetchLocation("Seattle");
  // fetchAirQuality();
}
init();
