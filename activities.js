const apiKey = "AIzaSyDwFz89HsDDFl_dGv9Y04Hi41jBGrli2ak";
const weatherApiKey = "47b85d44ece5cad30ecf48a4239379b3";

window.initMap = function (latitude, longitude) {
  const options = {
    zoom: 10,
    center: { lat: latitude, lng: longitude },
  };
  window.map = new google.maps.Map(document.getElementById("map"), options);
};

const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function addandRemove() {
  const listOfResults = document.querySelectorAll(".results");
  const addBtn = document.querySelectorAll(".addbtn");
  for (let i = 0; i < listOfResults.length; i++) {
    addBtn[i].addEventListener("click", (e) => {
      const id = e.target.dataset.id
      console.log(id)
      const place = results.find(result => result.place_id == id)
      console.log(place)
      let itinerary = JSON.parse(localStorage.getItem('itinerary'))
      if (!itinerary) {
        itinerary = []
      }
      itinerary.push(place)
      document.querySelector(`.results button[data-id=${id}]`).classList.add('d-none')
      renderItinerary(itinerary)
      localStorage.setItem("itinerary",JSON.stringify(itinerary))
    });
  }
}

function renderWeather(data) {
  const dayofWeek = weekday[new Date(data.dt * 1000).getDay()];
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;
  const temp = Math.round(1.8 * (data.temp.day - 273) + 32);
  const high = Math.round(1.8 * (data.temp.max - 273) + 32);
  const low = Math.round(1.8 * (data.temp.min - 273) + 32);
  const weatherHtmlArray = `
    <div class="weather-day p-3 ms-3">
    <div class="day">
        <h1>
            ${dayofWeek}
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
        for (let i = 0; i < 5; i++) {
          renderWeather(weather.daily[i]);
        }
      });
  });

const labels = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20"];
let labelIndex = 0;

function createMarker(result) {
  const marker = new google.maps.Marker({
    position: result.geometry.location,
    map: window.map,
    label: labels[labelIndex++ % labels.length],
  });
  markers.push(marker)
}

markers = []
function deleteMarker() {
  for (let i=0; i < markers.length; i++) {
    markers[i].setMap(null)
  }
}

const activitiesInputForm = document.querySelector(".activities-input-form");
activitiesInputForm.addEventListener("submit", (e) => {
  e.preventDefault();
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
    (results, status) => {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        let bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < results.length; i++) {
          createMarker(results[i]);
          bounds.extend(results[i].geometry.location);
        }
        window.results = results
        renderList(results)
        map.fitBounds(bounds);
      }
    }
    );
    activitiesInputForm.reset()
  });


function renderList(resultsData) {
  const resultsList = document.querySelector(".results-list");
  let itinerary = JSON.parse(localStorage.getItem('itinerary'))
  const resultsHtmlArray = resultsData.map(function(currentResult,index) {
    const alreadyAdded = itinerary.some(item => item.place_id == currentResult.place_id)
      return `
      <li class="list-group-item results">${index+1} ${currentResult.name}<button data-id="${currentResult.place_id}" class="addbtn ${alreadyAdded? "d-none" : ""}">Add</button></li>`
  })
  resultsList.innerHTML = resultsHtmlArray.join('')
  addandRemove()
}

function renderItinerary(itinerarydata) {
  const itineraryList = document.querySelector(".itinerary-list");
  const itineraryHtmlArray = itinerarydata.map(function(currentResult,index) {
    return `
    <li class="list-group-item itinerary-item">${index+1} ${currentResult.name}<button data-id="${currentResult.place_id}" class="removebtn">Remove</button></li>`
})
  itineraryList.innerHTML = itineraryHtmlArray.join('')
  const listOfResults = document.querySelectorAll(".itinerary-item");
  const removeBtn = document.querySelectorAll(".removebtn");
  for (let i = 0; i < listOfResults.length; i++) {
    removeBtn[i].addEventListener("click", (e) => {
      const id = e.target.dataset.id
      console.log(id)
      let itinerary = JSON.parse(localStorage.getItem('itinerary'))
      if (!itinerary) {
        itinerary = []
      }
      itinerary = itinerary.filter(result => result.place_id != id)
      renderItinerary(itinerary)
      document.querySelector(`.results button[data-id=${id}]`)?.classList.remove('d-none')
      localStorage.setItem("itinerary",JSON.stringify(itinerary))
      e.target.parentElement.remove()
    });
  }
}

let itinerary = JSON.parse(localStorage.getItem('itinerary'))
renderItinerary(itinerary)