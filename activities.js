const apiKey = "AIzaSyDwFz89HsDDFl_dGv9Y04Hi41jBGrli2ak";
const weatherApiKey = "47b85d44ece5cad30ecf48a4239379b3";

// create map
window.initMap = function (latitude, longitude) {
  const options = {
    zoom: 10,
    center: { lat: latitude, lng: longitude },
  };
  window.map = new google.maps.Map(document.getElementById("map"), options);
};

// create markers based on search
const labels = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"];
let labelIndex = 0;
function createMarker(result) {
  const marker = new google.maps.Marker({
    position: result.geometry.location,
    map: window.map,
    animation: google.maps.Animation.DROP,
    label: labels[labelIndex++ % labels.length],
  });
  markers.push(marker)
}

// delete markers
markers = []
function deleteMarker() {
  for (let i=0; i < markers.length; i++) {
    markers[i].setMap(null)
  }
  markers = []
}

// use search bar to search places
const activitiesInputForm = document.querySelector(".activities-input-form");
activitiesInputForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // deletes markers on map if existing
  deleteMarker()
  const activitiesInputValue = document.querySelector(".activities-user-input");
  const inputValue = activitiesInputValue.value;
  const urlEncodedInputValue = encodeURIComponent(inputValue);
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(
    {
      location: { lat: latitude, lng: longitude },
      radius: "2200",
      keyword: inputValue,
    },
    // render places on map and place new markers
    (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        let bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
          bounds.extend(results[i].geometry.location);
        }
        window.results = results
        // renders into Results list
        renderList(results)
        map.fitBounds(bounds);
      }
    }
    );
    activitiesInputForm.reset()
  });

// add buttons to each list item
function add() {
  const listOfResults = document.querySelectorAll(".results");
  const addBtn = document.querySelectorAll(".addBtn");
  // move item to itinerary list if button is clicked
  for (let i = 0; i < listOfResults.length; i++) {
    addBtn[i].addEventListener("click", (e) => {
      const id = e.target.dataset.id
      const place = results.find(result => result.place_id == id)
      // add to local storage if not already in there
      let itinerary = JSON.parse(localStorage.getItem('itinerary'))
      if (!itinerary) {
        itinerary = []
      }
      itinerary.push(place)
      // if item is in local storage, remove add button
      document.querySelector(`.results button[data-id=${id}]`).classList.add('d-none')
      renderItinerary(itinerary)
      localStorage.setItem("itinerary", JSON.stringify(itinerary))
    });
  }
}

// fetch weather based off location inputted by user
const queries = new URLSearchParams(window.location.search);
const userLocation = queries.get("location");
fetch(
  `https://maps.googleapis.com/maps/api/geocode/json?address=${userLocation}&key=${apiKey}`
)
  .then((res) => res.json())
  .then((data) => {
    latitude = data.results[0].geometry.location.lat;
    longitude = data.results[0].geometry.location.lng;
    initMap(latitude, longitude);
    fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly&appid=${weatherApiKey}`
    )
      .then((res) => res.json())
      .then((weather) => {
        // create 5 day forecast
        for (let i = 0; i < 5; i++) {
          renderWeather(weather.daily[i]);
        }
      });
  });

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// create weather forecast
function renderWeather(data) {
  const dayOfWeek = weekday[new Date(data.dt * 1000).getDay()];
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  const temp = Math.round(1.8 * (data.temp.day - 273) + 32);
  const high = Math.round(1.8 * (data.temp.max - 273) + 32);
  const low = Math.round(1.8 * (data.temp.min - 273) + 32);
  const weatherHtmlArray = `
    <div class="weather-day p-3 ms-3">
      <div class="day">
        <h1 class="dayOfWeek">
            ${dayOfWeek}
        </h1>
      </div>
      <div class="description">
        ${description}
      </div>
      <div class="icon">
        <img src="http://openweathermap.org/img/wn/${icon}@2x.png" width="50" height="50">
      </div>
      <div class="temp">
        ${temp}°
      </div>
      <div class="range">
        <div class="high">
          H:${high}°
        </div>
        <div class="low">
          L:${low}°
        </div>
    </div>
    </div>`;
  document
    .querySelector(".weather")
    .insertAdjacentHTML("beforeend", weatherHtmlArray);
}

// render results list with search data
function renderList(resultsData) {
  const resultsList = document.querySelector(".results-list");
  let itinerary = JSON.parse(localStorage.getItem('itinerary')) ?? []
  const resultsHtmlArray = resultsData.map(function(currentResult, index) {
    const alreadyAdded = itinerary.some(item => item.place_id == currentResult.place_id)
      return `
      <li class="list-group-item results">${index+1}. ${currentResult.name}<button data-id="${currentResult.place_id}" class="addBtn ${alreadyAdded? "d-none" : ""}">Add</button></li>`
  })
  resultsList.innerHTML = resultsHtmlArray.join('')
  add()
}

// render itinerary list
function renderItinerary(itineraryData) {
  const itineraryList = document.querySelector(".itinerary-list");
  const itineraryHtmlArray = itineraryData.map(function(currentResult,index) {
    return `
    <li class="list-group-item itinerary-item">${index+1}. ${currentResult.name}<button data-id="${currentResult.place_id}" class="removeBtn">Remove</button></li>`
})
  itineraryList.innerHTML = itineraryHtmlArray.join('')
  const listOfResults = document.querySelectorAll(".itinerary-item");
  const removeBtn = document.querySelectorAll(".removeBtn");
  // remove item from list if remove button is clicked
  for (let i = 0; i < listOfResults.length; i++) {
    removeBtn[i].addEventListener("click", (e) => {
      const id = e.target.dataset.id
      let itinerary = JSON.parse(localStorage.getItem('itinerary'))
      if (!itinerary) {
        itinerary = []
      }
      itinerary = itinerary.filter(result => result.place_id != id)
      renderItinerary(itinerary)
      // show add button in result list after removing from itinerary
      document.querySelector(`.results button[data-id=${id}]`)?.classList.remove('d-none')
      localStorage.setItem("itinerary", JSON.stringify(itinerary))
      e.target.parentElement.remove()
    });
  }
}

let itinerary = JSON.parse(localStorage.getItem('itinerary'))
renderItinerary(itinerary)