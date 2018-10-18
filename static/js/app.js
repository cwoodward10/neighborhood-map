// Style for the map from snazzymaps
var style = [
    {
        "featureType": "all",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "weight": "2.00"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#9c9c9c"
            }
        ]
    },
    {
        "featureType": "all",
        "elementType": "labels.text",
        "stylers": [
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "color": "#f2f2f2"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "landscape.man_made",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 45
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#eeeeee"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#7b7b7b"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            {
                "color": "#46bcec"
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#c8d7d4"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "color": "#070707"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            }
        ]
    }
]

// Create a map variable
var map;
var coordKey = 'QwXuhSWviuoqAJrpHELtLcT2WMs6bKp_8NgTVqybk_M'

//set up initial data points
var models = {
  centerLocation: {lat: 37.797110, lng:  -122.400339},
  startLocality: 'San Francisco',
  showPlaces: false,
  showRoutes: false,
  showCurbs: false,
  showAbout: false,
  noPlacesMessage: true,
  initTravelMode: 'DRIVING',
  renderCurbs: false,
  showMyPlaces: false,
}

var defaultPlaces = [
  'Coit Tower',
  'AT&T Park',
  'San Francisco Museum of Modern Art',
  "The Monk's Kettle",
  'Grace Cathedral'
]

// regex pattern for parsing the place type from the marker's icon object
var locationsPattern = /\/\/.+\/(.+)(?=-\d+\.png)/;

//setup the map
function initMap(viewModel) {

  map = new google.maps.Map(document.getElementById('map'), {
    center: models.centerLocation,
    zoom: 15,
    mapTypeControl: false,
    zoomControl: false,
    scaleControl: true,
    streetViewControl: true,
    streetViewControlOptions: {
        position: google.maps.ControlPosition.BOTTOM_CENTER
    }
  });
  // From Google's Documentation
  // Create styled map object and pass along styling options
  var styledMapType = new google.maps.StyledMapType(
    style,
    {name: 'Styled Map'}
  );

  // Associate styled map with the map and set it to display
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');

  var directionsDisplay = new google.maps.DirectionsRenderer();
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

  document.getElementById('get-route').addEventListener('click', function() {
    viewModel.routeOrigin(document.getElementById('get-route-origin').value);
    viewModel.routeDestination(document.getElementById('get-route-destination').value);
    if (viewModel.travelMode()==='TRANSIT'){
      directionsDisplay.setMap(null);
      document.getElementById('directionsPanel').innerHTML = "";
      viewModel.coordDisplayDirections(
        viewModel.routeOrigin(),
        viewModel.routeDestination()
      );
    } else {
      if (viewModel.transitRoutePolylines().length > 0) {
        viewModel.transitRoutePolylines().forEach(function(route) {
          viewModel.hidePolylines(route.route);
        })
        viewModel.transitRoutes([]);
      };
      directionsDisplay.setMap(map);
      viewModel.googleDisplayDirections(
        directionsDisplay,
        viewModel.routeOrigin(),
        viewModel.routeDestination(),
        viewModel.travelMode()
      );
    }
  });
  // clear any directions shown on the screen
  document.getElementById('clear-routes').addEventListener('click', function() {
    directionsDisplay.setMap(null);
    document.getElementById('directionsPanel').innerHTML = "";
    // clear any coord routes
    if (viewModel.transitRoutePolylines().length > 0) {
      viewModel.transitRoutePolylines().forEach(function(route) {
        viewModel.hidePolylines(route.route);
      })
      viewModel.transitRoutes([]);
    };
    viewModel.coordDirectionsMarkers().forEach(function(marker) {
      marker.setMap(null);
    })
  });

  var originAutoComplete = new google.maps.places.Autocomplete(
    document.getElementById('get-route-origin')
  );
  originAutoComplete.bindTo('bounds', map);

  var destinationAutoComplete = new google.maps.places.Autocomplete(
    document.getElementById('get-route-destination')
  );
  destinationAutoComplete.bindTo('bounds',map);

  var searchBox = new google.maps.places.SearchBox(
    document.getElementById('destination-places')
  );

  // bias searchBox to the map's current viewport
  map.addListener('bounds_changed', function() {
    viewModel.mapBounds(map.getBounds());
    searchBox.setBounds(viewModel.mapBounds());
    if (viewModel.renderCurbs() === true) {
      viewModel.renderCoordCurbs('ALL');
    }
  });

  // listen for the event when the user selects a prediction from the picklist
  searchBox.addListener('places_changed', function()  {
    viewModel.searchBoxPlaces(this);
  });

  // listen for the event fired when user selects a prediction and clicks go
  document.getElementById('destination-places-go').addEventListener('click', function() {
    var query = document.getElementById('destination-places').value
    viewModel.textSearchPlaces(query);
  });
}

//set up the knockout ViewModel
var viewModel = function() {

  //store self for later to avoid contradictions
  var self = this;

  // set up the menu
  self.showPlaces = ko.observable(models.showPlaces);
  self.showRoutes = ko.observable(models.showRoutes);
  self.showCurbs = ko.observable(models.showCurbs);
  self.showAbout = ko.observable(models.showAbout);

  self.renderCurbs = ko.observable(models.renderCurbs);
  self.showMyPlaces = ko.observable(models.showMyPlaces);
  self.searchedPlaces = ko.observableArray();

  self.noPlacesMessage = ko.observable(models.noPlacesMessage);

  // set up map observables
  self.mapBounds = ko.observable();

  self.placeMarkers = ko.observableArray();
  self.myPlaces = ko.observableArray();
  self.deconstructedMarkers = ko.observableArray();
  self.myPlaceIDs = ko.observableArray();
  self.filteredPlaces = ko.observableArray();
  self.placeFilterList = ko.observableArray([]);
  self.selectedFilter = ko.observable();

  self.routeOrigin = ko.observable();
  self.routeDestination = ko.observable();
  self.coordDirectionsMarkers = ko.observableArray();
  self.currentRoutes = ko.observableArray();
  self.travelMode = ko.observable(models.initTravelMode);
  self.transitRoutes = ko.observableArray();
  self.transitRoutePolylines = ko.observableArray();

  self.bikeColor = ko.observable('#00FF48');
  self.busColor = ko.observable('#FF0000');
  self.railColor = ko.observable('#FF530D');
  self.metroColor = ko.observable('#E82C0C');
  self.ferryColor = ko.observable('#1485CC');
  self.walkColor = ko.observable('#FF0DFF');

  self.curbPolylines = ko.observableArray();
  self.noneColor = ko.observable('#FF0000');
  self.parkingColor = ko.observable('#00FF48');
  self.loadPassengersColor = ko.observable('#0971B2');
  self.loadGoodsColor = ko.observable('#FFFC19');

  // Toggle whether the menus on the page are open or not
  self.toggleMenuItem = function(menuItem) {
    menuItem(!menuItem());
  };

  self.setTravelMode = function(travelMode) {
    self.travelMode(travelMode);
  };

  // convert a duration_s into duration in hours and minutes
  // got this from a stackoverflow answer
  self.convertDuration = function(seconds) {
    return Math.ceil(seconds/60);
  };

  self.addOne = function(number) {
    var newNumber = parseInt(number(), 10);
    return newNumber += 1;
  };

  self.toMiles = function(km) {
    let miles = km * 0.6214;
    return miles.toFixed(2)
  };

  // zooms to the particular area on the map
  self.zoomToArea = function(address) {
    var geocoder = new google.maps.Geocoder();
    if (address === '') {
      window.alert('You must enter an area or address.')
    } else {
      geocoder.geocode(
        { address: address,
          componentRestrictions: {locality: models.startLocality}
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            map.setZoom(18);
          } else {
            window.alert('We could not find that location');
          }
        }
      );
    }
  };

  self.zoomToPosition = function(position) {
    if (position === '') {
      window.alert('You must enter an area or address.')
    } else {
      map.setCenter(position);
      map.setZoom(18);
    }
  };

  // creating a promise so that we can run successive .then() statements on the
  // callbacks
  self.promiseLatLng = function(address) {
    return new Promise(function(resolve, reject) {
      var geocoder = new google.maps.Geocoder();
      if (address === '') {
        window.alert('You must enter an area or address.')
      } else {
        geocoder.geocode({ address: address,
          componentRestrictions: {locality: models.startLocality}
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            let coords = results[0].geometry.location;
            console.log(coords.lat(), coords.lng());
            resolve(coords)
          } else {
            reject(status);
          }
        })
      }
    });
  };

  self.returnLatLng  = function(address) {
    console.log('running address: ' + address);
    var geocoder = new google.maps.Geocoder();
    if (address === '') {
      window.alert('You must enter an area or address.')
    } else {
      geocoder.geocode(
        { address: address,
          componentRestrictions: {locality: models.startLocality}
        }, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            let coords = results[0].geometry.location;
            console.log(coords.lat(), coords.lng());
            return coords
          } else {
            window.alert('We could not find that location');
          }
        }
      );
    }
  };

  // function called when clicking a dropdown option on the searchbox
  self.searchBoxPlaces = function(searchBox) {
    // clear previously search places
    self.searchedPlaces([]);
    // clear previous markers
    self.hideMarkers(self.placeMarkers());
    var places = searchBox.getPlaces();
    // updated searched places to new search
    self.searchedPlaces(places);
    // for each place, get the icon, name and location
    self.createMarkersForPlaces(places);
    if (places.length == 0) {
      window.alert('We did not find any places matching that search');
    }
  };

  // function called when submitting a searchbox search
  self.textSearchPlaces = function(query) {
    var bounds = map.getBounds();
    // clear previously search places
    self.searchedPlaces([]);
    // clear previous markers
    self.hideMarkers(self.placeMarkers());
    var placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
      query: query,
      bounds: bounds
    }, function(results, status) {
      if (status=== google.maps.places.PlacesServiceStatus.OK) {
        self.createMarkersForPlaces(results);
        // updated searched places to new search
        self.searchedPlaces(results);
      }
    });
  };

  self.makeMarkerIcon = function() {
    var markerImage = {
        url: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png"
      };
    return markerImage
  };

  // hides a set of markers
  self.hideMarkers = function(markers) {
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  };

  // hides a set of markers
  self.hidePolylines = function(polylines) {
    for (var i = 0; i < polylines.length; i++) {
      polylines[i].setMap(null);
    }
  };

  self.toggleBounce = function(currentMarker) {
    if (currentMarker.getAnimation() !== null) {
      currentMarker.setAnimation(null);
    } else {
      currentMarker.setAnimation(google.maps.Animation.BOUNCE);
    }
  };

  self.flipRoute = function() {
    let oldOrigin = vm.routeOrigin();
    vm.routeOrigin(vm.routeDestination());
    vm.routeDestination(oldOrigin);
  };

  self.startDirections = function(address) {
    self.toggleMenuItem(self.showRoutes);
    self.routeDestination(address);
  };

  self.createMarkersForPlaces = function(places) {
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0; i < places.length; i++) {
      var place = places[i];
      var icon = {
        url: place.icon,
        size: new google.maps.Size(35,35),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(15,34),
        scaledSize: new google.maps.Size(25,25)
      };
      //create a marker for each place
      var marker = new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location,
        id: place.place_id,
        animation: google.maps.Animation.DROP
      });
      marker.addListener('mouseover', function() {
        this.setIcon({
            url: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png",
          });
        self.toggleBounce(this);
      });

      marker.addListener('mouseout', function() {
        this.setIcon(icon);
        self.toggleBounce(this);
      });

      // Create a single info window to be used with the place details info
      var placeInfoWindow = new google.maps.InfoWindow();
      // if a marker is clicked, do a details search on it in next function/
      marker.addListener('click', function() {
        if (placeInfoWindow.marker == this) {
          console.log('This infowindow already is on this marker');
        } else {
          self.getPlacesDetails(this, placeInfoWindow);
        }
      });

      self.placeMarkers.push(marker);

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    }
    map.fitBounds(bounds);
  };

  // this is the place details search
  // it is only executed when a marker is selected, indicating that the user
  // wants more details about a place and willing to wait for the query to load
  self.getPlacesDetails = function(marker, infowindow) {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails({
      placeId: marker.id
      }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          var stringCoords = ''
          stringCoords += '{lat: ' + place.geometry.location.lat() + ','
          stringCoords +=  'lng: ' + place.geometry.location.lng() + '}';
          infowindow.marker = marker;
          var innerHTML = '<div>';
          if (place.name) {
            innerHTML += '<h3 class="text-lobster clear-formatting"><strong>'
            innerHTML += place.name +'</strong></h3>';
          }
          if (place.formatted_address) {
            innerHTML += '<br>'+ place.formatted_address;
          }
          if (place.formatted_phone_number) {
            innerHTML += '<br>'+ place.formatted_phone_number;
          }
          if (place.photos) {
            innerHTML += '<br><br><img src="'+ place.photos[0].getUrl(
              {maxHeight: 100, maxWidth: 200}) + '">';
          }
          innerHTML += '</div><hr>'
          innerHTML += '<input type=\"button\" value=\"Get Directions\" onclick=' +
                      '\"vm.startDirections(&quot;' + place.formatted_address +
                      '&quot;);\"></input>';
          innerHTML += '<input type=\"button\" value=\"Add to My Places\" onclick=' +
                      '\"vm.addToMyPlaces(&quot;' + marker.id +
                      '&quot;);\"></input>';
          innerHTML += '<input type=\"button\" value=\"Show Curbs\" onclick=' +
                      '\"vm.renderCoordCurbs(&quot;' + place.formatted_address +
                      '&quot;);\"></input>';
          infowindow.setContent(innerHTML);
          infowindow.open(map, marker);
          // make sure this marker property is cleared if the infowindow is closed
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        } else if (status === google.maps.places.PlacesServiceStatus.INVALID_REQUEST) {
          console.log('invalid request');
        } else if (status === google.maps.places.PlacesServiceStatus.NOT_FOUND) {
          console.log('not found');
        } else if (status === google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
          console.log('zero results');
        } else if (status === google.maps.places.PlacesServiceStatus.REQUEST_DENIED) {
          console.log('request denied');
        } else {
          console.log('unknown or over limit');
        };
    })
  };

  // function that adds a place type to the filterable list
  self.addPlaceToFilter = function(marker) {
    let check = self.placeFilterList().indexOf(marker.icon.url);
    if (check == -1) {
      self.placeFilterList.push(marker.icon.url);
    }
  };

  // add a place to "My Places" observable and in localStorage
  self.addToMyPlaces = function(markerID) {
    if ( self.myPlaceIDs().includes(markerID) ) {
      window.alert('You already have this place in your places')
    } else {
      self.placeMarkers().forEach(function(marker) {
        if ( marker.id === markerID) {
          self.myPlaces.push(marker);
          self.addPlaceToFilter(marker);
          self.myPlaceIDs.push(marker.id);
          self.noPlacesMessage(false);
          self.deconstructedMarkers.push(self.deconstructMarker(marker))
          localStorage.setItem('myPlaces', JSON.stringify(
            self.deconstructedMarkers()
          ));
        }
      })
    }
  };

  self.deconstructMarker = function(marker){
    var deconstructed = {
      icon: marker.icon,
      title: marker.title,
      position: marker.position,
      id: marker.id,
      animation: marker.animation
    };
    return deconstructed;
  };

  self.createMarkerFromPlaceRequest = function(place) {
    return new Promise(function(resolve, reject) {
      console.log(place);
      var service = new google.maps.places.PlacesService(map);
      var request = {
        query: place,
        fields: ['icon', 'geometry', 'name', 'place_id']
      }
      service.findPlaceFromQuery(request, function(result, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          var icon = {
            url: result[0].icon,
            size: new google.maps.Size(35,35),
            origin: new google.maps.Point(0,0),
            anchor: new google.maps.Point(15,34),
            scaledSize: new google.maps.Size(25,25)
          };
          //create a marker for each place
          var marker = new google.maps.Marker({
            map: null,
            icon: icon,
            title: result[0].name,
            position: result[0].geometry.location,
            id: result[0].place_id,
            animation: null,
          });
          resolve(marker);
        } else {
          reject(function(error) {
            console.log('error')
          })
        };
      });
    });
  }

  self.getDefaultPlaces = function() {
    defaultPlaces.forEach(function(place) {
      self.createMarkerFromPlaceRequest(place).then(function(result) {
        self.myPlaces.push(result);
        self.filteredPlaces(self.myPlaces());
      }).catch(function(error) {
      });
    })
  };

  // retrieves an places that might have been saved last time
  self.retrieveMyPlaces = function() {
    var retrievedMarkers = localStorage.getItem('myPlaces');
    self.deconstructedMarkers(JSON.parse(retrievedMarkers));
    if (self.deconstructedMarkers()) {
      self.noPlacesMessage(false);
      self.deconstructedMarkers().forEach(function(deconstructedMarker) {
        var reconstructed = new google.maps.Marker({
          map: null,
          icon: deconstructedMarker.icon,
          title: deconstructedMarker.title,
          position: deconstructedMarker.position,
          id: deconstructedMarker.id,
          animation: null,
        });
        self.myPlaces.push(reconstructed);
        self.addPlaceToFilter(reconstructed);
      })
    };
    // sets up the default places for the app
    self.getDefaultPlaces();
    // set the list of filtered places equal to "My Places to start
    self.filteredPlaces(self.myPlaces());
  };

  self.toggleMyPlaces = function() {
    if (vm.showMyPlaces() === false) {
      vm.showMyPlaces(true);
      vm.hideMarkers(vm.placeMarkers());
      let myPlaces = vm.filteredPlaces();
      self.placePlaceMarkers(myPlaces);
    } else {
      vm.hideMarkers(vm.myPlaces());
      vm.showMyPlaces(false);
    }
  };

  self.placePlaceMarkers = function(places) {
    for (var i = 0; i < places.length; i++) {
      var marker = places[i];
      marker.setAnimation(google.maps.Animation.DROP);
      marker.setMap(map);
      let icon = marker.icon;
      marker.addListener('mouseover', function() {
        this.setIcon({
            url: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png",
          });
        vm.toggleBounce(this);
      });
      marker.addListener('mouseout', function() {
        this.setIcon(icon);
        vm.toggleBounce(this);
      });

      // Create a single info window to be used with the place details info
      var placeInfoWindow = new google.maps.InfoWindow();
      // if a marker is clicked, do a details search on it in next function/
      marker.addListener('click', function() {
        if (placeInfoWindow.marker == this) {
          console.log('This infowindow already is on this marker');
        } else {
          vm.getPlacesDetails(this, placeInfoWindow);
        }
      });
    };
  }

  self.selectedFilter.subscribe(function(newValue) {
    self.hideMarkers(self.filteredPlaces());
    // reset the filtered list back to the initial list
    self.filteredPlaces(self.myPlaces());
    if (newValue == undefined) {
      console.log('no filter applied');
    } else {
      // iterate through the filtered list to check for if filter applies
      let newList = [];
      self.filteredPlaces().forEach(function(place){
        if (place.icon.url === newValue) {
          newList.push(place)
        };
      })
      self.filteredPlaces(newList);
    };
    self.placePlaceMarkers(self.filteredPlaces());
  });

  // function that promises a route from Coord's routing API
  self.getCoordRoute = function(originPoints, destinationPoints) {
    return new Promise(function(resolve, reject) {
      let originLat = originPoints.lat();
      let originLng = originPoints.lng();
      let destinationLat = destinationPoints.lat();
      let destinationLng = destinationPoints.lng();

      var coordURL = "https://api.coord.co/v1/routing/route?origin_latitude="
      coordURL += originLat
      coordURL += "&origin_longitude=" + originLng;
      coordURL += "&destination_latitude=" + destinationLat;
      coordURL += "&destination_longitude=" + destinationLng;
      coordURL += "&modes=&num_options=" + '1';
      coordURL += "&priority=soon&time=&time_mode=depart&bike_systems=&access_key="
      coordURL += coordKey;

      $.ajax({
        url: coordURL,
        type: "GET",
        success: function(result) {
          resolve(result);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  };

  self.makeCoordDirectionsPoly = function(leg) {
    var points = [];
    // push the coordinate points for each set of points within the coordinate
    // groups and then push them to the points array
    leg.geometry.coordinates.forEach(function(coord) {
      points.push({lng: coord[0], lat: coord[1]});
    });
    // set a default color just in case something goes wrong
    var color = 'ffffff';
    // determine color per used
    if (leg.mode == 'bike') {
      color = self.bikeColor();
    } else if (leg.mode == 'bus') {
      color = self.busColor();
    } else if (leg.mode == 'metro') {
      color = self.metroColor();
    } else if (leg.mode == 'ferry') {
      color = self.ferryColor();
    } else if (leg.mode == 'rail') {
      color = self.railColor();
    } else if (leg.mode == 'walk') {
      color = self.walkColor();
    } else {
      console.log(leg.mode + ' is not a viable transit type');
    }
    // create a poly line using the points array
    var poly = new google.maps.Polyline({
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: 3,
      path: points
    });
    return poly
  };

  self.coordDisplayDirections = function(origin, destination) {
    self.hideMarkers(self.filteredPlaces());
    self.coordDirectionsMarkers().forEach(function(marker) {
      marker.setMap(null);
    })
    // hide any previous coord routes
    if (self.transitRoutePolylines().length > 0) {
      self.transitRoutePolylines().forEach(function(route) {
        self.hidePolylines(route.route);
      })
      self.transitRoutes([]);
    };
    // start gather information for new routes
    var originPoints = '';
    var destinationPoints = '';
    var coordTrips = '';
    // promise a resulting set of origin points
    self.promiseLatLng(origin).then(function(result) {
      originPoints = result;
      // init a second promise that will contain the destination points
      return self.promiseLatLng(destination);
    }).then(function(result2) {
      destinationPoints = result2;
      return self.getCoordRoute(originPoints, destinationPoints);
    }).then(function(result3) {
      // return the legs of the routes available and assign to observable
      self.transitRoutes(result3.trips);
      // iterate through each route
      self.transitRoutes().forEach(function(route) {
        polylines = []
        index = result3.trips.indexOf(route);
        // get the legs from the route
        let legs = route.legs;
        // iterate through the lets to retrive the polylines
        legs.forEach(function(leg) {
          var poly = self.makeCoordDirectionsPoly(leg);
          poly.setMap(map);
          polylines.push(poly);
        });
        self.transitRoutePolylines().push({route: polylines});

        // set up the end points
        self.createMarkerFromPlaceRequest(origin).then(function(result) {
          self.coordDirectionsMarkers.push(result);
          return self.createMarkerFromPlaceRequest(destination)
        }).then(function(result2) {
          self.coordDirectionsMarkers.push(result2);
          self.coordDirectionsMarkers().forEach(function(marker) {
            marker.setMap(map);
          })
        })
      });
    }).catch(function(error) {
      console.log(error);
    });
  };

  self.googleDisplayDirections = function(directionsDisplay, origin, destination, travelMode) {
    self.hideMarkers(self.placeMarkers);
    var directionsService = new google.maps.DirectionsService;
    // get the destination address from the user entered value
    directionsService.route({
      //origin is passed in the marker's position
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode[travelMode]
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        console.log(response);
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions requestion failed due to ' + status);
      }
    });
  };

  // tells vm whether or not to show the curbs
  self.toggleCurbs = function() {
    let curbStatus = self.renderCurbs();
    if (curbStatus === false) {
      self.renderCurbs(true);
      self.renderCoordCurbs('ALL');
    } else {
      self.hidePolylines(self.curbPolylines())
      self.renderCurbs(false);
    }
  }

  // initiates a promise to get all of the curbs within the bounds of the screen
  self.promiseAllCurbs = function() {
    return new Promise(function(resolve, reject) {
      let time = new Date()

      var minLat = self.mapBounds().f.b;
      var maxLat = self.mapBounds().f.f;
      var minLng = self.mapBounds().b.b;
      var maxLng = self.mapBounds().b.f;

      var coordURL = 'https://api.coord.co/v1/search/curbs/bybounds/time_rules?min_latitude=';
      coordURL += minLat;
      coordURL += '&max_latitude=' + maxLat;
      coordURL += '&min_longitude=' + minLng;
      coordURL += '&max_longitude=' + maxLng;
      coordURL += '&time=' + time.toISOString();
      coordURL += '&vehicle_type=all&access_key='
      coordURL += coordKey;

      $.ajax({
        url: coordURL,
        type: "GET",
        success: function(result) {
          resolve(result);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  };

  self.constructRadiusCurbURL = function(lat, lng, rad, primary, permitted) {
    let time = new Date()

    var coordURL = 'https://api.coord.co/v1/search/curbs/bylocation/time_rules?latitude=';
    coordURL += lat;
    coordURL += '&longitude=' + lng;
    coordURL += '&radius_km=' + rad;
    coordURL += '&time=' + time.toISOString();
    coordURL += '&vehicle_type=all&access_key='
    coordURL += coordKey;
    console.log(coordURL);
    return coordURL
  };

  // initiates a promise to get all of the curbs within a set radius from a
  // point on the map
  self.promiseRadiusCurbs = function(coords) {
    return new Promise(function(resolve, reject) {
      let lat = coords.lat();
      let lng = coords.lng();
      let coordURL = self.constructRadiusCurbURL(
        lat, lng, 0.5, 'park', 'load_passengers'
      )
      $.ajax({
        url: coordURL,
        type: "GET",
        success: function(result) {
          resolve(result);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  };

  self.makePoly = function(coords, primaryUse) {
    var points = [];
    // push the coordinate points for each set of points within the coordinate
    // groups and then push them to the points array
    coords.forEach(function(coord) {
      points.push({lng: coord[0], lat: coord[1]});
    });
    // set a default color just in case something goes wrong
    var color = 'ffffff';
    // determine color per used
    if (primaryUse == 'none') {
      color = self.noneColor();
    } else if (primaryUse == 'park') {
      color = self.parkingColor();
    } else if (primaryUse == 'load_passengers') {
      color = self.loadPassengersColor();
    } else if (primaryUse == 'load_goods') {
      color = self.loadGoodsColor();
    } else {
      console.log(primaryUse + ' is not a viable curb type');
    }
    // create a poly line using the points array
    var poly = new google.maps.Polyline({
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: 3,
      path:points
    });
    return poly
  };

  // function to iterate through a set of curbs and make polylines for each
  self.iterateCurbs = function(curbs) {
    curbs.forEach(function(curb) {
      var poly = self.makePoly(
        curb.geometry.coordinates,
        curb.properties.uses.use
      );
      poly.setMap(map);
      self.curbPolylines().push(poly);
    });
  }

  self.renderCoordCurbs = function(type) {
    self.hidePolylines(self.curbPolylines());
    if (self.renderCurbs() === false) {
      self.renderCurbs(true);
      self.showCurbs(true);
    }
    var curbs = '';
    if (type === 'ALL') {
      self.promiseAllCurbs().then(function(result) {
        curbs = result.features;
        self.iterateCurbs(curbs);
      });
    } else {
      self.promiseLatLng(type).then(function(result) {
        console.log(result);
        return self.promiseRadiusCurbs(result)
      }).then(function(result) {
        curbs = result.features;
        self.iterateCurbs(curbs);
        self.zoomToArea(type);
      });
    };
  };
// end of mapInit()
};

// Load the map on page load
google.maps.event.addDomListener(window, 'load', function() {
  // create an accesible viewModel object
  vm = new viewModel();
  // apply knockout bindings
  ko.applyBindings(vm);
  //initiate map and pass along the viewModel
  initMap(vm);
  // retrieve places
  vm.retrieveMyPlaces();
});
