DataInterface = function() {
	// var
	this.useAPI = false;
	this.dataAPIURL = 'http://uat.api.ni.news.com.au/mm/dataset/';
	// data
	this.electorates = [];
	this.electoratesLoaded = false;
	this.canditates = [];
	this.canditatesLoaded = false;
	this.searchList = [];
	// news poll
	this.newspollLoaded = false;
	this.qldParties = [];
	this.primary = [];
	this.satisfaction = [];
	this.betterPM = [];
	this.twoPartyPerferred = [];
	// parties
	this.parties = {}
	this.parties['ALP'] = {
		name : 'Labor',
		colour : '#ef5b46'
	};
	this.parties['LNP'] = {
		name : 'Coalition',
		colour : '#277e9c'
	};
	this.parties['LP'] = {
		name : 'Liberal Party',
		colour : '#277e9c'
	};
	this.parties['NP'] = {
		name : 'National Party',
		colour : '#277e9c'
	};
	this.parties['GRN'] = {
		name : 'The Greens',
		colour : '#8da13e'
	};
	this.parties['KAP'] = {
		name : "Katter's Australian Party",
		colour : '#8da13e'
	};
	this.parties['DSQ'] = {
		name : 'DS4SEQ',
		colour : '#000000'
	};
	this.parties['FFP'] = {
		name : 'Family First Party',
		colour : '#000000'
	};
	this.parties['ONP'] = {
		name : 'One Nation',
		colour : '#999999'
	};
	this.parties['LCP'] = {
		name : 'Liberal Country Party',
		colour : '#999999'
	};
	this.parties['NAT'] = {
		name : 'Nationalist Party of Australia',
		colour : '#999999'
	};
	this.parties['WAN'] = {
		name : 'National Alliance',
		colour : '#999999'
	};
	this.parties['PUA'] = {
		name : 'Palmer United Australia',
		colour : '#999999'
	};
	this.parties['ACP'] = {
		name : 'Australian Christian Party',
		colour : '#999999'
	};
	this.parties['ASP'] = {
		name : 'Australian Sex Party',
		colour : '#999999'
	};
	this.parties['DLP'] = {
		name : 'Democratic Labor Party',
		colour : '#999999'
	};
	this.parties['KAP'] = {
		name : 'Katter\'s Australian Party',
		colour : '#999999'
	};
	this.parties['SPP'] = {
		name : 'Stable Population Party',
		colour : '#999999'
	};
	this.parties['AF'] = {
		name : 'Australia First',
		colour : '#999999'
	};
	this.parties['CDP'] = {
		name : 'Christian Democratic Party',
		colour : '#999999'
	};
	this.parties['SA'] = {
		name : 'Socialist Alliance',
		colour : '#999999'
	};
	this.parties['CEC'] = {
		name : 'Citizens Electoral Council',
		colour : '#999999'
	};
	this.parties['CLP'] = {
		name : 'Country Liberals Party',
		colour : '#999999'
	};
	this.parties['ON'] = {
		name : 'One Nation',
		colour : '#999999'
	};
	this.parties['IND'] = {
		name : '',
		colour : '#999999'
	};
	this.parties['ZZZ'] = {
		name : 'Other Candidates',
		colour : '#999999'
	};
	// regions

	this.regions = [];
	this.regions.push({
		name: 'nsw',
		fullName : 'New South Wales',
		latlog : new google.maps.LatLng(-31.253218, 146.921099),
		zoom : 6,
		description: "A handful of seats in western Sydney could decide the 2013 election. The Labor brand is at rock bottom in NSW after years of sleaze and corruption."
	})
	this.regions.push({
		name: 'qld',
		fullName : 'Queensland',
		latlog : new google.maps.LatLng(-20.917574, 142.702796),
		zoom : 5,
		description: " Labor's best hope of hedging against losses elsewhere is by winning seats in Queensland. The Rudd factor and unhappiness with the state LNP government could benefit the ALP."
	})
	this.regions.push({
		name: 'vic',
		fullName : 'Victoria',
		latlog : new google.maps.LatLng(-37.471308, 144.785153),
		zoom : 7,
		description: "The Coalition looks like picking up at least two seats in Victoria and possibly three. Satisfaction with the state Coalition government makes Labor's task harder."
	})
	this.regions.push({
		name: 'wa',
		fullName : 'Western Australia',
		latlog : new google.maps.LatLng(-27.672817, 121.628310),
		zoom : 5,
		description: "Labor was facing a wipe out in Perth - a January Newspoll had the party's two-party vote at 43 per cent. Kevin Rudd has clawed back ground but several seats could change hands."
	})
	this.regions.push({
		name: 'tas',
		fullName : 'Tasmania',
		latlog : new google.maps.LatLng(-41.365042, 146.628490),
		zoom : 7,
		description: "Labor's support in Tasmania is on the wane amid dissatisfaction with the state's Labor-Greens alliance. The Coalition has two seats (Bass and Braddon) in its sights."
	})
	this.regions.push({
		name: 'act',
		fullName : 'Australian Capital Territory',
		latlog : new google.maps.LatLng(-35.473468, 149.012368),
		zoom : 7,
		description: "Labor holds both ACT seats. Neither is expected to change hands."
	})
	this.regions.push({
		name: 'nt',
		fullName : 'Northern Territories',
		latlog : new google.maps.LatLng(-19.491411, 132.550960),
		zoom : 5,
		description: "With just two seats, the Territory is unlikely to play a major role in the campaign. However, Labor faces the loss of Lingiari if the results of the last territory poll are repeated federally."
	})
	this.regions.push({
		name: 'sa',
		fullName : 'South Australia',
		latlog : new google.maps.LatLng(-30.000232, 136.209155),
		zoom : 6,
		description: " Labor hopes to pick up one Adelaide seat (Boothby), but could lose at least one (Hindmarsh). Labor's cars plan could win vote it in the home of Holden. State Labor is also on the nose."
	})
	// events
	this.ELECTORATES_LOADED = 'electorates_loaded';
	this.NEWSPOLL_LOADED = 'newspoll_loaded';
}
/**
 * getRegion
 * @param teh region name
 */
DataInterface.prototype.getRegion = function(region) {
	for(var i = 0; i < this.regions.length; i++) {
		if(this.regions[i].name.toLowerCase() == region.toLowerCase()) {
			return this.regions[i];
		}
	};
	console.log(region + 'not found')
}
/**
 * Loads and returns the electorates
 * @param startOffset offset row to start the load from the DATA API
 */
DataInterface.prototype.requestElectorates = function() {
	if(this.electoratesLoaded) {
		$(this).trigger(this.ELECTORATES_LOADED);
	} else {
		this.loadElectorates();
	}
}
/**
 *
 */
DataInterface.prototype.loadElectorates = function(startOffset) {
	var selfRef = this;
	var startOffset = (startOffset == null) ? 1 : startOffset;
	var searchTerms = [];
	var url = selfRef.dataAPIURL + 'qld_electorates/select';
	var dataType = "jsonp";
	var data = {
		format : "json",
		args : {
			offset : startOffset,
			count : 100
		}
	}

	if(!this.useAPI) {
		url = 'json/federal_seats.json';
		dataType = "json";
		data = {};
	}

	$.ajax({
		url : url,
		dataType : dataType,
		data : data,
		success : function(data) {
			// Push the loaded data into an array
			for(var i = 0; i < data.items.length; i++) {
				var electorate = data.items[i]
				selfRef.electorates.push(electorate);

				searchTerms.push({
					name: electorate.seat.toProperCase(),
					state: electorate.state.toProperCase(),
					suburb: "",
					postcode: "",
					type: "Electorate"
				});

				var suburbs = electorate.suburbs.split(',');
				var postCodes = electorate.postCodes.split(', ');
				var p = suburbs.length - 1;

				if (suburbs.length !== postCodes.length) {
					p = (suburbs.length < postCodes.length) ? suburbs.length - 1 : postCodes.length - 1;
				}
				while(p >= 0) {
					var sub = (suburbs[p] !== null) ? suburbs[p].toProperCase() : "";
					var postcode = (postCodes[p] !== null) ? postCodes[p] : "";

					searchTerms.push({
						name: electorate.seat.toProperCase(),
						state: electorate.state.toProperCase(),
						suburb: sub,
						postcode: postcode,
						type: "Suburb"
					});
					p--;
				}
			};

			for(var c = 0; c < searchTerms.length; c++) {
				selfRef.searchList.push(searchTerms[c]);
			}

			if(data.count < 100 || !selfRef.useAPI) {
				selfRef.loadCandidates();
			} else {
				// Request more rows
				selfRef.loadElectorates(startOffset + 100);
			}
		},
		error : function(data) {

			console.log('error getAllRows');
		}
	});
}
/**
 * Loads and returns the electorates
 * @param startOffset offset row to start the load from the DATA API
 */
DataInterface.prototype.requestNewspoll = function() {

	if(this.newspollLoaded) {
		$(this).trigger(this.NEWSPOLL_LOADED);
	} else {
		this.loadPrimary();
	}
}
/**
 * load the primary vote newspoll
 */
DataInterface.prototype.loadPrimary = function(startOffset) {
	var selfRef = this;
	var startOffset = (startOffset == null) ? 1 : startOffset;

	var url = selfRef.dataAPIURL + 'newspoll_federal_primary/select';
	var dataType = "jsonp";
	var data = {
		format : "json",
		args : {
			offset : startOffset,
			count : 100
		}
	}

	if(!this.useAPI) {
		url = 'json/newspoll_federal_primary.json';
		dataType = "json";
		data = {};
	}

	$.ajax({
		url : url,
		dataType : dataType,
		data : data,
		success : function(data) {

			// Push the loaded data into an array
			for(var i = 0; i < data.items.length; i++) {
				//selfRef.electorates.push(data.items[i]);
				//var districtName =  data.items[i].name.toLowerCase();
				//selfRef.electorates[districtName] = data.items[i]
				selfRef.primary.push(data.items[i]);
			};
			if(data.count < 100 || !selfRef.useAPI) {
				// All the election data has been loaded
				//selfRef.loadLastElectionResults();
				//selfRef.electoratesLoaded = true;
				//$(selfRef).trigger(selfRef.ELECTORATES_LOADED);
				selfRef.loadSatisfaction();
			} else {
				// Request more rows
				selfRef.loadPrimary(startOffset + 100);
			}
		},
		error : function(data) {

			console.log('error get primary');
		}
	});
}
/**
 * load the pm satisfaction
 */
DataInterface.prototype.loadSatisfaction = function(startOffset) {
	var selfRef = this;
	var startOffset = (startOffset == null) ? 1 : startOffset;

	var url = selfRef.dataAPIURL + 'newspoll_federal_satisfaction/select';
	var dataType = "jsonp";
	var data = {
		format : "json",
		args : {
			offset : startOffset,
			count : 100
		}
	}

	if(!this.useAPI) {
		url = 'json/newspoll_federal_satisfaction.json';
		dataType = "json";
		data = {};
	}

	$.ajax({
		url : url,
		dataType : dataType,
		data : data,
		success : function(data) {

			// Push the loaded data into an array
			for(var i = 0; i < data.items.length; i++) {
				//selfRef.electorates.push(data.items[i]);
				//var districtName =  data.items[i].name.toLowerCase();
				//selfRef.electorates[districtName] = data.items[i]
				selfRef.satisfaction.push(data.items[i]);
			};
			if(data.count < 100 || !selfRef.useAPI) {
				// All the election data has been loaded
				//selfRef.loadLastElectionResults();
				//selfRef.electoratesLoaded = true;
				//$(selfRef).trigger(selfRef.ELECTORATES_LOADED);
				selfRef.loadbetterPM();
			} else {
				// Request more rows
				selfRef.loadSatisfaction(startOffset + 100);
			}
		},
		error : function(data) {
			console.log(data);
			console.log('error get pmSatisfaction');
		}
	});
}
/**
 * load the better bm
 */
DataInterface.prototype.loadbetterPM = function(startOffset) {
	var selfRef = this;
	var startOffset = (startOffset == null) ? 1 : startOffset;

	var url = selfRef.dataAPIURL + 'newspoll_federal_better_pm/select';
	var dataType = "jsonp";
	var data = {
		format : "json",
		args : {
			offset : startOffset,
			count : 100
		}
	}

	if(!this.useAPI) {
		url = 'json/newspoll_federal_better_pm.json';
		dataType = "json";
		data = {};
	}

	$.ajax({
		url : url,
		dataType : dataType,
		data : data,
		success : function(data) {

			// Push the loaded data into an array
			for(var i = 0; i < data.items.length; i++) {
				//selfRef.electorates.push(data.items[i]);
				//var districtName =  data.items[i].name.toLowerCase();
				//selfRef.electorates[districtName] = data.items[i]
				selfRef.betterPM.push(data.items[i]);
			};
			if(data.count < 100) {
				// All the election data has been loaded
				//selfRef.loadLastElectionResults();
				//selfRef.electoratesLoaded = true;
				//$(selfRef).trigger(selfRef.ELECTORATES_LOADED);
				selfRef.loadTwoParty();
			} else {
				// Request more rows
				selfRef.loadbetterPM(startOffset + 100);
			}
		},
		error : function(data) {
			console.log(data);
			console.log('error get opp satisfaction');
		}
	});
}
/**
 * load 2 party perferred
 */
DataInterface.prototype.loadTwoParty = function(startOffset) {
	var selfRef = this;
	var startOffset = (startOffset == null) ? 1 : startOffset;

	var url = selfRef.dataAPIURL + 'newspoll_federal_2pp/select';
	var dataType = "jsonp";
	var data = {
		format : "json",
		args : {
			offset : startOffset,
			count : 100
		}
	}

	if(!this.useAPI) {
		url = 'json/newspoll_federal_2pp.json';
		dataType = "json";
		data = {};
	}

	$.ajax({
		url : url,
		dataType : dataType,
		data : data,
		success : function(data) {

			// Push the loaded data into an array
			for(var i = 0; i < data.items.length; i++) {
				//selfRef.electorates.push(data.items[i]);
				//var districtName =  data.items[i].name.toLowerCase();
				//selfRef.electorates[districtName] = data.items[i]
				selfRef.twoPartyPerferred.push(data.items[i]);
			};
			if(data.count < 100 || !selfRef.useAPI) {
				// All the election data has been loaded
				//selfRef.loadLastElectionResults();
				selfRef.newspollLoaded = true;
				$(selfRef).trigger(selfRef.NEWSPOLL_LOADED);

			} else {
				// Request more rows
				selfRef.loadTwoParty(startOffset + 100);
			}
		},
		error : function(data) {
			console.log(data);
			console.log('error get opp satisfaction');
		}
	});
}
/**
 * load Candidates
 */
DataInterface.prototype.loadCandidates = function(startOffset) {

	var selfRef = this;
	var startOffset = (startOffset == null) ? 1 : startOffset;

	var url = selfRef.dataAPIURL + 'qld_candidate/select';
	var dataType = "jsonp";
	var data = {
		format : "json",
		args : {
			offset : startOffset,
			count : 100
		}
	}

	if(!this.useAPI) {
		url = 'json/federal_candidates.json';
		dataType = "json";
		data = {};
	}

	$.ajax({
		url : url,
		dataType : dataType,
		data : data,
		success : function(data) {
			// Push the loaded data into an array
			for(var i = 0; i < data.items.length; i++) {
				//selfRef.electorates.push(data.items[i]);
				//var districtName =  data.items[i].name.toLowerCase();
				//selfRef.electorates[districtName] = data.items[i]
				selfRef.canditates.push(data.items[i]);
			};
			if(data.count < 100 || !selfRef.useAPI) {
				// All the election data has been loaded
				//selfRef.loadLastElectionResults();
				selfRef.electoratesLoaded = true;
				$(selfRef).trigger(selfRef.ELECTORATES_LOADED);
			} else {
				// Request more rows
				selfRef.loadCandidates(startOffset + 100);
			}
		},
		error : function(data) {
			console.log(data);
			console.log('error getAllRows');
		}
	});
}
/**
 * Find Electorate
 */
DataInterface.prototype.findElectorateData = function(electorate) {
	for(var i = 0; i < this.electorates.length; i++) {
		if(electorate.toLowerCase() == this.electorates[i].seat.toLowerCase().replace('\'', '')) {
			return this.electorates[i];
		}
	}
}
/**
 * Find Electorate By PostCode
 */
DataInterface.prototype.findElectorateByPostCode = function(postCode) {
	var e = this.electorates.length - 1
	while(e >= 0) {
		var electorate = this.electorates[e];
		var postCodes = this.electorates[e].postCodes.split(',');
		var p = postCodes.length - 1;
		while(p >= 0) {
			if(postCode == postCodes[p]) {
				return electorate;
			}
			p--;
		}
		e--;
	}
}
/**
 * Find Electorate By Suburb
 */
DataInterface.prototype.findElectorateBySuburb = function(suburb) {
	var e = this.electorates.length - 1
	while(e >= 0) {
		var electorate = this.electorates[e];
		var suburbs = this.electorates[e].suburbs.split(',');
		var p = suburbs.length - 1;
		while(p >= 0) {
			if(suburb.toLowerCase() == suburbs[p].toLowerCase()) {
				return electorate;
			}
			p--;
		}
		e--;
	}
}
/**
 * get electorates in region
 * @param teh region name
 */
DataInterface.prototype.getElectorates = function(region) {
	var electorates = [];
	for(var i = 0; i < this.electorates.length; i++) {
		if(this.electorates[i].state == region) {
			electorates.push(this.electorates[i]);
		}
	};
	return electorates;
}
/**
 * Find getCadidates
 */
DataInterface.prototype.getCadidates = function(electorate) {
	var canditatesList = [];
	for(var i = 0; i < this.canditates.length; i++) {
		if(electorate.toLowerCase() == this.canditates[i].electorate.toLowerCase()) {
			canditatesList.push(this.canditates[i]);
		}
	}
	return canditatesList;
}
/**
 * Loads and the last election results and merges them with the electorates
 */
DataInterface.prototype.loadLastElectionResults = function() {
	var selfRef = this;

	$.ajax({
		type : "GET",
		url : "publicResults.xml",
		dataType : "xml",
		success : function(xml) {
			// loop through the results and match them up with the districts
			$(xml).find("district").each(function() {
				var districtName = $(this).attr("name").toLowerCase();
				// find the electorate
				if(selfRef.electorates[districtName]) {
					selfRef.electorates[districtName].result = this;
				} else {
					console.log('district ' + districtName + ' was not found');
				}
			});
			selfRef.electoratesLoaded = true;
			$(selfRef).trigger(selfRef.ELECTORATES_LOADED);
		}
	});

}
var dataInterface = new DataInterface();
