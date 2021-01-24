$(document).ready(function () {
  //onclick event for the search button
  $("#searchBtn").on("click", function () {
    //button getting value from input box
    var city = $(".inputCity").val();
    //ajax call
    $.ajax({
      url:
        "http://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=05c2a7d4eefaaf927737607c9fd27a6c",
      method: "GET",
      crossDomain: true,
    }).then(function (response) {
      console.log(response);
      storeCity(city);
      displayWeather(response);
      fetchUVindex(response.coord.lat, response.coord.lon, displayUVindex);
    });

    //AJAX request for 5-day forecast
    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=05c2a7d4eefaaf927737607c9fd27a6c`,
      method: "GET",
      crossDomain: true,
    }).then(function (response) {
      console.log(response.list);
      //filer returns only items that meet the condition (dt_txt includes 12:00:00, in this case)
      var noonWeather = response.list.filter(function (item) {
        return item.dt_txt.includes("12:00:00");
      });
      console.log(noonWeather);
    });
  });

  //AJAX request for UV index
  function fetchUVindex(lat, lon, callback) {
    $.ajax({
      url: `http://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=05c2a7d4eefaaf927737607c9fd27a6c`,
      method: "GET",
      crossDomain: true,
    }).then(function (response) {
      console.log(response);
      callback(response.value);
    });
  }

  function displayUVindex(response) {
    console.log("UVI", response);
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
        div.on('click', cityClicked);
        return div;
    });
    //console.log(citiesList)
    $("#searchedCities").html(citiesList);
    return citiesInStorage;
  }


  //**Display current weather info etc.
  function displayWeather(response) {
    console.log("weather", response);
  }

  //**Display 5-day forecast

  //redesplay last city accessed
  var cities = displayCities();
  if (cities.length > 0) {
    $(".inputCity").val(cities[cities.length - 1]);
    $("#searchBtn").trigger("click");
  }
});
// 3 helpful methods: 1.map 2.filter 3.reduce. to manipulate arrays.
