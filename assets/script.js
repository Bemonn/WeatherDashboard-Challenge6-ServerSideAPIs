document.getElementById("getWeatherButton").addEventListener("click", getWeatherData);

//Search function for city name and alert for empty field
function getWeatherData() {
    var cityName = document.getElementById("cityInput").value;
    if(!cityName) {
        alert("Please enter a city name.");
        return;
    }

    //Fetching coordinates of the city
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=d26820fd5faa8e979085f14ccd41f788`)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            //Saves to recent searches
            var recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
            if (!recentSearches.includes(cityName)) {
                recentSearches.push(cityName);
                localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
            }

            //Updates the recent searches display
            updateRecentSearches();

            var lat = data.coord.lat;
            var lon = data.coord.lon;

            //Fetching 5 day weather forecast
            return fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=d26820fd5faa8e979085f14ccd41f788`);
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error getting weather data");
            }
            return response.json();
        })
        .then(data => {
            var weatherHTML = "";

            for(let i = 0; i < 40; i+=8) {
                let weather = data.list[i];
                let date = new Date(weather.dt_txt);
                let iconURL = `http://openweathermap.org/img/w/${weather.weather[0].icon}.png`;

                //Weather info div and emojis
                weatherHTML += `
                    <div>
                    <h2>${cityName} - ${date.toDateString()}</h2>
                    <img src="${iconURL}" alt="Weather icon">
                    <p>🌡️ Temperature: ${weather.main.temp} K</p>
                    <p>Weather: ${weather.weather[0].main}</p>
                    <p>Description: ${weather.weather[0].description}</p>
                    <p>💧 Humidity: ${weather.main.humidity} %</p>
                    <p>💨 Wind Speed: ${weather.wind.speed} m/s</p>
                    </div>
                `;
            }

            document.getElementById("weatherData").innerHTML = weatherHTML;
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error);
        });
}
//Local storage and recent searches
function updateRecentSearches() {
    var recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];
    //creates list for recent searches
    var searchList = document.getElementById("searchList");
    searchList.innerHTML = recentSearches.map(city => `<li>${city}</li>`).join("");

    //Click event for recent searches
    Array.from(searchList.getElementsByTagName("li")).forEach(li => {
        li.addEventListener("click", function(event) {
            document.getElementById("cityInput").value = event.target.innerText;
            getWeatherData();
        });
    });
}

//Load recent searches from localStorage on page load
updateRecentSearches();