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
        this.infowindow = new google.maps.InfoWindow({
            maxWidth: 300
        });

        // Create markers on the page and attach infoWindow
        for (i = 0; i < this.markers.length; i++) {
            this.markers[i] = new google.maps.Marker({
                position: this.markers[i].position,
                title: this.markers[i].title,
                info:
                    '<h3>' + this.markers[i].title + '</h3>' +
                    '<div id="info">' +
                        '<div id="yelp">' +
                            '<img class="logo" srcset="img/yelp/yelp-logo-xsmall.png 1x, img/yelp/yelp-logo-xsmall@2x.png 2x" src="img/yelp/yelp-logo-xsmall.png" alt="Yelp logo">' +
                        '</div>' +
                    '</div>',
                icon: 'img/map-marker.svg',
                map: map
            });

            google.maps.event.addListener(this.markers[i], 'click', function(e) {
                self.infowindow.setContent(this.info);
                self.infowindow.open(map, this);

                // Add Yelp info to infowindow
                self.getYelp(this);

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
    },

    getYelp: function(place) {
        // Get keys
        //require('keys.js');

        var auth = {
            consumerKey : 'GIdnV7AA9LNrjdgxijDWug',
            //consumerSecret : secretKeys.yelpConsumerSecret,
            consumerSecret : 'h8S9YHpC0tuHtpWsnA5HXbapGZk',
            accessToken : '_TF1GDa2ulcE48qsFoBNefXszmtqmT5A',
            //accessTokenSecret : secretKeys.yelpAccessTokenSecret,
            accessTokenSecret : '0I3ygsXN3MA7X3CXD_TSnwCPEPs',
            serviceProvider : {
                signatureMethod : 'HMAC-SHA1'
            }
        };

        var accessor = {
            consumerSecret : auth.consumerSecret,
            tokenSecret : auth.accessTokenSecret
        };

        parameters = [];
        parameters.push(['term', place.title]);
        parameters.push(['location', 'Sydney']);
        parameters.push(['callback', 'cb']);
        parameters.push(['oauth_consumer_key', auth.consumerKey]);
        parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
        parameters.push(['oauth_token', auth.accessToken]);
        parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
        var message = {
            'action' : 'http://api.yelp.com/v2/search',
            'method' : 'GET',
            'parameters' : parameters
        };

        OAuth.setTimestampAndNonce(message);
        OAuth.SignatureMethod.sign(message, accessor);
        var parameterMap = OAuth.getParameterMap(message.parameters);
        parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature);

        $.ajax({
            'url': message.action,
            'data': parameterMap,
            'cache': true,
            'dataType': 'jsonp',
            'jsonpCallback': 'cb',
            'success': function(data) {
                // Append to Yelp section of info div in infowindow
                var image = data.businesses[0].image_url;
                var url = data.businesses[0].url;
                var rating = data.businesses[0].rating;
                var ratingImage = data.businesses[0].rating_img_url;
                var reviewCount = data.businesses[0].review_count;
                var reviewSnippet = data.businesses[0].snippet_text;
                var formattedInfo;

                if (reviewCount > 0) {
                    formattedInfo =
                        '<img class="info-image" src="' + image + '" alt="Photo from ' + place.title + '">' +
                        '<img class="rating" src="' + ratingImage + '" alt="' + rating + ' star rating on Yelp">' +
                        '<p class="review-count">out of ' + reviewCount + ' reviews</p>' +
                        '<p class="snippet">' + reviewSnippet + '<a href="' + url + '" target="_blank">Read more</a></p>'
                    ;
                } else {
                    formattedInfo = '<p>Unfortunately there are no Yelp reviews for this listing. If you\'ve been here, why don\'t you <a href="' + url + '" target="_blank">write one</a>?</p>';
                }

                $('#yelp').append(formattedInfo);
            },
            'error': function(jqXHR, error) {
                $('#yelp').append('<p>Something\'s gone wrong with our Yelp reviews. Please try again later.</p>');
            }
        });
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
            return text === 'View List' ? 'Hide List' : 'View List';
        });

    });

    // Hide and show list when switching between mobile and desktop
    isMobileView = window.outerWidth < 600;

    $(window).resize(function() {
        var newViewIsMobileView = window.outerWidth < 600;

        if (!isMobileView && newViewIsMobileView) {
            $('.list-container').hide();
            $('#view-list').text('View List');
        }

        if (isMobileView && !newViewIsMobileView) {
            $('.list-container').show();
        }

        isMobileView = newViewIsMobileView;
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
        mapView.infowindow.close();

        // Add locations back into the array as they are found
        for (i = 0; i < self.markers.length; i++) {

            if (self.markers[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                // Re-add the list location
                self.placeList.push(self.markers[i]);

                // Show the marker
                mapView.markers[i].setVisible(true);
            } else {
                // Hide the marker
                mapView.markers[i].setVisible(false);
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