document.getElementById("getWeatherButton").addEventListener("click", function() {
    var cityName = document.getElementById("cityInput").value;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=d26820fd5faa8e979085f14ccd41f788`)
        .then(response => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(data => {
            var lat = data.coord.lat;
            var lon = data.coord.lon;

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
                let dayIndex = i/8 + 1;

                weatherHTML += `
                    <div>
                        <h2>Day ${dayIndex}:</h2>
                        <p>Temperature: ${weather.main.temp} K</p>
                        <p>Weather: ${weather.weather[0].main}</p>
                        <p>Description: ${weather.weather[0].description}</p>
                    </div>
                `;
            }

            document.getElementById("weatherData").innerHTML = weatherHTML;
        })
        .catch(error => {
            console.error('Error:', error);
            alert(error);
        });
});