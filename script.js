function initMap() {
const options = {
    zoom: 8,
    center: {lat: 42.3601, lng:-71.0589}    
}
const map = new google.maps.Map(document.getElementById('map'), options)
}