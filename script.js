
const apiKey = "31b56f61b7d415b00f034716d34d681e";
//const url = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=${apiKey}`;

const url = `https://api.openweathermap.org/data/2.5/weather?q=Stockholm,Sweden&units=metric&APPID=31b56f61b7d415b00f034716d34d681e`;
 
let nav = false;

// #F4F7F8 - cloudy

// #A3DEF7 - rainy
// #f7e9b9 - sunny


const city = document.querySelector(".get-your-sunnies-on");
const currentStats = document.querySelector(".todaysForcast");
const nextFiveDays = document.querySelector(".nextFiveDays");
const containerColor = document.getElementById("containerID");
const image = document.querySelector(".weatherImage");
const searchInput = document.getElementById("search-input");


const fetchWeatherData = async(myCity) =>{
    
  let  urlFiveDays = !nav ? `https://api.openweathermap.org/data/2.5/forecast?q=${myCity}&units=metric&APPID=${apiKey}` :
  `https://api.openweathermap.org/data/2.5/forecast?lat=${myCity.lat}&lon=${myCity.lon}&units=metric&appid=${apiKey}`;

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
  let temperature = apiData.list[0].main.temp.toFixed(1);
  let description = apiData.list[0].weather[0].description;
  //displays the weather description temperature and sunrise and sunset time
  currentStats.innerHTML = "";
  currentStats.innerHTML = `
  <div class="text-wrapper">${description} | ${temperature}&deg</div>
  <div class="sunrise-sunset">sunrise ${sunRise}<br />sunset ${sunSet}</div>
  `;

  //changes the background color according to the temperature
  city.innerHTML = "";
  city.innerHTML = `It is ${apiData.list[0].weather[0].description} in ${apiData.city.name} today!`
   if(temperature<=10)
   {
    containerColor.style.background =  "#A3DEF7";
   }else if( temperature > 10 && temperature <=20){
    containerColor.style.background =  "#F4F7F8";
   }else{
    containerColor.style.background =  "#f7e9b9";
   }

   // changes the image according to weather description
   if(description == "clear sky" || description == "sunny") {
      image.src = "./img/sunglasses.png";
   }else if(description == "rain" || description == "showers" || description == "light rain" || description =="moderate rain"){
    image.src = "./img/umbrella.png";
   }else {
    image.src = "./img/cloud.png";
   }

}
// next five days forcast display.
const dailyForcastsDisplay = (dailyForecasts) => {
  nextFiveDays.innerHTML = "";
 
 
  dailyForecasts.forEach((temp, day) => {
   
    nextFiveDays.innerHTML += `
    <div class="day-data">
    <div class="day-label">${day}</div>
    <div class="data-value">${temp.toFixed(1)}&deg</div>
    </div>`;
         
    });
} 

//result of the search city.
const searchCity = () =>{
  nav = false;
  fetchWeatherData(searchInput.value.toLowerCase());
}



const  geoLocationSearch = async() =>{
let myPosition = {};
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
  
      myPosition.lat= position.coords.latitude;
      myPosition.lon=  position.coords.longitude;
      nav = true;
      fetchWeatherData(myPosition);
    } catch (error) {
      console.error("Error getting geolocation: " + error.message);
    }
  }

//calls the function first time. given mycity name.
fetchWeatherData("uppsala" );