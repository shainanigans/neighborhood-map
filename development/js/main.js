/**********************
 *MAP
 **********************/
var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8999386, lng: 151.1714448},
    zoom: 15
  });
};

/**********************
 *START APP
 **********************/
function startApp() {
    initMap();
}