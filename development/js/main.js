'use strict';

function startApp() {
    /**********************
     *MODELS
     **********************/
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
        multiCuisine: 'Multi-cuisine',
        vietnamese: 'Vietnamese',
        desserts: 'Desserts',
        fishAndChips: 'Fish & Chips'
    };

    // Marker Model
    var placeModel = {
        places: [
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
                title: 'Blossoming Lotus (Green Palace)',
                position: {lat: -33.89449, lng: 151.18281},
                tags: [tagModel.asian, tagModel.thai]
            },
            {
                title: 'Green Gourmet',
                position: {lat: -33.89312, lng: 151.18421},
                tags: [tagModel.asian, tagModel.chinese, tagModel.yumCha]
            },
            {
                title: 'Superfood Sushi',
                position: {lat: -33.89259, lng: 151.18548},
                tags: [tagModel.asian, tagModel.japanese]
            }
        ]
    };

    // TAB MODEL
    var tabModel = {
        tabs: [
            {
                title: 'Search',
                content: '<input id="search" class="search" placeholder="Search..." type="search" data-bind="value: query, valueUpdate: \'keyup\'" autocomplete="off"><div id="clear-search" class="clear button" data-bind="click: resetPlaceList" title="Clear the search">x</div>'
            },
            {
                title: 'Filter',
                content: '<select id="filter" class="filter" data-bind="options: tagList, optionsCaption: \'Filter by cuisine...\', value: filterTag"></select><div id="clear-filter" class="clear button" data-bind="click: resetPlaceList" title="Clear the selection">x</div>'
            }
        ]
    };

    /**********************
     *MAP
     **********************/
    var map;

    var modelController = {
        init: function() {
            mapView.init();
        },

        getMarkers: function() {
            // Alphabetise markers
            function compare(a,b) {
                if (a.title < b.title) {
                    return -1;
                } else if (a.title > b.title) {
                    return 1;
                } else {
                    return 0;
                }
            }

            placeModel.places.sort(compare);

            return placeModel.places;
        },

        setIndex: function() {
            // Set an index for each item, to be used on list clicks
            var placeLength = placeModel.places.length;

            for (var i = 0; i < placeLength; i++) {
                placeModel.places[i].index = i;
            }
        },

        getTags: function() {
            var tags = [];

            for (var key in tagModel) {
                if (Object.prototype.hasOwnProperty.call(tagModel, key)) {
                    var val = tagModel[key];

                    tags.push(val);
                }
            }

            // Alphabetise the tags
            tags.sort();

            return tags;
        },

        getTabs: function() {
            return tabModel.tabs;
        }
    };

    var mapView = {
        init: function() {
            this.newtown = {lat: -33.8959847, lng: 151.1788048};

            map = new google.maps.Map(document.getElementById('map'), {
                center: this.newtown,
                zoom: 16
            });

            // Get the markers
            this.markers = modelController.getMarkers();

            // Create infoWindow
            this.infowindow = new google.maps.InfoWindow({
                maxWidth: 300
            });
        },

        isActiveMarker: function(marker) {
            // Animate marker
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){
                marker.setAnimation(null);
            }, 2140);

            // Change selected marker icon to the active icon
            marker.icon = 'img/map-marker-active.svg';

            // Open infowindow
            this.infowindow.setContent(marker.info);
            this.infowindow.open(map, marker);

            // Add Yelp and Google Places info to infowindow
            this.getYelp(marker);
            this.getGooglePlaces(marker);
        },

        isNotActiveMarker: function() {
            var markersLength = this.markers.length;

            for (var j = 0; j < markersLength; j++) {
                // Stop animation
                this.markers[j].setAnimation(null);

                // Set all other marker icons to the normal icon
                this.markers[j].icon = 'img/map-marker.svg';
            }
        },

        // Offset the map and modify infowindow so it's not hidden by the overlay
        offsetMap: function(marker) {
            var latLng = marker.getPosition();
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            var overlayWidth = $('#sidebar').width();

            if (windowWidth < 600)  {
                map.panTo(latLng);
                map.panBy(0, (0 - windowHeight));
            } else {
                map.panTo(latLng);
                map.panBy((0 - overlayWidth + this.infowindow.maxWidth/2), (0 - windowHeight));
            }
        },

        getYelp: function(place) {
            var auth = {
                consumerKey : 'GIdnV7AA9LNrjdgxijDWug',
                consumerSecret : 'h8S9YHpC0tuHtpWsnA5HXbapGZk',
                accessToken : '_TF1GDa2ulcE48qsFoBNefXszmtqmT5A',
                accessTokenSecret : '0I3ygsXN3MA7X3CXD_TSnwCPEPs',
                serviceProvider : {
                    signatureMethod : 'HMAC-SHA1'
                }
            };

            var accessor = {
                consumerSecret : auth.consumerSecret,
                tokenSecret : auth.accessTokenSecret
            };

            var parameters = [];
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

            var yelpErrorTimeout = setTimeout(function() {
                $('#yelp').append('<p class="info">Something\'s gone wrong with our Yelp reviews. Please try again later.</p>');
            }, 8000);

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
                            '<div class="info">' +
                                '<img class="info-image" src="' + image + '" alt="Photo from ' + place.title + '">' +
                                '<img class="rating" src="' + ratingImage + '" alt="' + rating + ' star rating on Yelp">' +
                                '<p class="review-count">out of ' + reviewCount + ' reviews</p>' +
                                '<h4>Top Review:</h4>' +
                                '<p class="snippet">' + reviewSnippet +  '</p>' +
                                '<p class="centered-element-container"><a class="button--source-link" href="' + url + '" target="_blank">Read more</a></p>' +
                            '</div>' +
                            '<div class="logo-container">' +
                                '<img class="logo" srcset="img/yelp/yelp-logo-xsmall.png 1x, img/yelp/yelp-logo-xsmall@2x.png 2x" src="img/yelp/yelp-logo-xsmall.png" alt="Yelp logo">' +
                            '</div>'
                        ;
                    } else {
                        formattedInfo = '<p class="info">Unfortunately there are no Yelp reviews for this listing. If you\'ve been here, why don\'t you <a href="' + url + '" target="_blank">write one</a>?</p>';
                    }

                    clearTimeout(yelpErrorTimeout);

                    $('#yelp').append(formattedInfo);
                }
            });

            return false;
        },

        getGooglePlaces: function(place) {
            // Start service
            var service = new google.maps.places.PlacesService(map);

            // Use Nearby Search to get the Place ID
            service.nearbySearch({
                location: mapView.newtown,
                radius: 1000,
                keyword: place.title,
            }, callback);

            function callback(results, status) {
                var formattedInfo;

                // Use the Place ID to get Place Details
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    service.getDetails({placeId: results[0].place_id}, function(googlePlace, status) {
                        // Get number of stars to display based on rating
                        var stars;

                        if (googlePlace.rating > 0 && googlePlace.rating < 0.5) {
                            stars = '<p class="stars">&#9734;&#9734;&#9734;&#9734;&#9734;</p>';
                        } else if (googlePlace.rating >= 0.5 && googlePlace.rating < 1.5) {
                            stars = '<p class="stars">&#9733;&#9734;&#9734;&#9734;&#9734;</p>';
                        } else if (googlePlace.rating >= 1.5 && googlePlace.rating < 2.5) {
                            stars = '<p class="stars">&#9733;&#9733;&#9734;&#9734;&#9734;</p>';
                        } else if (googlePlace.rating >= 2.5 && googlePlace.rating < 3.5) {
                            stars = '<p class="stars">&#9733;&#9733;&#9733;&#9734;&#9734;</p>';
                        } else if (googlePlace.rating >= 3.5 && googlePlace.rating < 4.5) {
                            stars = '<p class="stars">&#9733;&#9733;&#9733;&#9733;&#9734;</p>';
                        } else {
                            stars = '<p class="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</p>';
                        }

                        if (googlePlace.user_ratings_total > 0) {
                            formattedInfo =
                                '<div class="info">' +
                                    stars +
                                    '<p class="review-count">out of ' + googlePlace.user_ratings_total + ' ratings</p>' +
                                    '<h4>Top Review:</h4>' +
                                    '<p class="snippet">' + googlePlace.reviews[0].text + '</p>' +
                                    '<p class="centered-element-container"><a class="button--source-link" href="' + googlePlace.url + '" target="_blank">Read more</a></p>' +
                                '</div>' +
                                '<div class="logo-container">' +
                                    '<img class="logo" srcset="img/google-places/powered_by_google_on_white.png 1x, img/google-places/powered_by_google_on_white@2x.png 2x" src="img/google-places/powered_by_google_on_white.png" alt="Powered by Google">' +
                                '</div>'
                            ;
                        } else {
                            formattedInfo = '<p class="info">Unfortunately there are no Google Places reviews for this listing. If you\'ve been here, why don\'t you <a href="' + googlePlace.url + '" target="_blank">write one</a>?</p>';
                        }

                        $('<p class="address">' + googlePlace.formatted_address + '</p>').insertAfter('h2');

                        $('#google-places').append(formattedInfo);
                    });
                } else {
                    formattedInfo = '<p class="info">Something\'s wrong with Google Places. Please try again later.</p>';

                    $('#google-places').append(formattedInfo);
                }
            }
        }
    };

    /**********************
     *SIDEBAR
     **********************/
    function ViewModel() {
        // Map 'self' to ViewModel
        var self = this;

        // Show list when button clicked on mobile
        this.buttonText = ko.observable('View List');
        this.listIsVisible = ko.observable(true);
        this.titleIsVisible = ko.observable(true);

        this.changeButton = function() {
            this.titleIsVisible = ko.observable(false);

            if (self.buttonText() === 'View List') {
                self.buttonText('Hide List');
            } else {
                self.buttonText('View List');
            }
        };

        // Hide and show list when switching between mobile and desktop
        this.isMobileView = window.innerWidth < 600;

        if (this.isMobileView) {
            self.listIsVisible(false);
        }

        $(window).resize(function() {
            this.newViewIsMobileView = window.innerWidth < 600;

            if (!this.isMobileView && this.newViewIsMobileView) {
                self.listIsVisible(false);
                self.buttonText('View List');
            }

            if (this.isMobileView && !this.newViewIsMobileView) {
                self.listIsVisible(true);
            }

            this.isMobileView = this.newViewIsMobileView;
        });

        // Create the list of places for the sidebar
        this.markers = modelController.getMarkers();
        var markersLength = this.markers.length;

        // Create an obervable array of the places
        this.placeList = ko.observableArray([]);

        this.makePlaceList = function() {
            // Empty the array if there are items inside
            self.placeList.removeAll();

            // Create the array
            for (var i = 0; i < markersLength; i++) {
                self.placeList.push(self.markers[i]);
            }
        };
        this.makePlaceList();

        // Track the current place
        this.currentPlace = ko.observable('');

        // Event listener for clicking on marker
        var markerListener = function(marker) {
            google.maps.event.addListener(marker, 'click', function(e) {
                // Offset map
                mapView.offsetMap(this);

                // Assign value of this for use with active marker
                var that = this;

                // De-active previously active marker and make selected marker active
                mapView.isNotActiveMarker();
                mapView.isActiveMarker(that);

                // Set active class for currently selected place
                self.currentPlace(marker.title);

                //Adjust infowindow height in mobile views
                var windowHeight = window.innerHeight;
                var overlayHeight = $('#sidebar').height();

                if (window.innerWidth < 600) {
                    $('.infowindow').css("max-height", (windowHeight - overlayHeight) * 0.7);
                    self.titleIsVisible(false);
                }
            });
        };

        // Create markers on the page and attach infoWindow
        for (var i = 0; i < markersLength; i++) {
            this.markers[i] = new google.maps.Marker({
                position: this.markers[i].position,
                title: this.markers[i].title,
                info:
                    '<div class="infowindow">' +
                        '<h2>' + this.markers[i].title + '</h2>' +
                        '<div>' +
                            '<div id="yelp">' +
                                '<h3 class="source-title">Yelp</h3>' +
                            '</div>' +
                            '<div id="google-places">' +
                                '<h3 class="source-title">Google Places</h3>' +
                            '</div>' +
                        '</div>' +
                    '</div>',
                icon: 'img/map-marker.svg',
                tags: this.markers[i].tags,
                map: map
            });

            markerListener(this.markers[i]);
        }

        // Close infoWindow when map clicked
        google.maps.event.addListener(map, 'click', function(e) {
            mapView.infowindow.close();
            mapView.isNotActiveMarker();
        });

        // Set the index of the list items
        modelController.setIndex();

        // This function runs when list item clicked
        this.selectPlace = function(place) {
            // De-active previously active marker and make selected marker active
            var index = self.placeList.indexOf(place);

            mapView.isNotActiveMarker();
            mapView.isActiveMarker(self.markers[index]);

            // Hide the list on mobile devices
            if (self.isMobileView || self.newViewIsMobileView) {
                self.listIsVisible(false);
                self.buttonText('View List');
            }

            mapView.offsetMap(self.markers[index]);

            // Hide the title and adjust infowindow height in mobile views
            var windowHeight = window.innerHeight;
            var overlayHeight = $('#sidebar').height();

            if (self.isMobileView) {
                $('.infowindow').css("max-height", (windowHeight - overlayHeight) * 0.7);
                self.titleIsVisible(false);
            }
        };

        // Tabs for the search and filter
        this.tabList = ko.observableArray([]);
        var tabs = modelController.getTabs();
        var tabsLength = tabs.length;

        for (var i = 0; i < tabsLength; i++) {
            self.tabList.push(tabs[i]);
        }

        this.currentTab = ko.observable('');

        // Start the app with the first item active
        this.currentTab(tabs[0]);

        // Create an observable array of the tags
        this.tagList = ko.observableArray([]);
        var tags = modelController.getTags();
        var tagsLength = tags.length;

        for (var i = 0; i < tagsLength; i++) {
            self.tagList.push(tags[i]);
        }

        // Search function
        // Live search method from opensoul.org/2011/06/23/live-search-with-knockoutjs/
        // Create an observable for the search query
        this.query = ko.observable('');

        this.search = function(value) {
            // Remove all current locations from the search
            self.placeList.removeAll();
            mapView.infowindow.close();
            mapView.isNotActiveMarker();

            // Add locations back into the array as they are found
            for (var i = 0; i < markersLength; i++) {
                if (self.markers[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                    // Re-add the list location
                    self.placeList.push(self.markers[i]);

                    // Show the marker
                    mapView.markers[i].setVisible(true);

                    // Recenter the map
                    map.setCenter(mapView.newtown);
                } else {
                    // Hide the marker
                    mapView.markers[i].setVisible(false);
                }
            }

            // Remove the active class during and after search
            self.currentPlace(null);
        };

        this.query.subscribe(self.search);

        // Filter function
        // Create an observable for the search query
        this.filterTag = ko.observable('');

        this.filter = function(value) {
            // Only run after an option has been selected
            if (value) {
                // Remove all current locations from the search
                self.placeList.removeAll();
                mapView.infowindow.close();
                mapView.isNotActiveMarker();

                // Add locations back into the array as they match the filterTag
                for (var i = 0; i < markersLength; i++) {
                    if (self.markers[i].tags.indexOf(value) >= 0) {
                        // Re-add the list location
                        self.placeList.push(self.markers[i]);

                        // Show the marker
                        mapView.markers[i].setVisible(true);

                        // Recenter the map
                        map.setCenter(mapView.newtown);
                    } else {
                        // Hide the marker
                        mapView.markers[i].setVisible(false);
                    }
                }

                // Remove the active class during and after search
                self.currentPlace(null);
            }
        };

        this.filterTag.subscribe(self.filter);

        // Reset the place list when switching between search and filter
        this.resetPlaceList = function() {
            // Add back all the places and markers to the list if they've been filtered out
            self.makePlaceList();

            for (var i = 0; i < markersLength; i++) {
                mapView.markers[i].setVisible(true);
            }

            // Reset the list, search field, and active filter
            self.currentPlace('');
            self.query('');
            self.filterTag('');

            // Recenter the map
            map.setCenter(mapView.newtown);

            // Close the infowindow
            mapView.infowindow.close();

            // Deactivate the marker
            mapView.isNotActiveMarker();
        };
    }

    // Initalise map
    modelController.init();

    // Activate knockout.js
    var VM = new ViewModel();
    ko.applyBindings(VM);

    // Bind to dynamically generated content
    ko.applyBindings(VM, document.getElementById('search'));
    ko.applyBindings(VM, document.getElementById('filter'));
    ko.applyBindings(VM, document.getElementById('clear-search'));
    ko.applyBindings(VM, document.getElementById('clear-filter'));
}