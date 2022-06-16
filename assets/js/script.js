let key = "e8a1e9cb1e3974ba3324078493ce8325";

let renderCurrentWeather = function (data) {
    console.log(data);
    let curWeatherContainer = document.querySelector(".current-weather-container");

    let temp = document.createElement("h3");
    temp.classList.add("temp-item");
    temp.innerHTML = "Temp: " + data.current.temp + "F";

    let wind = document.createElement("h3");
    wind.classList.add("temp-item");
    wind.innerHTML = "Wind: " + data.current.wind_speed + "MPH";

    let humidity = document.createElement("h3");
    humidity.classList.add("temp-item");
    humidity.innerHTML = "Humidity: " + data.current.humidity + "%";

    let uvIndex = document.createElement("h3");
    uvIndex.classList.add("temp-item");
    uvIndex.innerHTML = "UV Index: " + data.current.uvi;

    curWeatherContainer.appendChild(temp);
    curWeatherContainer.appendChild(wind);
    curWeatherContainer.appendChild(humidity);
}


let getWeatherByCity = function (event) {
    event.preventDefault();
    let cityName = document.querySelector(".search-field").value;
    console.log("city ", cityName);
    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=" + key;
    fetch(url)
        .then(function (response) {
            if (response.ok) {

                response.json().then(function (data) {
                    console.log(data);
                    //annoying
                    let urlCoordinates = "https://api.openweathermap.org/data/2.5/onecall?lat=" + data.coord.lat + "&lon=" + data.coord.lon + "&appid=" + key;

                    fetch(urlCoordinates)
                        .then(function (completeResponse) {
                            if (completeResponse.ok) {
                                completeResponse.json().then(function (completeData) {
                                    renderCurrentWeather(completeData);
                                    console.log(completeData);
                                });
                            } 
                        });
                });

            } else {
                console.log("response not ok");
            }

        })

    var cityInput = document.querySelector(".search-field");
}

let submitBtn = document.querySelector(".btn-submit").addEventListener("click", getWeatherByCity);