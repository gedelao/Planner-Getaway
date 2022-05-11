const apiKey = "AIzaSyDwFz89HsDDFl_dGv9Y04Hi41jBGrli2ak";

window.initMap = function (latitude, longitude) {
  const options = {
    zoom: 10,
    center: { lat: latitude, lng: longitude },
  };
  const map = new google.maps.Map(document.getElementById("map"), options);
};

const userInput = document.querySelector(".user-input");
const userBtn = document.querySelector(".user-btn");
const inputForm = document.querySelector(".input-form")
inputForm.addEventListener("submit", (e) => {
  e.preventDefault()
  const userValue = userInput.value;
  const urlEncodedUserValue = encodeURIComponent(userValue)
  fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${urlEncodedUserValue}&key=${apiKey}`
  )
    .then((res) => res.json())
    .then((data) => {
      latitude = data.results[0].geometry.location.lat;
      longitude = data.results[0].geometry.location.lng;
      console.log(latitude, longitude);
      initMap(latitude, longitude);
    });
});

// var autocomplete = new google.maps.places.Autocomplete(input);
// autocomplete.bindTo('bounds', map);

// varinfowindow = new google.maps.InfoWindow();
// var marker = new google.maps.Marker({
// map: map,
// anchorPoint: new google.maps.Point(0, -29)
// });

// autocomplete.addListener('place_changed', function() {
//   infowindow.close();
//   marker.setVisible(false);
//   var place = autocomplete.getPlace();
//   if (!place.geometry) {
//   window.alert("Autocomplete's returned place contains no geometry");
//   return;
// }})
