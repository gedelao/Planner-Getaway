const apiKey = "AIzaSyDwFz89HsDDFl_dGv9Y04Hi41jBGrli2ak";
const weatherApiKey = '47b85d44ece5cad30ecf48a4239379b3'

window.initMap = function (latitude, longitude) {
  const options = {
    zoom: 10,
    center: { lat: latitude, lng: longitude },
  };
  window.map = new google.maps.Map(document.getElementById("map"), options);
};

const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

function renderWeather(data) {
    const dayofWeek = weekday[new Date(data.dt*1000).getDay()]
    const description = data.weather[0].description
    const icon = data.weather[0].icon
    const temp = Math.round(1.8 * (data.temp.day - 273) + 32)
    const high = Math.round(1.8 * (data.temp.max - 273) + 32)
    const low = Math.round(1.8 * (data.temp.min - 273) + 32)
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
    </div>`
  document.querySelector(".weather").insertAdjacentHTML('beforeend',weatherHtmlArray)
}

const queries = new URLSearchParams(window.location.search)
const userLocation = queries.get('location')
fetch(
  `https://maps.googleapis.com/maps/api/geocode/json?address=${userLocation}&key=${apiKey}`
  )
  .then((res) => res.json())
  .then((data) => {
    latitude = data.results[0].geometry.location.lat;
    longitude = data.results[0].geometry.location.lng;
    initMap(latitude, longitude);
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly&appid=${weatherApiKey}`)
    .then(res => res.json())
    .then(weather => {
      console.log(weather.daily)
      for (let i=0; i<5; i++) {
        renderWeather(weather.daily[i])
        console.log(weekday[new Date(weather.daily[i].dt*1000).getDay()])
      }
  });
  })
  
  
  






function createMarker(result) {
  console.log(result)
  const marker = new google.maps.Marker({
    position: result.geometry.location, 
    map: window.map,
    // icon: result.icon
  })
  console.log(marker)
}

const activitiesInputForm = document.querySelector('.activities-input-form')
activitiesInputForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const activitiesInputValue = document.querySelector('.activities-user-input')
  const inputValue = activitiesInputValue.value
  const urlEncodedInputValue = encodeURIComponent(inputValue)
  console.log(inputValue)
  console.log(latitude,longitude)
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: {lat: latitude, lng: longitude},
    radius: '2200',
    keyword: inputValue
  }, (results,status) => {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      let bounds = new google.maps.LatLngBounds()
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
        bounds.extend(results[i].geometry.location)
      }
      map.fitBounds(bounds)
    }
  });
})
