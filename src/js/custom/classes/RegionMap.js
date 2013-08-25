google.maps.Polygon.prototype.getBounds = function() {
	var bounds = new google.maps.LatLngBounds();
	var paths = this.getPaths();
	var path;
	for(var i = 0; i < paths.getLength(); i++) {
		path = paths.getAt(i);
		for(var ii = 0; ii < path.getLength(); ii++) {
			bounds.extend(path.getAt(ii));
		}
	}
	return bounds;
};

RegionMap = function() {
	this.overTimer
	this.overId = 0;
	this.count = 0;
	this.selectedRegion
	this.districtPolygons = [];
	this.districtMarkers = [];
	this.districtInfoBoxes = [];
	this.currentTip
};

regionMap = new RegionMap();

RegionMap.prototype.buildMap = function(id) {

	var selfRef = this;
	var ausMapStylesDef = [{
		featureType : "water",
		elementType : "geometry",
		stylers : [{
			hue : "#00c0ff"
		}, {
			saturation : -45
		}, {
			lightness : 12
		}]
	}, {
		featureType : "administrative",
		elementType : "geometry",
		stylers : [{
			hue : "#ffed00"
		}, {
			saturation : -55
		}]
	}, {
		featureType : "landscape.man_made",
		elementType : "geometry",
		stylers : [{
			hue : "#ffed00"
		}, {
			saturation : -55
		}]
	}, {
		featureType : "poi",
		elementType : "geometry",
		stylers : [{
			hue : "#ffed00"
		}, {
			saturation : -55
		}]
	}, {
		featureType : "transit.station",
		elementType : "labels",
		stylers : [{
			hue : "#00c0ff"
		}, {
			saturation : -20
		}]
	}, {
		featureType : "road",
		elementType : "geometry",
		stylers : [{
			hue : "#ffed00"
		}, {
			saturation : -75
		}]
	}, {
		featureType : "road",
		elementType : "labels",
		stylers : [{
			hue : "#ffed00"
		}, {
			saturation : -75
		}]
	}];

	var ausMapStyles = new google.maps.StyledMapType(ausMapStylesDef, {
		name : "Aus Map Styles"
	});
	//
	this.centerLatlng = new google.maps.LatLng(-25.274398, 133.775136);
	this.orgZoom = 3;
	var myOptions = {
		zoom : this.orgZoom,
		minZoom : this.orgZoom,
		panControl : true,
		scaleControl : false,
		zoomControl : true,
		mapTypeControl: false,
		streetViewControl : false,
		center : this.centerLatlng,
		mapTypeIds : [google.maps.MapTypeId.ROADMAP, 'aus_styles']
	}

	if (dataInterface.touchType === "touchstart") {
	//if (true) {
		myOptions.panControl = false;
		myOptions.zoomControl = false;
		myOptions.draggable = false; 
		myOptions.scrollwheel = false;
		myOptions.disableDoubleClickZoom = true
	}

	this.map = new google.maps.Map(document.getElementById(id), myOptions);
	this.map.mapTypes.set('aus_styles', ausMapStyles);
	this.map.setMapTypeId('aus_styles');

	var _error = function( message ){
	
		return {
			type: "Error",
			message: message
		};
	
	};

	var _ccw = function( path ){
		var isCCW;
		var a = 0;
		for (var i = 0; i < path.length-2; i++){
			a += ((path[i+1].lat() - path[i].lat()) * (path[i+2].lng() - path[i].lng()) - (path[i+2].lat() - path[i].lat()) * (path[i+1].lng() - path[i].lng()));
		}
		if(a > 0){
			isCCW = true;
		}
		else{
			isCCW = false;
		}
		return isCCW;
	};

	var _assignRegion = function (regionPolygon, regionName, electorateData, bounds) {
		var marker,
			center = bounds.getCenter();

		if (regionName === "lingiari") {
			center = new google.maps.LatLng(-19.491411,132.55096);
		}
		else if (regionName === "sydney") {
			center = new google.maps.LatLng(-33.873052,151.200714);
		}
		else if (regionName === "solomon") {
			center = new google.maps.LatLng(-12.416460,130.933685);
		}
		else if (regionName === "bonner") {
			center = new google.maps.LatLng(-27.451009,153.149414);
		}

		if(electorateData.keyseat == 0) {
			marker = new google.maps.Marker({
				map : selfRef.map,
				draggable : false,
				position : center,
				visible : false
			});
		}
		else {
			var image = 'img/keySeatMarker.png';

			marker = new google.maps.Marker({
				position : center,
				map : selfRef.map,
				draggable : false,
				title : regionName,
				icon : image,
				id : count
			});

			if (dataInterface.touchType !== "touchstart") {
				google.maps.event.addListener(marker, "click", function (evt) {
					$(selfRef).trigger('selected', regionName);
				});
			}
		}

		selfRef.districtMarkers[regionName] = marker;

		if (dataInterface.touchType !== "touchstart") {

			google.maps.event.addListener(regionPolygon, "click", function (evt) {
				$(selfRef).trigger('selected', regionName);
			});

			google.maps.event.addListener(regionPolygon, "mouseover", function (evt) {
				selfRef.overName = regionName;
				$(selfRef).stop();
				$(selfRef).animate({
					count : selfRef.selfRef + 1000
				}, 500, function() {
					selfRef.overInfo();
				});

				if(selfRef.selectedRegion != this) {
					this.setOptions({
						fillOpacity : 0.7
					});
				}
			});

			google.maps.event.addListener(regionPolygon, "mouseout", function (evt) {
				selfRef.closeInfo(regionName);
				$(selfRef).stop();
				if (selfRef.selectedRegion != this) {
					this.setOptions({
						fillOpacity : 0.6
					});
				}
			});
		}

		regionPolygon.setMap(selfRef.map);
	};

	var geojsonFeatures = [];
	geojsonFeatures = geojsonFeatures.concat(window.mapRegions.features, window.mapRegions2.features, window.mapRegions3.features, window.mapRegions4.features, window.mapRegions5.features, window.mapRegions6.features, window.mapRegions7.features);
	var obj = [];
	var opts = {
		strokeColor : "#FFFFFF",
		strokeOpacity : 0.7,
		strokeWeight : 1,
		fillColor : "#000000",
		fillOpacity : 0.6
	};

	var count = 0;
	for (var z = 0; z < geojsonFeatures.length; z++) {
		var geojsonGeometry = geojsonFeatures[z].geometry;
		var geojsonProperties = geojsonFeatures[z].properties;
		var regionName = geojsonFeatures[z].properties.ELECT_DIV.toLowerCase().replace('\'', '');
		var electorateData = dataInterface.findElectorateData(regionName);
		var bounds = new google.maps.LatLngBounds();
		var googleObj;

		switch ( geojsonGeometry.type ){
			case "Polygon":
				var paths = [];
				var exteriorDirection;
				var interiorDirection;
				for (var i = 0; i < geojsonGeometry.coordinates.length; i++) {
					var path = [];
					for (var j = 0; j < geojsonGeometry.coordinates[i].length; j++) {
						var ll = new google.maps.LatLng(geojsonGeometry.coordinates[i][j][1], geojsonGeometry.coordinates[i][j][0]);
						bounds.extend(ll);
						path.push(ll);
					}
					if(!i) {
						exteriorDirection = _ccw(path);
						paths.push(path);
					}
					else if(i == 1){
						interiorDirection = _ccw(path);
						if(exteriorDirection == interiorDirection){
							paths.push(path.reverse());
						}else{
							paths.push(path);
						}
					}
					else{
						if(exteriorDirection == interiorDirection){
							paths.push(path.reverse());
						}
						else{
							paths.push(path);
						}
					}
				}
				opts.paths = paths;
				opts.id = count;
				googleObj = new google.maps.Polygon(opts);
				selfRef.districtPolygons[regionName] = googleObj;

				_assignRegion(googleObj, regionName, electorateData, bounds);

				if (geojsonProperties) {
					googleObj.set("geojsonProperties", geojsonProperties);
				}

				break;
				
			case "MultiPolygon":
				googleObj = [];


				var paths = _.map(geojsonGeometry.coordinates, function(entry) {
				    return _.reduce(entry, function(list, polygon) {
				        _.each(_.map(polygon, function(point) {
				            // Important: the lat/lng are vice-versa in GeoJSON
				            var ll = new google.maps.LatLng(point[1], point[0]);
				            bounds.extend(ll);
				            return ll;
				        }), function(point) {
				            list.push(point);
				        });

				        return list;
				    }, []);
				});

				opts.paths = paths;
				opts.id = count;
				googleObj = new google.maps.Polygon(opts);
				selfRef.districtPolygons[regionName] = googleObj;

				_assignRegion(googleObj, regionName, electorateData, bounds);

				break;
				
			default:
				googleObj = _error("Invalid GeoJSON object: Geometry object must be one of \"Point\", \"LineString\", \"Polygon\" or \"MultiPolygon\".");
		}
		count++;
	}
}
RegionMap.prototype.showMarkers = function(){
	for( var key in this.districtMarkers){
		var marker = this.districtMarkers[key]
		if (marker.id != null){
			marker.setVisible(true)
		}
	}
	
}

RegionMap.prototype.enable = function(){
	for( var key in this.districtMarkers){
		var polygon = this.districtPolygons[key];
		if (polygon && !$.browser.msie){
			polygon.setOptions({clickable:true});
		}
	}
}

RegionMap.prototype.disable = function(){
	
	for( var key in this.districtMarkers){
		var polygon = this.districtPolygons[key];
		if (polygon && !$.browser.msie){
			polygon.setOptions({clickable:false});
		}
	}
	
}

RegionMap.prototype.hideMarkers = function(){
	for( var key in this.districtMarkers){
		var marker = this.districtMarkers[key]
		if (marker.id != null){
			marker.setVisible(false)
		}
	}
}


RegionMap.prototype.getRegion = function(regionName) {
	var regionsList = this.mapRegions.getRegions();
	var i = regionsList.length - 1;
	while(i >= 0) {
		if(regionsList[i].name.split('_').join(' ').toLowerCase() == regionName.toLowerCase()) {
			return regionsList[i];
		}
		i--;
	}
}

RegionMap.prototype.overInfo = function(regionName) {

	$(this).stop();
	$(this).trigger('over', this.overName);
}

RegionMap.prototype.reset = function() {
	this.unSelectRegion();
	this.map.setCenter(this.centerLatlng);
	this.map.setZoom(this.orgZoom);
	if(this.currentTip) {
		this.currentTip.close();
	}

}

RegionMap.prototype.zoomToLoction = function(latlog, zoomLevel) {
	this.map.setCenter(latlog);
	this.map.setZoom(zoomLevel);
}

RegionMap.prototype.unSelectRegion = function() {
	if(this.selectedRegion) {
		var newPolyOptions = {
			strokeOpacity : 0.7,
			strokeWeight : 1,
			fillOpacity : 0.6
		}
		this.selectedRegion.setOptions(newPolyOptions);
	}
}

RegionMap.prototype.selectRegion = function(regionName) {
	this.unSelectRegion();
	var polyName = regionName.toLowerCase().replace('\'', '');
	var regionPolygon = this.districtPolygons[polyName];
	this.map.fitBounds(regionPolygon.getBounds());

	this.selectedRegion = regionPolygon;
	if(regionPolygon) {
		var newPolyOptions = {
			strokeOpacity : 1,
			strokeWeight : 3,
			
			fillOpacity : 0.9
		}
		regionPolygon.setOptions(newPolyOptions);
	} else {
		console.log('Poly ' + regionName + ' was not fount')
	}
}

RegionMap.prototype.openInfo = function(regionName, infoBoxOptions) {
	var polyName = regionName.toLowerCase().replace('\'', '');
	if(!this.districtInfoBoxes[polyName]) {
		this.districtInfoBoxes[polyName] = new InfoBox(infoBoxOptions);

	}
	var marker = this.districtMarkers[polyName];
	this.districtInfoBoxes[polyName].open(this.map, marker);
	this.currentTip = this.districtInfoBoxes[polyName];
}

RegionMap.prototype.closeInfo = function(regionName) {
	var polyName = regionName.toLowerCase().replace('\'', '');
	if(this.districtInfoBoxes[polyName]) {
		this.districtInfoBoxes[polyName].close();
	}

}

RegionMap.prototype.colourRegion = function(regionName, colour) {this
	var polyName = regionName.toLowerCase().replace('\'', '');
	var regionPolygon = this.districtPolygons[polyName];
	if(regionPolygon) {
		var newPolyOptions = {
			fillColor : colour
		}
		regionPolygon.setOptions(newPolyOptions);
	} else {
		console.log('Poly ' + regionName + ' was not fount')
	}
}

RegionMap.prototype.colourRegions = function() {
	var colourExt = new ColourExt();
	for(var i in this.districtPolygons) {
		var regionPolygon = this.districtPolygons[i];
		var newPolyOptions = {
			fillColor : colourExt.randomColor()
		}
		regionPolygon.setOptions(newPolyOptions);
	};
};