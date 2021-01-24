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
    });
  });

  //access local storage to keeps that have been searched
  //store city function
  function storeCity(city) {
    //notice this var is scoped only in this function -not same as getCities function below
    var storedCities = getCities();
    if (!storedCities.includes(city)) {
      storedCities.push(city);
      localStorage.setItem("storeCity", JSON.stringify(storedCities));
    }
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
      return `<li>${city}</li>`;
    });
console.log(citiesList)
    $("#searchedCities").html(citiesList);

  }
  displayCities();
  //**Display current weather info etc.

  //**Display 5-day forecast
});
