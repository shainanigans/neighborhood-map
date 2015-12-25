/**********************
 *MAP
 **********************/
var map;

// Marker Model
var markerModel = {
    currentMarker: null,
    markers: [
        {
            title: 'Golden Lotus',
            position: {lat: -33.89840, lng: 151.17817},
            info: '<div>test</div>'
        },
        {
            title: 'Gigi\'s Pizzeria',
            position: {lat: -33.89925, lng: 151.17759},
            info: '<div>test</div>'
        },
        {
            title: 'Suzy Spoon\'s Vegetarian Butcher',
            position: {lat: -33.89261, lng: 151.18687},
            info: '<div>test</div>'
        },
        {
            title: 'Gelato Blue',
            position: {lat: -33.89734, lng: 151.17945},
            info: '<div>test</div>'
        },
        {
            title: 'Bliss & Chips',
            position: {lat: -33.89492, lng: 151.18170},
            info: '<div>test</div>'
        },
        {
            title: 'Vina',
            position: {lat: -33.89976, lng: 151.17767},
            info: '<div>tesfdfdfdt</div>'
        },
        {
            title: 'Lentil As Anything',
            position: {lat: -33.89966, lng: 151.17764},
            info: '<div>test</div>'
        },
        {
            title: 'Basil Pizza & Pasta',
            position: {lat: -33.89343, lng: 151.18405},
            info: '<div>test</div>'
        },
        {
            title: 'Newtown Pies',
            position: {lat: -33.89633, lng: 151.17984},
            info: '<div>test</div>'
        },
        {
            title: 'Blossoming Lotus',
            position: {lat: -33.89449, lng: 151.18281},
            info: '<div>test</div>'
        },
        {
            title: 'Green Gourmet',
            position: {lat: -33.89312, lng: 151.18421},
            info: '<div>test</div>'
        },
        {
            title: 'Superfood Sushi',
            position: {lat: -33.89259, lng: 151.18548},
            info: '<div>test</div>'
        }
    ]
};

var mapViewModel = {
    init: function() {
        mapView.init();
    },

    getMarkers: function() {
      return markerModel.markers;
    },

    getCurrentMarker: function() {
        return markerModel.currentMarker;
    }
};

var mapView = {
    init: function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -33.8999386, lng: 151.1714448},
            zoom: 15
        });

        // Get the markers
        var markers = mapViewModel.getMarkers();

        // Create infoWindow
        var infowindow = new google.maps.InfoWindow();

        // Create markers on the page and attach infoWindow
        for (i = 0; i < markers.length; i++) {
            var marker = new google.maps.Marker({
                position: markers[i].position,
                title: markers[i].title,
                info: markers[i].info,
                map: map
            });

            google.maps.event.addListener(marker, 'click', function(e) {
                infowindow.setContent(this.info);
                infowindow.open(map, this);
            });
        }

        // Close infoWindow when map clicked
        google.maps.event.addListener(map, 'click', function(e) {
            infowindow.close();
        });

    }
};

/**********************
 *START APP
 **********************/
function startApp() {
    mapViewModel.init();
}