const setWeather = (city, min, max) => {
  document.getElementById("weather").textContent = "Estão entre " +
    min.toString() + " °C e " + max.toString() + " °C em " + city.toString();
};
const setWeatherFortaleza = () => {
  document.getElementById("weather").textContent =
    "Não sei, deve estar um calor desgraçado";
};

const populateCities = (options) => {
  const selectElement = document.getElementById("cities");
  selectElement.innerHTML = "";
  options.forEach((option) => {
    const optionElement = document.createElement("option");
    optionElement.value = option;
    optionElement.textContent = option;
    selectElement.appendChild(optionElement);
  });

  selectElement.addEventListener("change", function () {
    fetchWeather(this.value);
  });
};

var citiesMap;

const fetchCities = async () => {
  const API_URL = "https://api.ipma.pt/open-data/distrits-islands.json";
  const response = await fetch(API_URL).then((r) => r.json());
  citiesMap = Object.fromEntries(
    response["data"].map((c) => [c["local"], c["globalIdLocal"]]),
  );
  populateCities([...Object.keys(citiesMap), "Fortaleza"]);
};

const fetchWeather = async (city) => {
  if (city === "Fortaleza") {
    setWeatherFortaleza();
    return;
  }
  const url =
    "https://api.ipma.pt/open-data/forecast/meteorology/cities/daily/" +
    citiesMap[city].toString() + ".json";
  const response = await fetch(url).then((r) => r.json());
  const weather = response["data"][0];
  setWeather(city, weather["tMin"], weather["tMax"]);
};

const main = async () => {
  await fetchCities();
  await fetchWeather("Aveiro");
};

main();
