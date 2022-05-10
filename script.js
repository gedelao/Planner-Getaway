window.initMap = function () {
  const options = {
    zoom: 8,
    center: { lat: 50.753746, lng: -90.38633 },
  };
  const map = new google.maps.Map(document.getElementById("map"), options);
};

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


// const userInput = document.querySelector(".user-input");
// const userBtn = document.querySelector(".user-btn");
// userBtn.addEventListener("submit", (e) => {
//   const userValue = userInput.value;
// });