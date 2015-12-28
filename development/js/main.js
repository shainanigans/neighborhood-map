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
                info: '<h3>' + markers[i].title + '</h3>' + '<div id="info"></div>',
                icon: 'img/map-marker.svg',
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
 *SIDEBAR
 **********************/
function ViewModel() {
    // Map 'self' to ViewModel
    var self = this;

    // Create an obervable array of the places
    this.placeList = ko.observableArray([]);

    for (i = 0; i < markerModel.markers.length; i++) {
        self.placeList.push(markerModel.markers[i]);
    }

    this.openInfoWindow = function() {
        // How can I link up my <li> with the right marker?
    }

};

/**********************
 *START APP
 **********************/
function startApp() {
    // Set up map
    mapViewModel.init();

    // Activate knockout.js
    ko.applyBindings(new ViewModel());
}