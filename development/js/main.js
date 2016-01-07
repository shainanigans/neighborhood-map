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

            markerModel.markers.sort(compare);

            return markerModel.markers;
        },

        setIndex: function() {
            // Set an index for each item, to be used on list clicks
            for (i = 0; i < markerModel.markers.length; i++) {
                markerModel.markers[i].index = i;
            }
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

            // Alphabetise the tags
            tags.sort();

            return tags;
        }
    };

    var mapView = {
        init: function() {
            this.newtown = {lat: -33.8959847, lng: 151.1788048};

            map = new google.maps.Map(document.getElementById('map'), {
                center: this.newtown,
                zoom: 16
            });

            var self = this;

            // Get the markers
            this.markers = modelController.getMarkers();

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

                google.maps.event.addListener(this.markers[i], 'click', function(e) {
                    // Offset map
                    self.offsetMap(this);

                    // Assign value of this for use with active marker
                    var that = this;
                    that.previousMarker = this;

                    // De-active previously active marker and make selected marker active
                    self.isNotActiveMarker();
                    self.isActiveMarker(that);

                    // Set active class for currently selected place
                    var htmlLinks = modelController.getHTMLList();
                    $('.nav-item--active').removeClass('nav-item--active');
                    $(htmlLinks[this.index]).addClass('nav-item--active');

                    //Adjust infowindow height in mobile views
                    var windowHeight = window.innerHeight;
                    var overlayHeight = $('#sidebar').height();

                    if (window.innerWidth < 600) {
                        $('.infowindow').css("max-height", (windowHeight - overlayHeight) * .75);
                    }
                });
            }

            // Close infoWindow when map clicked
            google.maps.event.addListener(map, 'click', function(e) {
                self.infowindow.close();
                self.isNotActiveMarker();
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
            for (j = 0; j < this.markers.length; j++) {
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
            var overlayHeight = $('#sidebar').height();

            if (windowWidth < 600)  {
                map.panTo(latLng);
                map.panBy(0, (0 - windowHeight));
            } else {
                map.panTo(latLng);
                map.panBy((0 - overlayWidth + this.infowindow.maxWidth/2), (0 - windowHeight));
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

                    $('#yelp').append(formattedInfo);
                },
                'error': function(jqXHR, error) {
                    $('#yelp').append('<p class="info">Something\'s gone wrong with our Yelp reviews. Please try again later.</p>');
                }
            });
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

                        if (googlePlace.rating > 0 && googlePlace.rating < .5) {
                            stars = '<p class="stars">&#9734;&#9734;&#9734;&#9734;&#9734;</p>';
                        } else if (googlePlace.rating >= .5 && googlePlace.rating < 1.5) {
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
        $('#view-list').click(function() {

            $('.list-container').toggle();

            $(this).text(function(i, text){
                return text === 'View List' ? 'Hide List' : 'View List';
            });

        });

        // Hide and show list when switching between mobile and desktop
        this.isMobileView = window.innerWidth < 600;

        $(window).resize(function() {
            this.newViewIsMobileView = window.innerWidth < 600;

            if (!this.isMobileView && this.newViewIsMobileView) {
                $('.list-container').hide();
                $('#view-list').text('View List');
            }

            if (this.isMobileView && !this.newViewIsMobileView) {
                $('.list-container').show();
            }

            this.isMobileView = this.newViewIsMobileView;
        });

        // Create the list of places for the sidebar
        this.markers = modelController.getMarkers();

        // Create an obervable array of the places
        this.placeList = ko.observableArray([]);

        this.makePlaceList = function() {
            // Empty the array if there are items inside
            //self.placeList().length = 0;
            self.placeList.removeAll();

            // Create the array
            for (i = 0; i < self.markers.length; i++) {
                self.placeList.push(self.markers[i]);
            }
        };
        this.makePlaceList();

        // Set the index of the list items
        modelController.setIndex();

        // This function runs when list item clicked
        this.selectPlace = function() {
            // De-active previously active marker and make selected marker active
            mapView.isNotActiveMarker();
            mapView.isActiveMarker(mapView.markers[this.index]);

            // Hide the list on mobile devices
            if (self.isMobileView || self.newViewIsMobileView) {
                $('.list-container').hide();
                $('#view-list').text('View List');
            }

            mapView.offsetMap(mapView.markers[this.index]);
        };

        // Track the current place
        this.currentPlace = ko.observable('');

        // Change to the other tab
        this.changeToFilter = function() {
            $('#filter-tab').addClass('tab-title--active');
            $('#search-tab').removeClass('tab-title--active');

            $('#filter-content').addClass('tab-content--active');
            $('#search-content').removeClass('tab-content--active');
        };

        this.changeToSearch = function() {
            $('#search-tab').addClass('tab-title--active');
            $('#filter-tab').removeClass('tab-title--active');

            $('#search-content').addClass('tab-content--active');
            $('#filter-content').removeClass('tab-content--active');
        };

        // Create an observable array of the tags
        this.tagList = ko.observableArray([]);
        var tags = modelController.getTags();

        for (i = 0; i < tags.length; i++) {
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

            // Add locations back into the array as they are found
            for (i = 0; i < self.markers.length; i++) {
                if (self.markers[i].title.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                    // Re-add the list location
                    self.placeList.push(self.markers[i]);

                    // Show the marker
                    mapView.markers[i].setVisible(true);

                    // If only one place left, make it active
                    if (self.placeList.length === 1) {
                        mapView.isActiveMarker(mapView.markers[i]);
                    }
                } else {
                    // Hide the marker
                    mapView.markers[i].setVisible(false);
                }
            }

            // Remove the active class during and after search
            $('.nav-item--active').removeClass('nav-item--active');
        };

        this.query.subscribe(self.search);

        // Filter function
        // Create an observable for the search query
        this.filterTag = ko.observable('');

        this.filter = function(value) {
            // Only run after an option has been selected
            if (value) {
                // Remove all current locations from the search
                self.makePlaceList();
                mapView.infowindow.close();

                // Add locations back into the array as they match the filterTag
                for (i = 0; i < self.markers.length; i++) {
                    if (self.markers[i].tags.indexOf(value) >= 0) {
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
            }
        };

        this.filterTag.subscribe(self.filter);

        // Reset the place list when switching between search and filter
        this.resetPlaceList = function() {
            // Add back all the places and markers to the list if they've been filtered out
            self.makePlaceList();

            for (i = 0; i < mapView.markers.length; i++) {
                mapView.markers[i].setVisible(true);
            }

            $('#search').val(null);
            $('#filter').val(null);
        }
    };

    // Initalise map
    modelController.init();

    // Activate knockout.js
    ko.applyBindings(new ViewModel());
}