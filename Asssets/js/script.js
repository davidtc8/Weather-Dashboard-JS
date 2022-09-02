// Global Variables
let cityName = document.getElementById("city-name");
let todaysDate = moment().format("MMM Do YY");
let cityDataHTML = document.getElementById("city-data");
let clearSecondDashboard = document.getElementById("clearSecondDashboard");

// ---- API Keys ----
const APIKey = "2e24842b55023e6c9f9d2387841f4aa7";
let chosenCity = [];
let firstAPIList = [];
let myData = [];
let forecast = [];
let next5Days = [];
let currentCity = [];

// Retrieve info from API
function getAPIData(APIKey, cityName) {
  const request = new XMLHttpRequest();
  request.open(
    "GET",
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityName +
      "&appid=" +
      APIKey
  );
  request.send();
  request.onload = () => {
    if (request.status == 200) {
      firstAPIList.push(JSON.parse(request.response));
    } else {
      console.log(`error ${request.status}`);
    }
    getSecondAPIData(APIKey);
  };
}

function getSecondAPIData(APIKey) {
  let lat = firstAPIList[0].coord["lat"];
  let lon = firstAPIList[0].coord["lon"];
  const request = new XMLHttpRequest();
  request.open(
    "GET",
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`
  );
  request.send();
  request.onload = () => {
    if (request.status == 200) {
      myData.push(JSON.parse(request.response));
      console.log("This is my data", myData);
    } else {
      console.log(`error ${request.status}`);
    }
    writeFirstDashboard();
  };
}

function getCity() {
  // Clear the list of current city and push it later   
  currentCity = []
  // Get the search button using DOM
  let searchButton = document.getElementById("search-button");
  // Get the previous element which is the user input of the city
  let cityName = searchButton.previousElementSibling;
  // Get the city name
  cityName = cityName.value;
  chosenCity.push(cityName);
  // Push the value into the array
  console.log(chosenCity);
  currentCity.push(cityName)
  // Call the get APIData function so we can see the API with the desired city.
  for (let i = 0; i < chosenCity.length; i++) {
    getAPIData(APIKey, cityName);
    citiesSaved();
  }
}

function writeFirstDashboard() {
    // Write the name of the city
    cityName.textContent = currentCity[0] + " " + todaysDate + "⛅";
    // Creating the HTML in the page
    createTagElementsHTMLFirstDashboard();
}

function createTagElementsHTMLFirstDashboard() {
  // Creating UL elements for the data of the city (first div)
  let ulCityData = document.createElement("ul");
  // Appending ulCityData to the father element
  cityDataHTML.append(ulCityData);
  // --- creating LIs elements for the UL ---
  // LI- Temperature
  let liTemperature = document.createElement("li");
  liTemperature.textContent = "Temp: " + myData[0].current["temp"];
  // Appending liTemperature to ulcityData
  liTemperature.remove();
  ulCityData.append(liTemperature);
  // LI- wind
  let liWind = document.createElement("li");
  liWind.textContent = "Wind: " + myData[0].current["wind_speed"] + "MPH";
  // Appending liTemperature to ulcityData
  ulCityData.append(liWind);
  // LI- Humidity
  let liHumidity = document.createElement("li");
  liHumidity.textContent = "Humidity: " + myData[0].current["humidity"] + "%";
  // Appending liTemperature to ulcityData
  ulCityData.append(liHumidity);
  // LI- UVIndex
  let liUVIndex = document.createElement("li");
  liUVIndex.textContent = "UV Index: " + myData[0].current["uvi"] + "%";
  // Appending liTemperature to ulcityData
  ulCityData.append(liUVIndex);
  writeSecondDashboard();
}

function writeSecondDashboard() {
  for (let i = 0; i < 5; i++) {
    let nextDay = document.getElementById(`day${i}`);
    let weatherForecast = myData[0].daily[i];
    console.log(weatherForecast);
    // Creating Span element
    let span = document.createElement("span");
    span.classList.add("badge", "badge-secondary");
    nextDay.append(span);
    // The div that will contain all my info
    let divInfo = document.createElement("div");
    span.append(divInfo);
    // h2 Element inside of the div
    let h2Title = document.createElement("h4");
    h2Title.classList.add("bold");
    divInfo.append(h2Title);
    // Grabbing the following days
    let followingDays = moment().add(i + 1, "days");
    // Writing the days in the spans
    h2Title.textContent = followingDays.format("L");

    // Creating a ul that will contain the data needed for each span
    let ulInfo = document.createElement("ul");
    divInfo.append(ulInfo);

    // Creating li for the icon
    // TODO: Create the logic

    // Creating li for the temp
    let liTemp = document.createElement("li");
    liTemp.textContent = "Temp: " + weatherForecast.temp["day"] + "°F";
    divInfo.append(liTemp);
    // Creating li for the wind
    let liWind = document.createElement("li");
    liWind.textContent = "Wind: " + weatherForecast.wind_speed + "MPH";
    divInfo.append(liWind);
    // Creating li for the humidity
    let liHumidity = document.createElement("li");
    liHumidity.textContent = "Humidity: " + weatherForecast.humidity + "%";
    divInfo.append(liHumidity);
  }
}

// TODO: I'd also like to know how to save the data so I can use the memory of the browser

// store the cities saved
function citiesSaved() {
  let currentCity = localStorage.getItem("city");
  let savedCities = currentCity ? JSON.parse(currentCity) : [];
  console.log(savedCities);
  for (let i = 0; i < chosenCity.length; i++)
    savedCities.push({
      city: chosenCity[i],
    });
  localStorage.setItem("City", JSON.stringify(savedCities));
}

// Clear the dashboard every time you enter a new city
function clearDashboard() {
  cityDataHTML.innerHTML = `<h1 class="text-center" id="city-name">Once you search your city, this will change</h1>`;
  console.log(cityDataHTML);
  clearDashboard.innerHTML = `5-Day Forecast:
  <section class="row align-items-start">
    <div class="col forecast bg-primary text-white margin-size" id="day0"></div>
    <div class="col forecast bg-primary text-white margin-size" id="day1"></div>
    <div class="col forecast bg-primary text-white margin-size" id="day2"></div>
    <div class="col forecast bg-primary text-white margin-size" id="day3"></div>
    <div class="col forecast bg-primary text-white margin-size" id="day4"></div>
  </section>`;
}

// Save newly searched cities into a list in local storage
// Render that list under the search box as a list of buttons
// Each button should have a listener that runs the getAPIData function passing the text value of the button or a data attribute with the city name as the cityName parameter
// When a search is executed localStorage.getItem ("nameOfList")
// add the new city to that list
// re-render the city buttons
