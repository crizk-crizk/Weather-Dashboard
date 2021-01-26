$(document).ready(function () {
  //onclick event for the search button
  $("#searchBtn").on("click", function () {
    //setting value from input box as a variable so 'city' can be used throughout this function
    var city = $(".inputCity").val();

    //ajax call Current temperature
    $.ajax({
      url:
        "http://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=05c2a7d4eefaaf927737607c9fd27a6c",
      method: "GET",
      crossDomain: true,
    }).then(function (response) {
      // console.log(response);
      // calling the function that saves cities in storage & displays cities on HTML. (below)
      storeCity(city);

      displayWeather(response);

      fetchAndDisplayUVindex(response.coord.lat, response.coord.lon);
    });

    //AJAX request for 5-day forecast
    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=05c2a7d4eefaaf927737607c9fd27a6c`,
      method: "GET",
      crossDomain: true,
    }).then(function (response) {
      console.log(response.list);
      //filer returns only items that meet the condition (dt_txt includes 12:00:00, in this case)
      //filter method (true or false).
      var noonWeather = response.list.filter(function (item) {
        return item.dt_txt.includes("12:00:00");
      });
      // console.log(noonWeather);
      display5day(noonWeather);
    });
  });

  //AJAX request for UV index (callback is a buzz word it's a variable name of a parameter )
  function fetchAndDisplayUVindex(lat, lon) {
    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=05c2a7d4eefaaf927737607c9fd27a6c`,
      method: "GET",
      crossDomain: true,
    }).then(function (response) {
      //console.log(response);
      //
      displayUVindex(response.value);
      //display UV index
      //console.log("UVI", response.value);
    });
  }

  //**Display five day weather
  function display5day(noonWeather) {
    console.log("5 day", noonWeather);
    const forecast = $(".forecast");
    forecast.empty();
    noonWeather.forEach((day) => {
      const div = $('<div class="oneDayForecast"/>');
      const iconUrl = `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`;

      div.append(`<h2>${new Date(day.dt_txt).toLocaleDateString()}</h2>`);
      div.append(`<img src="${iconUrl}">`);
      div.append(`<div>Temp: ${day.main.temp}</div>`);
      div.append(`<div>Humidity: ${day.main.humidity}</div>`);
      forecast.append(div);
    });
  }

  //**Display uv index inside the weather info etc.
  function displayUVindex(uvIndex) {
    $("#uvi").text(uvIndex);
    const uviColors = [
      "green",
      "green",
      "green",
      "green",
      "orange",
      "orange",
      "orange",
      "orange",
      "red",
      "red",
      "red",
      "red",
      "violet",
    ];
    const colorIndex = Math.round(uvIndex);
    $("#uvi").css("background-color", uviColors[colorIndex]);
    //console.log("uv index", uvIndex);
  }

  //**Display current weather info etc.
  function displayWeather({ main, wind, name, weather }) {
    // console.log("weather", response);
    $("#temp").text(main.temp);
    $("#humidity").text(main.humidity);
    $("#wind").text(wind.speed);
    $("#cityAndDate").text(
      `${name} (${moment().format("dddd MMMM Do, YYYY")})`
    );
    const iconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    $("#weatherIcon").attr("src", iconUrl);
  }

  //access local storage to keeps that have been searched
  //store city function
  function storeCity(city) {
    //notice this var is scoped only in this function -not same as getCities function below
    var storedCities = getCities();
    if (!storedCities.includes(city)) {
      storedCities.push(city);
      localStorage.setItem("storeCity", JSON.stringify(storedCities));
      var newCity = $(`<div class="cityChoice">${city}</div>`);
      //makes city clickable
      newCity.on("click", cityClicked);
      $("#searchedCities").append(newCity);
    }
  }

  //responds to the click on the city in the side bar
  function cityClicked() {
    $(".inputCity").val($(this).text());
    $("#searchBtn").trigger("click");
  }
  //when is data stored? user types in input box & clicks search btn.
  //set a max for searched cities stored (10 would be good)
  //store array using JSON stringify

  function getCities() {
    var storedCities = localStorage.getItem("storeCity");

    //this will give back cities array
    return JSON.parse(storedCities) || [];
  }

  //**Display list of cities that have been searched by user
  function displayCities() {
    var citiesInStorage = getCities();
    var citiesList = citiesInStorage.map(function (city) {
      var div = $(`<div class="cityChoice">${city}</div>`);
      div.on("click", cityClicked);
      return div;
    });
    //console.log(citiesList)
    $("#searchedCities").html(citiesList);
    return citiesInStorage;
  }

  //redesplay last city accessed
  var cities = displayCities();
  if (cities.length > 0) {
    $(".inputCity").val(cities[cities.length - 1]);
    $("#searchBtn").trigger("click");
  }
});
// // 3 helpful methods: 1.map 2.filter 3.reduce. to manipulate arrays.
// http://api.openweathermap.org/data/2.5/weather?q=Seattle&units=imperial&appid=05c2a7d4eefaaf927737607c9fd27a6c

// http://api.openweathermap.org/data/2.5/forecast?q=Miami&units=imperial&appid=05c2a7d4eefaaf927737607c9fd27a6c
