// Global Variables
let cityName = document.getElementById("city-name");
let todaysDate = moment().format("MMM Do YY");
let cityDataHTML = document.getElementById("city-data");
let buttonsSection = document.getElementById("buttons-section");

// ---- API Keys ----
const APIKey = "2e24842b55023e6c9f9d2387841f4aa7";
let chosenCity = [];
let firstAPIList = [];
let myData = [];
let forecast = [];
let next5Days = [];
let currentCity;
let citiesLocalStorageList = [];
let localStorageCities;

// Retrieve info from the first API
function getAPIData(APIKey, cityName) {
  firstAPIList = [];
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
      firstAPIList = [];
      firstAPIList.push(JSON.parse(request.response));
    } else {
      console.log(`error ${request.status}`);
    }
    getSecondAPIData(APIKey);
  };
}

// Retrieve data from the second API
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
      myData = [];
      myData.push(JSON.parse(request.response));
    } else {
      console.log(`error ${request.status}`);
    }
    writeFirstDashboard();
  };
}

// Get the city once the user hits the button "search" on the webpage
function getCity() {
  // Clear the list of current city and push it later
  currentCity = [];
  chosenCity = []
  // Get the search button using DOM
  let searchButton = document.getElementById("search-button");
  // Get the previous element which is the user input of the city
  let cityName = searchButton.previousElementSibling;
  // Get the city name
  cityName = cityName.value;
  chosenCity.push(cityName);
  // Push the value into the array this variable is being used to create first and second dashboard
  currentCity = cityName
  // Call the get APIData function so we can see the API with the desired city.
  getAPIData(APIKey, cityName);
  citiesSaved();
}

// Fills the first dashboard
function writeFirstDashboard() {
  // Write the name of the city
  cityName.textContent = currentCity + " " + todaysDate + "⛅";
  // Creating the HTML in the page
  createTagElementsHTMLFirstDashboard();
}

// Complement to the function "writeFirstDashboard"
function createTagElementsHTMLFirstDashboard() {
  // --- creating LIs elements for the UL ---
  // LI- Temperature
  let liTemperature = document.getElementById("li-temp");
  liTemperature.textContent = "Temp: " + myData[0].current["temp"];
  // LI- wind
  let liWind = document.getElementById("li-wind");
  liWind.textContent = "Wind: " + myData[0].current["wind_speed"] + "MPH";
  // LI- Humidity
  let liHumidity = document.getElementById("li-humidity");
  liHumidity.textContent = "Humidity: " + myData[0].current["humidity"] + "%";
  // LI- UVIndex
  let liUVIndex = document.getElementById("li-uvindex");
  liUVIndex.textContent = "UV Index: " + myData[0].current["uvi"] + "%";
  writeSecondDashboard();
}

// Fills the second dashboard
function writeSecondDashboard() {
  for (let i = 0; i < 5; i++) {
    let nextDay = document.getElementById(`day${i}`);
    let weatherForecast = myData[0].daily[i];
    // h2 Element inside of the div
    let h4Title = document.getElementById(`second-dashboard-h4-${i}`);
    // Grabbing the following days
    let followingDays = moment().add(i + 1, "days");
    // Writing the days in the spans
    h4Title.textContent = followingDays.format("L");
    // Create!!! li for the icon
    // TODO: Create the logic
    // Creating li for the temp
    let liTemp = document.getElementById(`second-dashboard-litemp-${i}`);
    liTemp.textContent = "Temp: " + weatherForecast.temp["day"] + "°F";
    // Creating li for the wind
    let liWind = document.getElementById(`second-dashboard-liwind-${i}`);
    liWind.textContent = "Wind: " + weatherForecast.wind_speed + "MPH";
    // Creating li for the humidity
    let liHumidity = document.getElementById(
      `second-dashboard-lihumidity-${i}`
    );
    liHumidity.textContent = "Humidity: " + weatherForecast.humidity + "%";
  }
}

// TODO: I'd also like to know how to save the data so I can use the memory of the browser

// store the cities saved in local storage as a list
function citiesSaved() {
  let currentCity = localStorage.getItem("city");
  let savedCities = currentCity ? JSON.parse(currentCity) : [];
  for (let i = 0; i < chosenCity.length; i++) {
    if (chosenCity.includes(chosenCity[i])) {
      savedCities.push({
        city: chosenCity[i],
      });
    }
  localStorage.setItem("city", JSON.stringify(savedCities));
  localStorageCities = localStorage.getItem("city");
  console.log(localStorageCities)
  localStorageCities = JSON.parse(localStorageCities)
  createButtonsLocalStorage(localStorageCities);
}

function createButtonsLocalStorage(localStorageCities) {
  let lastElement = localStorageCities[localStorageCities.length - 1]
  buttonsSection.innerHTML += `<button type="button" class="btn btn-primary buttons-local-storage"  onclick="clickButton('${lastElement.city}')">
  ${lastElement.city}
  </button>`;
}}

function clickButton(cityName) {
  console.log('hiiiii')
  // let cityButton = document.getElementById("city-button");
  // let cityName = this.value();
  console.log(cityName)
  currentCity = cityName
  getAPIData(APIKey, cityName);
}

let my_list = []

let CurrentLocalStorage = JSON.parse(localStorage.getItem("city"));

for(let i = 0; i < CurrentLocalStorage.length; i++) {
  console.log(CurrentLocalStorage[i])
  buttonsSection.innerHTML += `<button type="button" class="btn btn-primary buttons-local-storage"  onclick="clickButton('${CurrentLocalStorage[i].city}')">
  ${CurrentLocalStorage[i].city}
  </button>`;
}

// Save newly searched cities into a list in local storage
// Render that list under the search box as a list of buttons
// Each button should have a listener that runs the getAPIData function passing the text value of the button or a data attribute with the city name as the cityName parameter
// When a search is executed localStorage.getItem ("nameOfList")
// add the new city to that list
// re-render the city buttons
