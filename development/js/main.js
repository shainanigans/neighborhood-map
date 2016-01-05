/**********************
 *MODELS
 **********************/
var map;

// Tag Model
var tagModel = {
    asian: 'Asian',
    japanese: 'Japanese',
    thai: 'Thai',
    cafe: 'Cafe',
    chinese: 'Chinese',
    yumCha: 'Yum Cha',
    omnivoreFriendly: 'Omnivore-friendly',
    italian: 'Italian',
    pizza: 'Pizza',
    multiCuisine: 'Multi-cusisine',
    vietnamese: 'Vietnamese',
    desserts: 'Desserts',
    fishAndChips: 'Fish & Chips'
};

// Marker Model
var markerModel = {
    markers: [
        {
            title: 'Golden Lotus',
            position: {lat: -33.89840, lng: 151.17817},
            tags: [tagModel.vietnamese, tagModel.asian]
        },
        {
            title: 'Gigi\'s Pizzeria',
            position: {lat: -33.89925, lng: 151.17759},
            tags: [tagModel.pizza, tagModel.asian]
        },
        {
            title: 'Suzy Spoon\'s Vegetarian Butcher',
            position: {lat: -33.89261, lng: 151.18687},
            tags: [tagModel.cafe]
        },
        {
            title: 'Gelato Blue',
            position: {lat: -33.89734, lng: 151.17945},
            tags: [tagModel.desserts, tagModel.omnivoreFriendly]
        },
        {
            title: 'Bliss & Chips',
            position: {lat: -33.89492, lng: 151.18170},
            tags: [tagModel.fishAndChips]
        },
        {
            title: 'Vina',
            position: {lat: -33.89976, lng: 151.17767},
            tags: [tagModel.vietnamese, tagModel.asian]
        },
        {
            title: 'Lentil As Anything',
            position: {lat: -33.89966, lng: 151.17764},
            tags: [tagModel.multiCuisine]
        },
        {
            title: 'Basil Pizza & Pasta',
            position: {lat: -33.89343, lng: 151.18405},
            tags: [tagModel.italian, tagModel.pizza, tagModel.omnivoreFriendly]
        },
        {
            title: 'Newtown Pies',
            position: {lat: -33.89633, lng: 151.17984},
            tags: [tagModel.cafe, tagModel.omnivoreFriendly]
        },
        {
            title: 'Blossoming Lotus',
            position: {lat: -33.89449, lng: 151.18281},
            tags: [tagModel.asian, tagModel.thai]
        },
        {
            title: 'Green Gourmet',
            position: {lat: -33.89312, lng: 151.18421},
            tags: [tagModel.asian, this.tagModel.chinese, tagModel.yumCha]
        },
        {
            title: 'Superfood Sushi',
            position: {lat: -33.89259, lng: 151.18548},
            tags: [tagModel.asian, tagModel.japanese]
        }
    ],

    setIndex: function() {
        // Set an index for each item, to be used on list clicks
        for (i = 0; i < markerModel.markers.length; i++) {
            markerModel.markers[i].index = i;
        }
    }
};

// TAB MODEL
var tabModel = {
    tabs: [
        {
            title: 'Search',
            content: '<input class="search" placeholder="Search..." type="search" data-bind="value: $root.query.bind($root), valueUpdate: \'keyup\'" autocomplete="off">'
        },
        {
            title: 'Filter',
            content: '<select class="filter" data-bind="options: $root.tagList.bind($root)"></select>'
        }
    ]
};

/**********************
 *MAP
 **********************/
var mapViewModel = {
    init: function() {
        mapView.init();
    },

    getMarkers: function() {
        return markerModel.markers;
    },

    getHTMLList: function() {
        return document.getElementsByClassName('nav-item');
    },

    getTags: function() {
        var tags = [];

        for (var key in tagModel) {
            if (Object.prototype.hasOwnProperty.call(tagModel, key)) {
                var val = tagModel[key];

                tags.push(val);
            }
        }

        return tags;
    },

    getTabs: function() {
        return tabModel.tabs;
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
                tags: this.markers[i].tags,
                map: map
            });

            google.maps.event.addListener(this.markers[i], 'click', function(e) {
                self.infowindow.setContent(this.info);
                self.infowindow.open(map, this);

                // Offset map
                self.offsetMap(this);

                // Add Yelp info to infowindow
                self.getYelp(this);

                // Assign value of this for use with marker animation
                var that = this;

                // Animate marker
                self.makeActiveMarker(that);

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

    makeActiveMarker: function(marker) {
        // Animate marker
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(){
            marker.setAnimation(null);
        }, 2140);

        // Changer marker icon
        marker.icon = 'img/map-marker-active.svg';
    },

    // Offset the map so it's not hidden by the overlay
    offsetMap: function(marker) {
        var latLng = marker.getPosition();
        var windowHeight = window.innerHeight;
        var windowWidth = window.innerWidth;
        var overlayWidth = $('#sidebar').width();

        if (isMobileView)  {
            map.panTo(latLng);
            map.panBy(0, (0 - windowHeight));
        } else {
            map.panTo(latLng);
            map.panBy((0 - overlayWidth + this.infowindow.maxWidth/2), 0);
        }
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


    this.placeList = ko.observableArray([]);

    // Create an obervable array of the places
    this.makePlaceList = function() {
        // Empty the array if there are items inside
        this.placeList().length = 0;

        // Create the array
        for (i = 0; i < markerModel.markers.length; i++) {
            self.placeList.push(markerModel.markers[i]);
        }
    };
    this.makePlaceList();

    // Set the index of the list items
    markerModel.setIndex();

    // This function runs when list item clicked
    this.selectPlace = function() {
        // Open the info window when the correct list item is clicked
        mapView.infowindow.setContent(mapView.markers[this.index].info);
        mapView.infowindow.open(map, mapView.markers[this.index]);

        mapView.makeActiveMarker(mapView.markers[this.index]);

        mapView.getYelp(mapView.markers[this.index]);

        // Hide the list on mobile devices
        if (isMobileView) {
            $('.list-container').hide();
            $('#view-list').text('View List');
        }

        mapView.offsetMap(mapView.markers[this.index]);
    };

    // Track the current place
    this.currentPlace = ko.observable('');

    // Tabs for the search and filter
    this.tabList = ko.observableArray([]);
    var tabs = mapViewModel.getTabs();

    for (i = 0; i < tabs.length; i++) {
        self.tabList.push(tabs[i]);
    }

    this.currentTab = ko.observable('');

    this.showTabContent = function(tab) {
        var i = self.tabList.indexOf(tab);
        $('.tab-content').html('').append(tabs[i].content);

        // Add back all the places and markers to the list if they've been filtered out
        self.makePlaceList();
        
        for (i = 0; i < mapView.markers.length; i++) {
            mapView.markers[i].setVisible(true);
        }
    }

    // Start the app with the first item active
    this.currentTab(tabs[0]);
    this.showTabContent(tabs[0]);

    // Create an observable array of the tags
    this.tagList = ko.observableArray([]);
    var tags = mapViewModel.getTags();

    for (i = 0; i < tags.length; i++) {
        self.tagList.push(tags[i]);
    }

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

        // Remove the active class during and after search
        $('.nav-item--active').removeClass('nav-item--active');
    };

    this.query.subscribe(self.search);
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