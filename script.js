const clearImg = "./images/clear.png";
const cloudImg = "./images/cloud.png";
const mistImg = "./images/mist.png";
const rainImg = "./images/rain.png";
const snowImg = "./images/snow.png";


const weatherDetailsMap = {
    0:  { description: "Clear sky", image: clearImg },
    1:  { description: "Mainly clear", image: clearImg },
    2:  { description: "Partly cloudy", image: cloudImg },
    3:  { description: "Overcast", image: cloudImg },

    45: { description: "Fog", image: mistImg },
    48: { description: "Depositing rime fog", image: mistImg },

    51: { description: "Light drizzle", image: rainImg },
    53: { description: "Moderate drizzle", image: rainImg },
    55: { description: "Dense drizzle", image: rainImg },

    61: { description: "Slight rain", image: rainImg },
    63: { description: "Moderate rain", image: rainImg },
    65: { description: "Heavy rain", image: rainImg },

    71: { description: "Slight snowfall", image: snowImg },
    73: { description: "Moderate snowfall", image: snowImg },
    75: { description: "Heavy snowfall", image: snowImg },

    80: { description: "Slight rain showers", image: rainImg },
    81: { description: "Moderate rain showers", image: rainImg },
    82: { description: "Violent rain showers", image: rainImg },

    95: { description: "Thunderstorm", image: rainImg },
    96: { description: "Thunderstorm with hail", image: rainImg },
    99: { description: "Thunderstorm with heavy hail", image: rainImg }
};

async function getWeather (city) {
    try {
    const geoResponse = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`
    );

    const geoData = await geoResponse.json();
    if(!geoData) return false;

    const latitude = geoData.results[0].latitude;
    const longitude = geoData.results[0].longitude;

    const url = new URL(
        `https://api.open-meteo.com/v1/forecast`
    );

    url.search = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
        timezone: "auto"
    });

    const weatherResponse = await fetch(url);
    const weatherData = await weatherResponse.json();

    
    return {
        temperature: weatherData.current.apparent_temperature,
        windSpeed: weatherData.current.wind_speed_10m,
        humidity: weatherData.current.relative_humidity_2m,
        weatherCode: weatherData.current.weather_code,
        temperatureUnit: weatherData.current_units.apparent_temperature,
        humidityUnit: weatherData.current_units.relative_humidity_2m,
        windspeedUnit: weatherData.current_units.wind_speed_10m
    };
} catch(error) {
    return false;
}

}


const searchInput = document.querySelector("#search-section");
const searchButton = document.querySelector("#search-btn");
const windSpeed = document.querySelector("#wind-speed");
const humidityPercentage = document.querySelector("#humidity-percentage");
const weatherDetails = document.querySelector(".weather-details");
const temperature = document.querySelector("#temp");
const notFound = document.querySelector(".not-found");
const weatherDesc = document.querySelector(".weather-desc");
const weatherImg = document.querySelector(".weather-img");


searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchButton.click();
    }
});


searchButton.addEventListener("click", async () => {
   if(searchInput.value.length) {
     const weather = await getWeather(searchInput.value);
     if(weather) {
            const info = weatherDetailsMap[weather.weatherCode];
            weatherDetails.style.display = "block";
            notFound.style.display="none";
            weatherDesc.innerHTML = info.description;
            weatherImg.src = info.image;
            windSpeed.innerHTML = `${weather.windSpeed} ${weather.windspeedUnit}`;
            humidityPercentage.innerHTML = `${weather.humidity} ${weather.humidityUnit}`;
            temperature.innerHTML = `${weather.temperature} ${weather.temperatureUnit}`;
      } else {
           notFound.style.display="flex"; 
           weatherDetails.style.display="none";

      }
      

   } else {
     return;
   }

})




