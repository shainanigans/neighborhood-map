/**********************
 *MAP
 **********************/
var map;

var markers = [
    {
        title: 'Golden Lotus',
        position: {lat: -33.89840, lng: 151.17817}
    },
    {
        title: 'Gigi\'s Pizzeria',
        position: {lat: -33.89925, lng: 151.17759}
    }
];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8999386, lng: 151.1714448},
        zoom: 15
    });

    for (i = 0; i < markers.length; i++) {
        new google.maps.Marker({
            position: markers[i].position,
            title: markers[i].title,
            map: map
        });
    }

};

/**********************
 *START APP
 **********************/
function startApp() {
    initMap();
}