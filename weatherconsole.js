const APIKEY = "&appid=94cca1029aaece9ee895c9d66c20117e";

var responseObj;


// search button functionality
$("#city-submit").on("click", function(event) {
    event.preventDefault();

    var city = document.getElementById("city-search").value;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + APIKEY;

    $.ajax({
        url:queryURL,
        method:"GET"
    }).then( function(response) {
        
        // Clear results
        $("#results").empty();

        // Paste city name to Results
        var cityName = $("<h3>").text("——— " + response.name + " ———");
        $("#results").append(cityName);

        // Paste date into results
        var date = $("<p>").text(moment().format("dddd, MMM do YYYY"));
        $("#results").append(date);

        // Create weather "icon" and append
        var weatherCondition = response.weather[0].description;
        weatherCondition = $("<p>").text("The weather is: " + weatherCondition);

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



    });

});