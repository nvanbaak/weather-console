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
        $(".city-name").append(cityName);

        // Paste date into results
        var date = $("<p>").text(moment().format("dddd, MMM do YYYY"));
        $(".date").append(date);

        // Create weather "icon"
        var weatherCondition = response.weather[0].description;
        weatherCondition = $("<p>").text("The weather is: " + weatherCondition);
        var preString = $("<p>").text("(icons take too long to load)");
        var postString = $("<p>").text("(pretend I put one here)");
        
        $(".weather-condition").append(preString);
        $(".weather-condition").append(weatherCondition);
        $(".weather-condition").append(postString);



// an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index


// Then grab lat/long and make a call to One Call API

        console.log(response);
    });

});