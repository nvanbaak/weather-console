const APIKEY = "&appid=94cca1029aaece9ee895c9d66c20117e";

// Set up search history
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Page references
const errorbox = $("#error");

if (searchHistory[0]) {
    getWeather(searchHistory[0]);
} else {
    $("#city-search").text("Seattle");
    getWeather("Seattle");
}

function getWeather(cityname) {

    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + APIKEY;

    // First remove the error box if there is one
    errorbox.empty();


    $.ajax({
        url:queryURL,
        method:"GET"
    }).then( function(response) {
        
        console.log(response);

        // Clear results
        $("#results").empty();

        // Paste city name to Results
        var cityName = $("<h3>").text("——— " + response.name + " ———");
        $("#results").append(cityName);

        // Paste date into results
        var date = $("<p>").text(moment().format("dddd, MMM do YYYY"));
        $("#results").append(date);

        // Create weather "icon" and append
        let iconSrc = `http://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
         
        var weatherCondition = $("<img>", {"src":iconSrc});

        var weatherBox = $("<div>", {"class":"weather-condition"});
        weatherBox.append(weatherCondition);
        $("#results").append(weatherBox);

        // Paste temp into results
        // I'm so sorry
        $("#results").append($("<p>").text("Temp: " + ((response.main.temp - 273.15) * 1.80 + 32).toFixed(1) + "F"));

        // Paste humidity into results
        $("#results").append($("<p>").text("Humidity: " + response.main.humidity));
        
        // Wind speed 
        $("#results").append($("<p>").text("Wind speed: " + response.wind.speed + "kph"));

        // Then grab lat/long and make a call to One Call API
        var searchLat = response.coord.lat;
        var searchLon = response.coord.lon;

        var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ searchLat + "&lon=" + searchLon + "&exclude=minutely,hourly,alerts" + APIKEY;

        $.ajax({
            url:oneCallURL,
            method:"GET"
        }).then( function(subresponse) {

            console.log(subresponse);

            // Now grab uv index

            $("#results").append($("<p>").text("UV Index goes here after a comparison operation tells us what color to make it.  Then we go through a pared-down version of the above code only this time we use the forecast for the next five days."))
        });
    })
    .catch(err => {
        
        errorbox.append(
            $("<p>").text("Sorry, that city isn't in our records!")
        )

    });
}


// search button functionality
$("#city-submit").on("click", function(event) {
    event.preventDefault();

    var city = document.getElementById("city-search").value;
    
    getWeather(city)
});