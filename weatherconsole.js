const APIKEY = "94cca1029aaece9ee895c9d66c20117e";

// Set up search history
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

// Page references
const notifbox = $("#notif");
const results = $("#results");
const searchHist = $(".history")

// Set up first search
if (searchHistory[0]) {

    // We're going to search for the first element in the search history
    // However, that will add it to the top of the search history.  So
    // we're going to use shift() to remove it from the array before it 
    // gets added back.
    getWeather(searchHistory.shift());

} else {

    $("#city-search").text("Seattle");
    getWeather("Seattle");
    notifbox.append(
        $("<p>", {"class":"welcome"}).text("Welcome to the weather console! Your search history is empty, so here's an example search to start you off!")
    );
}

function getDayName(dayIndex) {

    switch (dayIndex) {
        case 1:
            return "Mon";
        case 2:
            return "Tues";
        case 3:
            return "Wed";
        case 4:
            return "Thur";
        case 5:
            return "Fri";
        case 6:
            return "Sat";
        case 0:
            return "Sun";
    }
}

function getWeather(cityname) {

    let queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${APIKEY}`;

    // First remove the error box if there is one
    notifbox.empty();

    $.ajax({
        url:queryURL,
        method:"GET"
    }).then( function(response) { 
        
        console.log(response);

        // ===============================================
        //                 SEARCH HISTORY
        // ===============================================

        // If we're here, the search worked, so we can add it to the search history
        searchHistory.unshift(cityname);
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

        // Populate search history
        searchHist.empty();
        searchHist.append($("<h2>").text("Last 10 Searches:"))

        let searchLimit = searchHistory.length > 10 ? 10 : searchHistory.length;

        const listory = $("<ul>");

        for (let i = 0; i < searchLimit; i++) {
            const searchEl = $("<li>").text(searchHistory[i]);
            listory.append(searchEl);
        }

        searchHist.append(listory)

        // ===============================================
        //                SEARCH RESULTS
        // ===============================================

        // ### Today's info ###

        // Destructure the list out of the forecast
        const { list }  = response;
        const today = list[0];

        // Clear results
        results.empty();

        const thisTime = new Date(today.dt * 1000);
        const todaysDay = `${getDayName(thisTime.getDay())}`;
        const todaysDate = `${thisTime.getMonth()}/${thisTime.getDate()}`;

        // Add city name and date
        results
            .append($("<h2>").text(`——— ${response.city.name} ———`))
            .append($("<h3>").text(`${todaysDay} ${todaysDate}`));










        // ### Day Forecast ###

        // Create output slot for forecast stuff
        results.append(
            $("<div>", {"class":"forecast"})
                .append($("<h3>").text("5 Day Forecast"))
                .append($("<div>", {"class":"day-row"}))
        )

        // Add forecast boxes
        for (let i = 7; i < list.length; i = i+7) {
            // Define variables
            let forecast = list[i];
            let time = new Date(forecast.dt * 1000);
            let dayString = `${getDayName(time.getDay())}`
            let dateString = `${time.getMonth()}/${time.getDate()}`;
            let iconSrc = `http://openweathermap.org/img/wn/${list[i].weather[0].icon}.png`;

            // Create DOM elements
            const iconBox = $("<div>", {"class":"icon-box"});
            const dayStr = $("<p>", {"class":"label"}).text(dayString);
            const dateStr = $("<p>", {"class":"label"}).text(dateString);
            const weatherIcon = $("<img>", {"src":iconSrc});
            const tempString = $("<p>").text("Temp: " + ((forecast.main.temp - 273.15) * 1.80 + 32).toFixed(1) + "F");
            const humString = $("<p>").text(`Humidity: ${forecast.main.humidity}%`);

            // Append using this structure
            $(".day-row").append(
                iconBox
                    .append(dayStr)
                    .append(dateStr)
                    .append(weatherIcon)
                    .append(tempString)
                    .append(humString)
            )
        }







        // // Paste date into results
        // var date = $("<p>").text(moment().format("dddd, MMM do YYYY"));
        // $("#results").append(date);

        // // Create weather "icon" and append
        // let iconSrc = `http://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
         
        // var weatherCondition = $("<img>", {"src":iconSrc});

        // var weatherBox = $("<div>", {"class":"weather-condition"});
        // weatherBox.append(weatherCondition);
        // $("#results").append(weatherBox);

        // // Paste temp into results
        // // I'm so sorry
        // $("#results").append($("<p>").text("Temp: " + ((response.main.temp - 273.15) * 1.80 + 32).toFixed(1) + "F"));

        // // Paste humidity into results
        // $("#results").append($("<p>").text("Humidity: " + response.main.humidity));
        
        // // Wind speed 
        // $("#results").append($("<p>").text("Wind speed: " + response.wind.speed + "kph"));

        // Then grab lat/long and make a call to One Call API
        // var searchLat = response.coord.lat;
        // var searchLon = response.coord.lon;

        // var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?lat="+ searchLat + "&lon=" + searchLon + "&exclude=minutely,hourly,alerts" + APIKEY;

        // $.ajax({
        //     url:oneCallURL,
        //     method:"GET"
        // }).then( function(subresponse) {

        //     console.log(subresponse);

        //     // Now grab uv index

        //     $("#results").append($("<p>").text("UV Index goes here after a comparison operation tells us what color to make it.  Then we go through a pared-down version of the above code only this time we use the forecast for the next five days."))
        // });
    })
    .catch(err => {
        
        notifbox.append(
            $("<p>", {"class":"error"}).text("Sorry, that city isn't in our records!")
        )

    });
}


// search button functionality
$("#city-submit").on("click", function(event) {
    event.preventDefault();

    var city = document.getElementById("city-search").value;
    
    getWeather(city)
});