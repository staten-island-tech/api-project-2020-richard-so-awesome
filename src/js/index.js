// bug prevents me from doing fetches w/o this
import "regenerator-runtime/runtime";

console.log("ready");

async function init() {
  const response = await fetch(
    "https://api.airvisual.com/v2/nearest_city?key=0c60cc53-6027-48af-bc70-23c69ac5ad73"
  );
  const answer = await response.json();
  console.log(answer);
}
init();
