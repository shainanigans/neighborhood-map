/**********************
 *MAP
 **********************/
var map;

// Marker Model
var markers = [
    {
        title: 'Golden Lotus',
        position: {lat: -33.89840, lng: 151.17817}
    },
    {
        title: 'Gigi\'s Pizzeria',
        position: {lat: -33.89925, lng: 151.17759}
    },
    {
        title: 'Suzy Spoon\'s Vegetarian Butcher',
        position: {lat: -33.89261, lng: 151.18687}
    },
    {
        title: 'Gelato Blue',
        position: {lat: -33.89734, lng: 151.17945}
    },
    {
        title: 'Bliss & Chips',
        position: {lat: -33.89492, lng: 151.18170}
    },
    {
        title: 'Vina',
        position: {lat: -33.89976, lng: 151.17767}
    },
    {
        title: 'Lentil As Anything',
        position: {lat: -33.89966, lng: 151.17764}
    },
    {
        title: 'Basil Pizza & Pasta',
        position: {lat: -33.89343, lng: 151.18405}
    },
    {
        title: 'Newtown Pies',
        position: {lat: -33.89633, lng: 151.17984}
    },
    {
        title: 'Blossoming Lotus',
        position: {lat: -33.89449, lng: 151.18281}
    },
    {
        title: 'Green Gourmet',
        position: {lat: -33.89312, lng: 151.18421}
    },
    {
        title: 'Superfood Sushi',
        position: {lat: -33.89259, lng: 151.18548}
    }
];

var mapViewModel = {
    init: function() {
        mapView.init();
    }
};

var mapView = {
    init: function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -33.8999386, lng: 151.1714448},
            zoom: 15
        });

        // Create markers on map
        for (i = 0; i < markers.length; i++) {
            new google.maps.Marker({
                position: markers[i].position,
                title: markers[i].title,
                map: map
            });
        }
    }
};


/**********************
 *START APP
 **********************/
function startApp() {
    mapViewModel.init();
}