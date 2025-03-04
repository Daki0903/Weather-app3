const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
const locateBtn = document.querySelector('.locate-btn');

searchbox.addEventListener('keypress', (evt) => {
  if (evt.keyCode === 13) {
    getResults(searchbox.value);
  }
});

locateBtn.addEventListener('click', getLocation);

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => weather.json())
    .then(displayResults)
    .catch(error => alert("City not found or invalid input."));
}

function displayResults(weather) {
  if (weather.cod === "404") {
    alert("City not found.");
    return;
  }

  const city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  const date = document.querySelector('.location .date');
  date.innerText = dateBuilder(new Date());

  const temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°C</span>`;

  const weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  const hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°C / ${Math.round(weather.main.temp_max)}°C`;

  getForecast(weather.coord.lat, weather.coord.lon);
}

function dateBuilder(d) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const day = days[d.getDay()];
  const date = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${date} ${month} ${year}`;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetch(`${api.base}weather?lat=${lat}&lon=${lon}&units=metric&APPID=${api.key}`)
        .then(weather => weather.json())
        .then(displayResults);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

function getForecast(lat, lon) {
  fetch(`${api.base}forecast?lat=${lat}&lon=${lon}&units=metric&cnt=7&APPID=${api.key}`)
    .then(response => response.json())
    .then(data => displayForecast(data));
}

function displayForecast(data) {
  const forecast = document.querySelector('.forecast');
  forecast.innerHTML = ''; // Clear previous forecast
  data.list.forEach((day, index) => {
    if (index === 0) return; // Skip the current day
    const forecastDay = document.createElement('div');
    forecastDay.classList.add('day');
    forecastDay.innerHTML = `
      <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
      <p>${Math.round(day.main.temp)}°C</p>
      <p>${day.weather[0].main}</p>
    `;
    forecast.appendChild(forecastDay);
  });
}
