function formatDate(timestamp) {
  var date = new Date(timestamp);
  var hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  var minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  var days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  var day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  var date = new Date(timestamp * 1000);
  var day = date.getDay();
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  var forecast = response.data.daily;

  var forecastElement = document.querySelector("#forecast");

  var forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        />
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max"> ${Math.round(
            forecastDay.temp.max
          )}° </span>
          <span class="weather-forecast-temperature-min"> ${Math.round(
            forecastDay.temp.min
          )}° </span>
        </div>
      </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  var apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  var temperatureElement = document.querySelector("#temperature");
  var cityElement = document.querySelector("#city");
  var descriptionElement = document.querySelector("#description");
  var humidityElement = document.querySelector("#humidity");
  var windElement = document.querySelector("#wind");
  var dateElement = document.querySelector("#date");
  var iconElement = document.querySelector("#icon");

  var celsiusTemperature = response.data.main.temp;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function search(city) {
  var apiKey = "cabdbda40038ba7d1165b953b1c7bd6c";
  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function getSubmit(event) {
  event.preventDefault();
  var cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

var form = document.querySelector("#search-form");
form.addEventListener("submit", getSubmit);

search("Midrand");
