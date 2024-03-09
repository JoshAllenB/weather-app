const locationSearch = document.getElementById("location");
locationSearch.addEventListener("input", function () {
  const width = (this.value.length + 2) * 15;

  this.style.width = `${width}px`;
});
locationSearch.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    currentWeather();
  }
});

let isCelsius = true;

const celsiusButton = document.getElementById("celsius-button");
const fahrenheitButton = document.getElementById("fahrenheit-button");

celsiusButton.addEventListener("click", function () {
  isCelsius = true; // Set isCelsius to true
  currentWeather(); // Update weather data with new temperature unit
  toggleButton(celsiusButton, fahrenheitButton);
});

fahrenheitButton.addEventListener("click", function () {
  isCelsius = false; // Set isCelsius to false
  currentWeather(); // Update weather data with new temperature unit
  toggleButton(fahrenheitButton, celsiusButton);
});

function toggleButton(activeButton, inactiveButton) {
  activeButton.classList.add("unit-enabled");
  activeButton.classList.remove("toggle-button");
  inactiveButton.classList.remove("unit-enabled");
  inactiveButton.classList.add("toggle-button");
}

async function currentWeather() {
  try {
    const search = document.getElementById("location").value.trim();

    if (search === "") {
      throw new Error("Please Enter Location");
    }

    const url = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=c3451ffeb2ae4f15b6761756240803&q=${search}`,
      { mode: "cors" }
    );

    const data = await url.json();
    console.log(data);

    if (data.error) {
      throw new Error(data.error.message);
    }

    updateUI(data);

    document.querySelector(".errMsg").innerHTML = "";
  } catch (error) {
    document.querySelector(".errMsg").innerHTML = error.message;
  }
}

function updateUI(data) {
  const weatherIcon = document.getElementById("weatherIcon");
  const temperature = document.getElementById("temperature");
  const feelsLike = document.getElementById("feels");
  const cloud = document.getElementById("cloud");

  weatherIcon.src = data.current.condition.icon;

  cloudData = data.current.condition.text;
  cloud.textContent = cloudData;
  console.log(cloudData);

  if (isCelsius) {
    temperature.textContent = data.current.temp_c + "°C";
    feelsLike.textContent = "feels like: " + data.current.feelslike_c + "°C";
  } else {
    temperature.textContent = data.current.temp_f + "°F";
    feelsLike.textContent = "feels like: " + data.current.feelslike_f + "°F";
  }
}
