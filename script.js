$.ajax({
    url: "http://api.openweathermap.org/data/2.5/weather?q=London&appid=05c2a7d4eefaaf927737607c9fd27a6c",
    method: "GET",
crossDomain: true,
  }).then(function (response) {
    console.log(response);
  });