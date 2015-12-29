/**********************
 *MAP
 **********************/
var map;

// Marker Model
var markerModel = {
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
    ],

    setIndex: function() {
        // Set an index for each item, to be used on list clicks
        for (i = 0; i < markerModel.markers.length; i++) {
            markerModel.markers[i].index = i;
        }
    }
};

var mapViewModel = {
    init: function() {
        mapView.init();
    },

    getMarkers: function() {
      return markerModel.markers;
    },

    getHTMLList: function() {
        return document.getElementsByClassName('nav-item');
    }
};

var mapView = {
    init: function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: -33.8959847, lng: 151.1788048},
            zoom: 16
        });

        var self = this;

        // Get the markers
        this.markers = mapViewModel.getMarkers();

        // Create infoWindow
        this.infowindow = new google.maps.InfoWindow();

        // Create markers on the page and attach infoWindow
        for (i = 0; i < this.markers.length; i++) {
            this.markers[i] = new google.maps.Marker({
                position: this.markers[i].position,
                title: this.markers[i].title,
                info: '<h3>' + this.markers[i].title + '</h3>' + '<div id="info"></div>',
                icon: 'img/map-marker.svg',
                map: map
            });

            google.maps.event.addListener(this.markers[i], 'click', function(e) {
                self.infowindow.setContent(this.info);
                self.infowindow.open(map, this);

                // Assign value of this for use with marker animation
                var that = this;

                // Animate marker
                self.animateMarker(that);

                // Set active class for currently selected place
                var htmlLinks = mapViewModel.getHTMLList();
                $('.nav-item--active').removeClass('nav-item--active');
                $(htmlLinks[this.index]).addClass('nav-item--active');
            });
        }

        // Close infoWindow when map clicked
        google.maps.event.addListener(map, 'click', function(e) {
            self.infowindow.close();
        });
    },

    animateMarker: function(marker) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){
                marker.setAnimation(null);
            }, 2140);
    }
};

/**********************
 *SIDEBAR
 **********************/
function ViewModel() {
    // Map 'self' to ViewModel
    var self = this;

    // Show list when button clicked on mobile
    $('#view-list').click(function() {

        $('.list-container').toggle();

        $(this).text(function(i, text){
            return text === "View List" ? "View Map" : "View List";
        });

    });

    // Create an obervable array of the places
    this.placeList = ko.observableArray([]);

    for (i = 0; i < markerModel.markers.length; i++) {
        self.placeList.push(markerModel.markers[i]);
    }

    // Set the index of the list items
    markerModel.setIndex();

    // Open the info window when the correct list item is clicked
    this.openInfoWindow = function() {
        mapView.infowindow.setContent(mapView.markers[this.index].info);
        mapView.infowindow.open(map, mapView.markers[this.index]);

        mapView.animateMarker(mapView.markers[this.index]);
    };

    // Track the current place
    this.currentPlace = ko.observable('');

    // Create an observable for the search query
    this.query = ko.observable('');

    // Get the markers for the search function
    this.markers = mapViewModel.getMarkers();

    // Search function
    // Live search method from opensoul.org/2011/06/23/live-search-with-knockoutjs/
    this.search = function(value) {
        // Remove all current locations from the search
        self.placeList.removeAll();

        // Add locations back into the array as they are found
        for (i = 0; i < self.markers.length; i++) {
            if(self.markers[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                self.placeList.push(self.markers[i]);
            }
        }
    };

    this.query.subscribe(this.search);
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