
const apiKey = "31b56f61b7d415b00f034716d34d681e";
//const url = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=${apiKey}`;

const url = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=31b56f61b7d415b00f034716d34d681e`;

const urlFiveDays = "https://api.openweathermap.org/data/2.5/forecast?q=Stockholm,Sweden&units=metric&APPID=31b56f61b7d415b00f034716d34d681e"



const city = document.querySelector(".get-your-sunnies-on");
const currentStats = document.querySelector(".overlap");
const days = document.querySelector(".days");
const degrees = document.querySelector(".degrees");
 
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
            const options = { weekday: 'short' };
            const day = date.toLocaleDateString('en-US', options);
            dailyForecasts.set(day,  forecast.main.temp);
          }
        });
       dailyForcastsDisplay(dailyForecasts);
        
    } catch (error) {
        console.log(error);
        
    }
}


const todaysWeatherDisplay = (apiData) =>{
  let sunRise = new Date(apiData.city.sunrise * 1000).toLocaleTimeString();
  let sunSet = new Date(apiData.city.sunset * 1000).toLocaleTimeString()
  currentStats.innerHTML = "";
  currentStats.innerHTML = `
  <div class="text-wrapper">${apiData.list[0].weather[0].description} | ${apiData.list[0].main.temp.toFixed(1)}&deg</div>
  <div class="sunrise-sunset">sunrise ${sunRise}<br />sunset ${sunSet}</div>
  `;
  city.innerHTML = "";
  city.innerHTML = `Get your sunnies on. ${apiData.city.name} is looking rather great today!!!`

}

const dailyForcastsDisplay = (dailyForecasts) => {
  days.innerHTML = "";
  degrees.innerHTML = "";
 
  dailyForecasts.forEach((temp, day) => {
    console.log(temp.toFixed(1));
    days.innerHTML += `${day} <br />`;
    degrees.innerHTML += `${temp.toFixed(1)}&deg<br />`;
         
    });
} 


fetchWeatherData();