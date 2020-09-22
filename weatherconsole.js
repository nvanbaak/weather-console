const APIKEY = "&appid=94cca1029aaece9ee895c9d66c20117e";

// search button functionality
$("#city-submit").on("click", function(event) {
    event.preventDefault();

    var city = document.getElementById("city-search").value;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + APIKEY;

    $.ajax({
        url:queryURL,
        method:"GET"
    }).then( function(response) {

        // Paste city name to Results
        var cityName = $("<h3>").text("——— " + response.name + " ———");
        $(".city-name").append(cityName);

        // Paste date into results
        var date = $("<p>").text(moment().format("dddd, MMM do YYYY"));
        $(".date").append(date);

        

// an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index


// Then grab lat/long and make a call to One Call API

        console.log(response);
    });

});