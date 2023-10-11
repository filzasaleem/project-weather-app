
const apiKey = "31b56f61b7d415b00f034716d34d681e";
//const url = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=${apiKey}`;

const url = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=31b56f61b7d415b00f034716d34d681e`;

const urlFiveDays = "https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=31b56f61b7d415b00f034716d34d681e"


const nextFiveDays = document.querySelector(".next-5-days");
const currentStats = document.querySelector(".current-stats");
const currentTemp = document.querySelector(".current-temperature__content-container");
const image = document.querySelector(".current-temperature__icon");
const locationDate = document.querySelector(".location-and-date");
 
const fetchWeatherData = async() =>{
    try {
        const response = await fetch(urlFiveDays);
        const data = await response.json();
        console.log(data);
        todaysWeatherDisplay(data);
        const forecastList = data.list;
        
        // Create a map to store forecasts at 12:00 each day
        const dailyForecasts = new Map();
    
        // Iterate through the forecasts and filter for 12:00 each day
        forecastList.forEach(forecast => {
          const date = new Date(forecast.dt * 1000); // Convert timestamp to Date
          if (date.getUTCHours() === 12) {
            // const day = date.toDateString();
            const options = { weekday: 'short',  month: 'short', day: 'numeric' };
            const day = date.toLocaleDateString('en-US', options);
            dailyForecasts.set(day, { 'min-temp': forecast.main.temp_min, 'max-temp': forecast.main.temp_max });
          }
        });
       dailyForcastsDisplay(dailyForecasts);
        
    } catch (error) {
        console.log(error);
        
    }
}

// function for displaying the weather and discription of the  current day

const todaysWeatherDisplay = (apiData) =>{

// some variables required for conversion or storing data.
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  let sunRise = new Date(apiData.city.sunrise * 1000).toLocaleTimeString();
  let sunSet = new Date(apiData.city.sunset * 1000).toLocaleTimeString();
  let todaysDate = new Date(apiData.list[0].dt * 1000).toLocaleDateString('en-US', options);
  let weatherDescription = apiData.list[0].weather[0].description;

//the if statements will load the image according to the weather description
  if(weatherDescription == "rain" || weatherDescription == "heavy rain" || weatherDescription == "rainy" ||weatherDescription == " slightly rain"){
    image.src = "icons/rain.svg";
  }else if(weatherDescription == "cloudy")
  {
    image.src = "icons/mostly-sunny.svg";
  }else if(weatherDescription == "clear" || weatherDescription == "clear sky" || weatherDescription == "sunny"){
    image.src = "icons/sunny.svg";
  }

  // it will display the city name and the date
  locationDate.innerHTML = "";
  locationDate.innerHTML = `
  <h1 class="location-and-date__location">${apiData.city.name}, ${apiData.city.country}</h1>
  <div>${todaysDate}</div>
  `;
  //this section of code displays the temperature to one decimal point
  currentTemp.innerHTML = "";
  currentTemp.innerHTML = `
  <div class="current-temperature__value">${apiData.list[0].main.temp.toFixed(1)}&deg;</div>
  <div class="current-temperature__summary">${apiData.list[0].weather[0].description}</div>`;

  //this section of code displays some additional information of the current day. forexample wind humidity min amd max temp
   currentStats.innerHTML = "";
   currentStats.innerHTML = ` 
   <div>
   <div class="current-stats__value">${apiData.list[0].main.temp_max.toFixed(1)}&deg;</div>
   <div class="current-stats__label">High</div>
   <div class="current-stats__value">${apiData.list[0].main.temp_min.toFixed(1)}&deg;</div>
   <div class="current-stats__label">Low</div>
  </div>
  <div>
  <div class="current-stats__value">${apiData.list[0].wind.speed}mph</div>
  <div class="current-stats__label">Wind</div>
  <div class="current-stats__value">${apiData.list[0].main.humidity}</div>
  <div class="current-stats__label">Humidity</div>
  </div>
  <div>
    <div>
    <div class="current-stats__value">${sunRise}</div>
    <div class="current-stats__label">Sunrise</div>
    <div class="current-stats__value">${sunSet}</div>
    <div class="current-stats__label">Sunset</div>
  </div>`;         

}
// this function displays the weather forcast for next 5 days
const dailyForcastsDisplay = (dailyForecasts) => {
    nextFiveDays.innerHTML = "";
    nextFiveDays.innerHTML = ' <h2 class="next-5-days__heading">Next 5 days</h2>  <div class="next-5-days__container">';

    dailyForecasts.forEach((temp, day) => {
      nextFiveDays.innerHTML += 
      `<div class="next-5-days__row">
          <div class="next5">${day}</div>
          <div class="next5">Low
             <div class="next5-days">${temp['min-temp'].toFixed(1)}</div> 
          </div>
          <div class="next5">high
              <div class="next5-days">${temp['max-temp'].toFixed(1)}</div> 
          </div>
        </div>`;
    });
}


// call to the function for fetching api
fetchWeatherData();