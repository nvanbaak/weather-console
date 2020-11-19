const APIKEY = "94cca1029aaece9ee895c9d66c20117e";

// Set up search history
const searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
let currentSearch;

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

    // Skip the whole thing if the current city is already in the results
    if (currentSearch === cityname) {
        return;
    } else {
        currentSearch = cityname;
    }

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

        let searchLimit = searchHistory.length > 10 ? 10 : searchHistory.length;

        searchHist.append($("<h2>").text(`Last ${searchLimit} Searches:`))

        const listory = $("<ul>");

        for (let i = 0; i < searchLimit; i++) {
            const searchEl = $("<li>").text(searchHistory[i]);
            listory.append(searchEl);
        }

        searchHist.append(listory)

        // ===============================================
        //                SEARCH RESULTS
        // ===============================================

        // ##### Today's info #####

        // Destructure the list out of the forecast
        const { list }  = response;
        const today = list[0];

        // Clear results
        results.empty();

        // Interpret date data
        const thisTime = new Date(today.dt * 1000); // seconds -> milliseconds
        const todaysDay = `${getDayName(thisTime.getDay())}`;
        const todaysDate = `${thisTime.getMonth()}/${thisTime.getDate()}`;

        // Add city name, date, and weather panels
        results
            .append($("<h2>").text(`——— ${response.city.name} ———`))
            .append($("<h3>").text(`${todaysDay} ${todaysDate}`))
            .append($("<div>", {"class":"weather-panel1 flexwrap"}))
            .append($("<div>", {"class":"weather-panel2 flexwrap"}));

        // ### Weather Conditions ###
        
        // Make box
        const weatherBox = $("<div>", {"class":"weatherbox conditionbox"})

        // Label the box
        const weatherLabel = $("<h4>").text("Weather");
        
        // Make icon
        const icon = $("<img>", {"src":`http://openweathermap.org/img/wn/${today.weather[0].icon}.png`});

        // Label icon
        const iconLabel = $("<p>").text(today.weather[0].description)

        // append
        $(".weather-panel1").append(
            weatherBox
                .append(weatherLabel)
                .append($("<div>", {"class":"flexwrap"})
                    .append(icon)
                    .append(iconLabel)
                )
        )

        // ### Temperature ###

        const tempBox = $("<div>", {"class":"tempbox weatherbox"});
        const tempLabel = $("<h4>").text("Temperature");

        const todaysTemp = $("<p>").text(((today.main.temp - 273.15) * 1.80 + 32).toFixed(1) + "F");

        $(".weather-panel1").append(
            tempBox
                .append(tempLabel)
                .append(todaysTemp)
        );
 
        // ### Humidity ###

        const humBox = $("<div>", {"class":"humbox weatherbox"});
        const humLabel = $("<h4>").text("Humidity");

        $(".weather-panel2").append(
            humBox
                .append(humLabel)
                .append($("<p>").text(`${today.main.humidity}%`))
        )

        // ### Wind Speed ###

        const windBox = $("<div>", {"class":"windbox weatherbox"});
        const windLabel = $("<h4>").text("Wind Speed");
        // Convert meters/second to miles/hour
        const windSpeed = (today.wind.speed * 2.23694).toFixed(0);

        $(".weather-panel2").append(
            windBox
                .append(windLabel)
                .append($("<p>").text(`${windSpeed} mph`))
        )

        // ### UV Levels ###

        // This information is not provided by the API we're using, so we need to make an AJAX call to the one that does.  That means the UV information probably shows up after the 5 day forecast, but since weather-panel2 is already on the page we won't run into issues with content being out of order.

        // Grab lat/long and make a call to One Call API
        var searchLat = response.city.coord.lat;
        var searchLon = response.city.coord.lon;

        var oneCallURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${searchLat}&lon=${searchLon}&exclude=minutely,hourly,alerts&appid=${APIKEY}`;
        
        $.ajax({
            url:oneCallURL,
            method:"GET"
        }).then( function(subresponse) {

                console.log(subresponse);
                
                const uvBox = $("<div>", {"class":"weatherbox"});
                const uvLabel = $("<h4>").text("UV Index");
                
                const uvi = subresponse.current.uvi;

                // This switch statement rounds up the uv index and then uses that to determine the proper coloration for the uv box
                switch (Math.ceil(uvi)) {
                    case 0:
                    case 1:
                    case 2:
                        uvBox.addClass("uv-low");
                        break;
                    case 3:
                    case 4:
                    case 5:
                        uvBox.addClass("uv-med");
                        break;
                    case 6:
                    case 7:
                        uvBox.addClass("uv-high");
                        break;
                    case 8:
                    case 9:
                    case 10:
                        uvBox.addClass("uv-v-high");
                        break;
                    default:
                        uvBox.addClass("uv-ext");
                        break;
                }

                $(".weather-panel2").append(
                    uvBox
                    .append(uvLabel)
                    .append($("<p>").text(uvi))
                    )
        
        });

        // ### 5 Day Forecast ###

        // Create output slot for forecast stuff
        results.append(
            $("<div>", {"class":"forecast"})
                .append($("<h3>").text("5 Day Forecast"))
                .append($("<div>", {"class":"day-row flexwrap"}))
        )

        // Add forecast boxes
        for (let i = 7; i < list.length; i = i+8) {
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

// search history functionality
$(".history").on("click", ( { target } ) => {

    if (target.nodeName === "LI") {
        getWeather(target.innerText);
    }

})