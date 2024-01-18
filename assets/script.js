/*GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, and the wind speed
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
*/

var APIkey = "7d52d6952b84f7e1c8daa38649e55c8d";

var searchBttn = $('#search-bttn');
var userInput = $('#input');

var locationDisplay = $('#location');
var iconDisplay = $('#icon');
var tempDisplay = $('#temp');
var windDisplay = $('#wind');
var humidityDisplay = $('#humidity');

var cardEl = $('.cards');
var listEl = $('#savedLocation');
var weatherEl = $('#weather-content');

displaydeFaultList();

// get all forcecast data
function getLocation() {
    console.log(this.id);
    if (this.id == 'search-bttn') {
        var location = userInput.val();
        if (location) { // is there a value?
            getGeoLocation(location);
        } else {
            // alert to ask user to enter location
            alert('Please enter location');
        }
    } else {
        getGeoLocationSearch(this.id);
    }
}

// method to get latitude & longitude
var getGeoLocation = function (location) {
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + location + '&appid=7d52d6952b84f7e1c8daa38649e55c8d';

    // steps to fetch Geocode API
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    //   destructing data in index 0 - lat & lon
                    var { lat, lon } = data[0];
                    // adding '' turns it into strings
                    getCurrentDayForecast(lat, lon);
                    get5dayForecast(lat, lon);
                    var defaultList = JSON.parse(localStorage.getItem('location')) || [];
                    defaultList.push(location);
                    localStorage.setItem('location', JSON.stringify(defaultList));
                    displaydeFaultList();
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect');
        });
};

// method to get latitude & longitude
var getGeoLocationSearch = function (location) {
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + location + '&appid=7d52d6952b84f7e1c8daa38649e55c8d';

    // steps to fetch Geocode API
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    //   destructing data in index 0 - lat & lon
                    var { lat, lon } = data[0];
                    // adding '' turns it into strings
                    getCurrentDayForecast(lat, lon);
                    get5dayForecast(lat, lon);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect');
        });
};

function displaydeFaultList() {
    listEl.empty();
    var listDisplay = JSON.parse(localStorage.getItem('location')) || [];

    listDisplay.forEach(function (item) {
        listEl.append('<button class="listBtn" id="' + item + '">' + item + '</button>');
    });
}

var getCurrentDayForecast = function (latitude, longitude) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' +
        longitude + '&appid=7d52d6952b84f7e1c8daa38649e55c8d&units=imperial';

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    const date = new Date(data.dt * 1000);
                    const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                    var { temp, humidity } = data.main;
                    //display of each properties's values 
                    locationDisplay.text(data.name + ' ' + formattedDate);
                    // this is getting the icon from openweatherapi
                    iconDisplay.attr("src","http://openweathermap.org/img/w/"+ data.weather[0].icon+".png");
                    tempDisplay.text('Temp: ' + temp + ' °F');
                    windDisplay.text('Wind: ' + data.wind.speed + ' MPH');
                    humidityDisplay.text('Humidity: ' + humidity + '%');
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect');
        });
};

var get5dayForecast = function (latitude, longitude) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' +
        longitude + '&appid=7d52d6952b84f7e1c8daa38649e55c8d&units=imperial';

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    //get list dt
                    //convert so we can get the date
                    //filter by that date
                    // var reducedList = data.list.filter((item, i, self) =>
                    //     self.findIndex(d => {
                    //         var dDate = new Date(d.dt);
                    //         var itemDate = new Date(item.dt);
                    //         dDate.getDate() === itemDate.getDate()
                    //     }) === i
                    // );
                    var list = data.list;

                    var uniqueDates = [];
                    for (var i = 0; i < list.length; i++) {
                        if (!isDateInArray(list[i], uniqueDates)) {
                            uniqueDates.push(list[i]);
                        }
                    }

                    displayForecast(uniqueDates);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to GitHub');
        });
};

function isDateInArray(item, uniqueList) {
    for (var i = 0; i < uniqueList.length; i++) {
        var itemDate = new Date(item.dt * 1000);
        var uniqDate = new Date(uniqueList[i].dt * 1000);

        if (itemDate.getDay() === uniqDate.getDay()) {
            return true;
        }
    }
    return false;
}

function displayForecast(forecastList) {
    cardEl.empty();

    forecastList.forEach(function (item) {
        const date = new Date(item.dt * 1000);
        const formattedDate = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        weatherEl.removeClass('hidden');
        var forecastCard = $('<div class="forecast-card">');
        var temp = 'Temp: ' + item.main.temp + ' °F';
        var wind = 'Wind: ' + item.wind.speed + ' MPH';
        var humidity = 'Humidity: ' + item.main.humidity + '%';
        forecastCard.append('<p>' + formattedDate + '</p>');
        // this is getting the icon from openweatherapi
        forecastCard.append('<img src="http://openweathermap.org/img/w/'
        + item.weather[0].icon + '.png" />');
        forecastCard.append('<p>' + temp + '</p>');
        forecastCard.append('<p>' + wind + '</p>');
        forecastCard.append('<p>' + humidity + '</p>');

        cardEl.append(forecastCard);
    });
}

$(listEl).on("click", ".listBtn", getLocation);
$(searchBttn).click(getLocation);