const timeEl = document.querySelector(".time");
const dateEl = document.querySelector(".date");
const currentWeatherItem = document.querySelector(".others");
const country = document.querySelector(".country");
const timeZone = document.querySelector(".time-zone");
const weatherForecast = document.querySelector(".weather-forecast");
const currentTempEl = document.querySelector(".today");

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const mounts = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Des",
];

setInterval(() => {
  const time = new Date();
  const mount = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const time12HrFormat = hour >= 13 ? hour % 12 : hour;
  const zero = time12HrFormat < 10 ? "0" + time12HrFormat : time12HrFormat;
  const minute = time.getMinutes();
  const zeroM = minute < 10 ? "0" + minute : minute;
  const ampm = hour >= 12 ? "PM" : "AM";

  timeEl.innerHTML =
    zero + ":" + zeroM + " " + `<span class="am-pm">${ampm}</span>`;

  dateEl.innerHTML = days[day] + ", " + date + " " + mounts[mount];
}, 1000);

const api_key = "6acdf7b2ef77cc81d906539a40e4238c";
function getWeatherData() {
  navigator.geolocation.getCurrentPosition((respone) => {
    let { latitude, longitude } = respone.coords;
    console.log(respone);

    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${api_key}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        shoeWeatherData(data);
        console.log(data);
      });
  });
}

getWeatherData();

function shoeWeatherData(data) {
  console.log(data);
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current;

  timeZone.innerHTML = data.lat + 'N'+ ' , ' + data.lon + 'E';

  currentWeatherItem.innerHTML = `
    <div class="weather-item">
    <p>Pressure</p>
    <p>${pressure}</p>
</div>
<div class="weather-item">
    <p>Humidity</p>
    <p>${humidity}%</p>
</div>
<div class="weather-item">
    <p>Wind Speed</p>
    <p>${wind_speed}</p>
</div>
<div class="weather-item">
    <p>Sunrise</p>
    <p>${window.moment(sunrise * 1000).format("HH:mm a")}</p>
</div>
<div class="weather-item">
    <p>Sunset</p>
    <p>${window.moment(sunset * 1000).format("HH:mm a")}</p>
</div>`;

  country.textContent = `${data.timezone}`;

  let otherDayForecast = "";

  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
            
            <img src="http://openweathermap.org/img/wn/${
                day.weather[0].icon
              }@2x.png"
            alt="" class="w-icon">
        <div class="status">
            <p class="day">${window.moment(day.dt * 1000).format("ddd")}</p>
            <p class="temp">Night - ${day.temp.night} &#176; C</p>
            <p class="temp">Day -  ${day.temp.day}  &#176; C</p>
        </div>

            `;
    } else {
      otherDayForecast += `
            <div class="weather-forecast-item">
            <p class="day">${window.moment(day.dt * 1000).format("ddd")}</p>
            <img src="http://openweathermap.org/img/wn/${
              day.weather[0].icon
            }@2x.png"
                alt="" class="w-icon">
            <p class="temp">Night - ${day.temp.night}&#176; C</p>
            <p class="temp">Day - ${day.temp.day} &#176; C</p>
        </div>
            `;
    }
  });

  weatherForecast.innerHTML = otherDayForecast;
}
