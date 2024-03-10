const locationInput = document.getElementById("location");
const celsiusButton = document.getElementById("celsius-button");
const fahrenheitButton = document.getElementById("fahrenheit-button");

locationInput.addEventListener("input", handleLocationInput);
locationInput.addEventListener("keyup", handleLocationInputEnter);

celsiusButton.addEventListener("click", handleCelsiusButtonClick);
fahrenheitButton.addEventListener("click", handleFahrenheitButtonClick);

let isCelsius = true;

async function handleLocationInput(event) {
  const width = (event.target.value.length + 2) * 15;
  event.target.style.width = `${width}px`;
}

function handleLocationInputEnter(event) {
  if (event.key === "Enter") {
    currentWeather();
  }
}

function handleCelsiusButtonClick() {
  isCelsius = true;
  currentWeather();
  toggleButtonStyle(celsiusButton, fahrenheitButton);
}

function handleFahrenheitButtonClick() {
  isCelsius = false;
  currentWeather();
  toggleButtonStyle(fahrenheitButton, celsiusButton);
}

async function currentWeather() {
  try {
    const search = locationInput.value.trim();

    if (search === "") {
      throw new Error("Please Enter Location");
    }

    const response = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=c3451ffeb2ae4f15b6761756240803&q=${search}&days=3`,
      { mode: "cors" }
    );
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    updateUI(data);
    document.querySelector(".errMsg").innerHTML = "";
  } catch (error) {
    document.querySelector(".errMsg").innerHTML = error.message;
  }
}

function toggleButtonStyle(activeButton, inactiveButton) {
  activeButton.classList.add("unit-enabled");
  activeButton.classList.remove("toggle-button");
  inactiveButton.classList.remove("unit-enabled");
  inactiveButton.classList.add("toggle-button");
}

async function updateUI(data) {
  const temperature = document.getElementById("temperature");
  const feelsLike = document.getElementById("feels");
  const condition = document.getElementById("condition");
  const wind = document.getElementById("wind");
  const humidity = document.getElementById("humidity");
  const uv = document.getElementById("uv");

  condition.textContent = data.current.condition.text;
  humidity.textContent = "Humidity: " + data.current.humidity + "%";
  uv.textContent = "UV Index: " + data.current.uv;

  const secondDate = document.querySelector(".secondDate");
  const thirdDate = document.querySelector(".thirdDate");

  secondDate.textContent = getDayName(data.forecast.forecastday[1].date);
  thirdDate.textContent = getDayName(data.forecast.forecastday[2].date);

  const temperatureUnit = isCelsius ? "°C" : "°F";
  const windSpeedUnit = isCelsius ? " kph" : " mph";

  temperature.textContent = `${getTemperature(
    data.current.temp_c,
    data.current.temp_f
  )}${temperatureUnit}`;
  feelsLike.textContent = `feels like: ${getTemperature(
    data.current.feelslike_c,
    data.current.feelslike_f
  )}${temperatureUnit}`;
  wind.textContent = `Wind: ${getWindSpeed(
    data.current.wind_kph,
    data.current.wind_mph
  )}${windSpeedUnit}`;

  // Update weather icons
  const currentWeatherIcon = document.querySelector(".iconContainer .icon");
  currentWeatherIcon.innerHTML = ""; // Clear previous icon
  const currentWeatherIconImg = document.createElement("img");
  currentWeatherIconImg.src = data.current.condition.icon;
  currentWeatherIcon.appendChild(currentWeatherIconImg);

  const secondWeatherIcon = document.querySelector(".secondWeatherIcon");
  secondWeatherIcon.innerHTML = ""; // Clear previous icon
  const secondWeatherIconImg = document.createElement("img");
  secondWeatherIconImg.src = data.forecast.forecastday[1].day.condition.icon;
  secondWeatherIcon.appendChild(secondWeatherIconImg);

  const thirdWeatherIcon = document.querySelector(".thirdWeatherIcon");
  thirdWeatherIcon.innerHTML = ""; // Clear previous icon
  const thirdWeatherIconImg = document.createElement("img");
  thirdWeatherIconImg.src = data.forecast.forecastday[2].day.condition.icon;
  thirdWeatherIcon.appendChild(thirdWeatherIconImg);

  const secondTemp = document.getElementById("secondTemp");
  const thirdTemp = document.getElementById("thirdTemp");

  secondTemp.textContent = `${getTemperature(
    data.forecast.forecastday[1].day.avgtemp_c,
    data.forecast.forecastday[1].day.avgtemp_f
  )}${temperatureUnit}`;
  thirdTemp.textContent = `${getTemperature(
    data.forecast.forecastday[2].day.avgtemp_c,
    data.forecast.forecastday[2].day.avgtemp_f
  )}${temperatureUnit}`;
}

function getTemperature(celsius, fahrenheit) {
  return isCelsius ? celsius : fahrenheit;
}

function getWindSpeed(kph, mph) {
  return isCelsius ? kph : mph;
}

function getDayName(dateString) {
  const date = new Date(dateString);
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[date.getDay()];
}
