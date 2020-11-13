// bug prevents me from doing fetches w/o this
import "regenerator-runtime/runtime";
import { keys } from "./keys";
import { DOMSelectors } from "./DOM";

console.log("ready");

const celciusToF = (C) => C * (9 / 5) + 32;

async function returnFetch(entry, transform, endpt) {
  // universal function to do fetching,
  // transform, and give it to somewhere
  try {
    const response = await fetch(entry);
    const data = await response.json();

    const transformed = transform(data);

    endpt(...transformed);
  } catch (error) {
    console.log(error);
    return 1;
  }
}

function display(temp, aqi) {
  console.log(temp, aqi);
}

function fetchAirQuality(lat = "", long = "") {
  let entry;
  // choose api entry point according to parameter values
  if (lat === undefined || long === undefined) {
    entry = `https://api.airvisual.com/v2/nearest_city?key=${keys.airVisual}`;
  } else {
    entry = `https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${long}&key=${keys.airVisual}`;
  }
  // get answer from fetching entry
  returnFetch(
    entry,
    (answer) => {
      // get temperature + air quality index
      const temp = celciusToF(answer.data.current.weather.tp);
      const aqi = answer.data.current.pollution.aqius;
      return [temp, aqi];
    },
    // display the result
    display
  );
}

async function fetchLocation(query) {
  const entry = `https://api.opencagedata.com/geocode/v1/json?q=${query}&key=${keys.openCage}`;
  
  // get answer from fetching entry
  returnFetch(
    entry,
    // get coords of the first result from forward geocoding
    (answer) => {
      const geometry = answer.results[0].geometry;
      return [geometry.lat, geometry.lng];
    },
    // pass to `fetchAirQuality`
    fetchAirQuality
  );
}

function init() {
  fetchLocation("Los Angles");
}
init();
