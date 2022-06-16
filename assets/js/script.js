let key = "e3b626265786d8657b913a312e465ce1";

let renderCurrentWeather = function (data, city) {
    console.log(data);
    var date = new Date();
    //clear container
    let curWeatherContainer = document.querySelector(".current-weather-container");

    while (curWeatherContainer.firstChild) {
        curWeatherContainer.removeChild(curWeatherContainer.firstChild);
    }

    let cityTitle = document.createElement("h1");
    cityTitle.classList.add("city-name");
    cityTitle.innerHTML = city + " " + date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
    curWeatherContainer.appendChild(cityTitle);

    let temp = document.createElement("h3");
    temp.classList.add("temp-item");
    temp.innerHTML = "Temp: " + data.current.temp + "K";

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
    curWeatherContainer.appendChild(uvIndex);
}

let renderForcaster = function (data) {
    let forecastList = [];
    let date = new Date();

    // retrieve the data
    for (let i = 0; i < 5; i++) {
        let dailyForcast = {
            temp: data.daily[i].temp.day + "K",
            wind: data.daily[i].wind_speed + "MPH",
            humidity: data.daily[i].humidity + "%"
        }

        forecastList[i] = dailyForcast;
    }

    let forecastContainer = document.querySelector(".forecast-container");

    while (forecastContainer.firstChild) {
        forecastContainer.removeChild(forecastContainer.firstChild);
    }
    let forecastTitle = document.createElement("h2");
    forecastTitle.classList.add("forecast-title");
    forecastTitle.innerHTML = "5 Day Forecast: ";
    forecastContainer.appendChild(forecastTitle);

    // create elements and append to page
    for (let i = 0; i < 5; i++) {
        let dailyInfoContainer = document.createElement("div");
        dailyInfoContainer.classList.add("daily-info-container");

        let dateview = document.createElement("h5");
        dateview.classList.add("daily-info");
        dateview.innerHTML = date.getFullYear() + "/" + date.getMonth() + "/" + (date.getDate() + (i + 1));

        let temp = document.createElement("h5");
        temp.classList.add("daily-info");
        temp.innerHTML = forecastList[i].temp;

        let wind = document.createElement("h5");
        wind.classList.add("daily-info");
        wind.innerHTML = forecastList[i].wind;

        let humidity = document.createElement("h5");
        humidity.classList.add("daily-info");
        humidity.innerHTML = forecastList[i].humidity;

        dailyInfoContainer.appendChild(dateview);
        dailyInfoContainer.appendChild(temp);
        dailyInfoContainer.appendChild(wind);
        dailyInfoContainer.appendChild(humidity);

        forecastContainer.appendChild(dailyInfoContainer);
    }


}

let clickHistory = function (cityName) {
    //set textfield to innerhtml value
    let inputField = document.querySelector(".search-field");
    inputField.value = cityName;
}

let renderHistory = function (searchHistory) {
    let historyContainer = document.querySelector(".search-history");
    console.log("History: ", searchHistory);
    for (let i = 0; i < searchHistory.length; i++) {
        let historyButton = document.createElement("button");
        historyButton.classList.add("hist-button");
        //set field to current button value
        historyButton.addEventListener("click", clickHistory(searchHistory[i]));
        historyButton.innerHTML = searchHistory[i];
        historyContainer.appendChild(historyButton);
    }
}

let appendToHistory = function (city) {
    let searchHistory = [];

    //retrieve local storage
    if (JSON.parse(localStorage.getItem("searchHistory"))) {
        searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    }

    console.log(searchHistory);

    searchHistory[searchHistory.length] = city;
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    renderHistory(JSON.parse(localStorage.getItem("searchHistory")));
}

let getWeatherByCity = function (event) {
    if (event) {
        event.preventDefault();
    }

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
                                    renderCurrentWeather(completeData, cityName);
                                    renderForcaster(completeData);
                                    //search history
                                    appendToHistory(cityName);
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

renderHistory(JSON.parse(localStorage.getItem("searchHistory")));
let submitBtn = document.querySelector(".btn-submit").addEventListener("click", getWeatherByCity);