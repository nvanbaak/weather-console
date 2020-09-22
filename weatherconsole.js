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

        responseObj = response;

        // Paste city name to Results
        var cityName = $("<h3>").text("——— " + response.name + " ———");
        $("#results").append(cityName);

        // Paste date into results
        var date = $("<p>").text(moment().format("dddd, MMM do YYYY"));
        $("#results").append(date);

        // Create weather "icon" and append
        var weatherCondition = response.weather[0].description;
        weatherCondition = $("<p>").text("The weather is: " + weatherCondition);
        var preString = $("<p>").text("(icons take too long to load)");
        var postString = $("<p>").text("(pretend I put one here)");
        preString.addClass("small-font");
        postString.addClass("small-font");

        var weatherBox = $("<div>", {"class":"weather-condition"});

        weatherBox.append(preString);
        weatherBox.append(weatherCondition);
        weatherBox.append(postString);

        $("#results").append(weatherBox);

        // Paste temp into results
        // I'm so sorry
        $("#results").append($("<p>").text("Temp: " + ((response.main.temp - 273.15) * 1.80 + 32).toFixed(1) + "F"));

        // Paste humidity into results
        $("#results").append($("<p>").text("Humidity: " + response.main.humidity));
        
        // the wind speed, 
        // $("#results").append($("<p>").text("Humidity: " + response.main.humidity));

        // and the UV index
// Then grab lat/long and make a call to One Call API

        console.log(response);
    });

});

function kelvinToF(temp) {

}