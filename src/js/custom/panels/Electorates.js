/*******************************************************************************************
 * Electorates Panel
 ******************************************************************************************/
ElectoratesPanel = function() {
	this.searchMessage = 'Electorate, suburb or postcode';
	this.isBuilt = false;
	this.electorateTable = new ElectorateTable();
	var selfRef = this;
	$(this.electorateTable).bind('selected',function(e,key){
		$('.table-seats').hide();
		$(selfRef).trigger('showMap');
		selfRef.openElectorate(key);
	})
}
/**
 * setUp Panel this.electorateTable.
 */
ElectoratesPanel.prototype.create = function(id) {

	this.id = id;

	var panelHTML = '<div class="panelHeader"><ul><li class="first selected mapTab">Key Seats</li><li class="last tableTab">All Seats</li></ul><h2>state electorates</h2><input type="text" name="elecorateName" id="elecorateName" /></div>';
	panelHTML += '<div class="leftCol"></div>';
	panelHTML += '<div class="rightCol">';
	panelHTML += '<div class="info"><div class="infoHolder">';
	panelHTML += '<div class="results infoPanel"><h3>Seats to watch</h3><div class="keyseats"></div></div>';
	panelHTML += '<div class="electorate infoPanel"><h3 class="back">back to Seats to watch</h3><div class="seat"></div></div>';
	panelHTML += '</div></div>';
	panelHTML += '</div><div class="table-seats"></div>';
	panelHTML += '<div id="graphToolTip">ToolTip</div>';
	//'<div class="leftCol"></div><div class="rightCol"></div>';
	return panelHTML;
}
/**
 * setUp Panel
 */
ElectoratesPanel.prototype.setUp = function() {
	if(!this.isBuilt) {
		this.isBuilt = true;
		var selfRef = this;
		//

		//
		$(dataInterface).bind(dataInterface.ELECTORATES_LOADED, function() {
			selfRef.build();
		})
		dataInterface.requestElectorates();
	}

}
/**
 * Open Panel
 */
ElectoratesPanel.prototype.opened = function($data) {
	var selfRef = this;
	regionMap.showMarkers();
	regionMap.enable();
	$('#panel-electorates input').val('');
	$('#panel-electorates .mapTab').addClass('selected');
	$('#panel-electorates .tableTab').removeClass('selected');
	regionMap.reset();
	for (var i=0; i < dataInterface.electorates.length; i++) {
		var electorate = dataInterface.electorates[i]
		var declaredPartyCode = electorate.partyOneCode;
		regionMap.colourRegion(electorate.seat, dataInterface.parties[declaredPartyCode].colour);
	}
	if($data) {
		this.openElectorate($data.electorate);
	}
	$(regionMap).bind('selected', function(event, electorate) {
		selfRef.openElectorate(electorate);
	})
	$(regionMap).bind('over', function(event, electorate) {
		selfRef.electorateOver(electorate);
	})
	
	this.electorateTable.rows = dataInterface.electorates;
	//this.sortOn = 'margin';
	this.electorateTable.buildTable("#panel-electorates .table-seats")
	this.electorateTable.deSelect();
	//
	$('#panel-electorates input').val(this.searchMessage);
	$('#panel-electorates input').addClass('message');	
}
/**
 * Close Panel
 */
ElectoratesPanel.prototype.closed = function() {
	$(regionMap).unbind();
}
/**
 * Build
 */
ElectoratesPanel.prototype.build = function() {
	var selfRef = this;
	$(dataInterface).unbind(dataInterface.ELECTORATES_LOADED);

	
	// build the search box
	var districtNames = [];
	var partycount = {}
	this.seatsToWatch = {}
	// loop over the electorates

	for (var i=0; i < dataInterface.electorates.length; i++) {
		var electorate = dataInterface.electorates[i];
		districtNames.push(electorate.seat);
		// if electorates is key seat add it to the list
		if(electorate.keyseat) {
			if(this.seatsToWatch[electorate.state] == null) {
				this.seatsToWatch[electorate.state] = [];
			}
			this.seatsToWatch[electorate.state].push(electorate);
			//
		}

		// Colour Electorates by winner of last election
		var declaredPartyCode = electorate.partyOneCode;
		if(partycount[declaredPartyCode] == null) {
			partycount[declaredPartyCode] = 0;
		}
		partycount[declaredPartyCode]++;
		regionMap.colourRegion(electorate.seat, dataInterface.parties[declaredPartyCode].colour);

	}

	// Build the seats to watch
	for(var region in this.seatsToWatch) {
		var stateName = "";
		for (var i = 0, len = dataInterface.regions.length; i < len; i = i + 1) {
			if (region.toLowerCase() === dataInterface.regions[i].name.toLowerCase()) {
				stateName = dataInterface.regions[i].fullName;
			}
		}
		var regionHTML = '<div class="region"><div class="btn" key="' + region + '">View All</div><h4>' + stateName + '</h4><ul class="seatList">'
		var electorates = this.seatsToWatch[region];
		for(var s = 0; s < electorates.length; s++) {
			var electorate = electorates[s];
			var declaredPartyCode = electorate.partyOneCode;
			var extraClass = '';
			//regionMap.addMarker(electorate.name);
			if(s == 0) {
				extraClass = 'first';
			}
			if(s == electorates.length - 1) {
				extraClass = 'last';
			}
			var shownCode = (declaredPartyCode=='ZZZ') ? 'IND' : declaredPartyCode;
			regionHTML += '<li key="' + electorate.seat + '" class="' + extraClass + ' keyseat"><span style="color:' + dataInterface.parties[declaredPartyCode].colour + '">' + shownCode + ' ' + electorate.swingNeededToChangeHands + '</span><label>' + electorate.seat + '</label></li>'
		};
		regionHTML += '</ul></div>';

		$("#panel-" + this.id + " .rightCol .results .keyseats").append(regionHTML);
	}
	
	//<ul class='seatList'>
	if(!$.browser.msie) {
		$('#panel-' + this.id + ' .keyseats').jScrollPane();
	}

	
	// add events to the key seats
	$("#panel-" + this.id + " .rightCol .results ul.seatList li").each(function(index) {
		$(this).click(function() {
			selfRef.openElectorate($(this).attr('key'))
		});
	});
	// add events to the regiosn
	$("#panel-" + this.id + " .rightCol .region .btn").each(function(index) {
		$(this).click(function() {
			selfRef.openRegion($(this).attr('key'))
			var regionData = dataInterface.getRegion($(this).attr('key'))
		
			regionMap.zoomToLoction(regionData.latlog, regionData.zoom)
		});
	});
	$("#panel-" + this.id + " .rightCol .electorate .back").click(function() {
		selfRef.closeElectorate();
	});
	// add the list of names to the auto complete
	$("#panel-" + this.id + " #elecorateName").autocomplete(dataInterface.searchList, {resultsClass: "ac_results small-autocomplete", formatMatch: function (row) {
		if (row.type === "Electorate") {
			return row.name;
		}
		else if (row.type === "Suburb") {
			return [row.suburb, row.postcode];
		}
	}}).result(function(event, item) {
		var electorate = item.name;
		$(this).val(selfRef.searchMessage);
		selfRef.closeAllSeats();
		selfRef.openElectorate(electorate);
	});
	// input change test
	$('#panel-electorates input').keypress(function(e) {
		if(e.which == 13) {
			selfRef.openElectorate($('#panel-electorates input').val());
			$('#panel-electorates input').val('');
		}
	});
	$('#panel-electorates input').focus(function() {
 		 if($(this).val()==selfRef.searchMessage){
 		 	$(this).val('')
 		 	$(this).removeClass('message');
 		 }
	});
	$('#panel-electorates input').blur(function() {
 		 if($(this).val()==''){
 		 	$(this).val(selfRef.searchMessage)
 		 	$(this).addClass('message');
 		 }
	});

	this.buildTable();

	var selfRef = this;
	//tabs
	$('#panel-electorates .mapTab').click(function() {
		selfRef.closeAllSeats();
	});
	$('#panel-electorates .tableTab').click(function() {
		selfRef.openAllSeats();
	});

	
}
/**
 * Open All Seats
 */
ElectoratesPanel.prototype.openAllSeats = function() {
	var selfRef = this;

	$('#panel-electorates .table-seats').show();
	$(this).trigger('hideMap');
	$('#panel-electorates .tableTab').addClass('selected');
	$('#panel-electorates .mapTab').removeClass('selected');

	$('h3.back').text("back to All Seats").unbind().bind("click", function () {
		selfRef.openAllSeats();
		selfRef.closeElectorate();
	});
}
/**
 * Close All Seats
 */
ElectoratesPanel.prototype.closeAllSeats = function() {
	var selfRef = this;

	$('#panel-electorates .table-seats').hide();
	$(this).trigger('showMap');
	$('#panel-electorates .mapTab').addClass('selected');
	$('#panel-electorates .tableTab').removeClass('selected');
	selfRef.closeElectorate();
	$('h3.back').text("back to Seats to Watch").unbind().bind("click", function () {
		selfRef.closeAllSeats();
		selfRef.closeElectorate();
	});
}
/**
 * Open Electorate
 */
ElectoratesPanel.prototype.buildTable = function() {
	this.electorateTable.buildTable("#panel-electorates .table-seats")
	var selfRef = this;	
}
/**
 * Open Electorate
 */
ElectoratesPanel.prototype.openElectorate = function(electorate) {

	
	
	var selfRef = this;
	var electorateData = dataInterface.findElectorateData(electorate);

	if(!electorateData) { 
		if (!isNaN(electorate)){
			electorateData = dataInterface.findElectorateByPostCode(electorate)
		} else {
			electorateData = dataInterface.findElectorateBySuburb(electorate)
		}
		
	}
	
	
	if(electorateData) {
		var declaredPartyCode = electorateData.partyOneCode;
		var shownCode = (declaredPartyCode=='ZZZ') ? 'IND' : declaredPartyCode;
		var electorateHTML = "<h3>" + electorateData.seat + " <span style='color:" + dataInterface.parties[declaredPartyCode].colour + "'>" + shownCode + "</span></h3>";
		if(electorateData.keyseat) {
			electorateHTML += "<h5 class='keyseat'>Key seat</h5>"
		}
		electorateHTML += "<h5 class='viewRegion' key='"+electorateData.state+"'>More seats in this state</h5><div class='clear'></div>";
		electorateHTML += "<h4>Seat summary</h4>";
		electorateHTML += "<p>" + electorateData.description + "</p><div class='clear'></div>";
		electorateHTML += "<h4>Main Candidates</h4><ul>";
		
		var cadidatesList = dataInterface.getCadidates(electorateData.seat);
		
		for (var i=0; i < cadidatesList.length; i++) {
			var extraClass = '';
			if (i==cadidatesList.length-1){
				extraClass = 'last';
			}
			var cadidate = cadidatesList[i];
			var cCode = (cadidate.partyCode=='ZZZ') ? 'IND' : cadidate.partyCode;
			electorateHTML += "<li class='"+extraClass+"'><span style='color:" + dataInterface.parties[cadidate.partyCode].colour + "'> " + cCode + "</span>" + cadidate.candidate+ "</li>";
		};
			
		
		//
		electorateHTML += "</ul><div class='demographics'><h4>Demographics</h4>";
		electorateHTML += "<div class='demoBox'><h5>Average Income</h5><h4>" + numberExt.addCommas(electorateData.averageIncome) + "</h4><span></span></div>";
		electorateHTML += "<div class='demoBox'><h5>Unemployment Rate</h5><h4>" + electorateData.unemploymentRate + "</h4><span></span></div>";
		electorateHTML += "<div class='clear'></div>";
		electorateHTML += "<div class='graph'><h4>Population by Age %</h4>";
		electorateHTML += "<div class='graphArea'>";

		var ageGroups = []
		ageGroups.push({
			value : electorateData.populationByAge0_14,
			percent : 0,
			label : '0-14'
		})
		ageGroups.push({
			value : electorateData.populationByAge15_24,
			percent : 0,
			label : '15-24'
		})
		ageGroups.push({
			value : electorateData.populationByAge25_44,
			percent : 0,
			label : '25-44'
		})
		ageGroups.push({
			value : electorateData.populationByAge45_65,
			percent : 0,
			label : '45-65'
		})
		ageGroups.push({
			value : electorateData.populationByAge65plus,
			percent : 0,
			label : '65+'
		})
		var totalPopulation = 0;
		var graphHeight = 73;
		var graphDisplay = 79;
		var realHeight = (graphHeight / graphDisplay) * 100
		for(var i = 0; i < ageGroups.length; i++) {
			totalPopulation += ageGroups[i].value;
		};
		for( i = 0; i < ageGroups.length; i++) {
			ageGroups[i].percent = parseFloat(ageGroups[i].value.replace('%', ''));
			var colHeight = realHeight / 100 * ageGroups[i].percent
			var marginHeight = graphHeight - colHeight;
			electorateHTML += "<div class='graphCol' style='margin-top:" + marginHeight + "px;'><div style='height:" + colHeight + "px;'></div><label>" + ageGroups[i].label + "</label></div>";
		};
		electorateHTML += "<div class='clear'></div></div></div>";
		electorateHTML += "<p class='note'>Data provided by <a href='http://www.ecq.qld.gov.au/' target='_blank'>ECQ</a> and <a href='http://www.oesr.qld.gov.au/' target='_blank'>OESR</a></p>";
		$('#panel-' + this.id + ' .rightCol .electorate .seat').html(electorateHTML)
		$('#panel-' + this.id + ' .rightCol .infoHolder').animate({
			'margin-left' : -315
		}, 200);

		if(!$.browser.msie) {
			$('#panel-' + this.id + ' .seat').jScrollPane();
		}
		//

		regionMap.selectRegion(electorateData.seat)
	
		// add events to the regiosn
		$("#panel-" + this.id + " .rightCol .viewRegion").each(function(index) {
			$(this).click(function() {
				selfRef.openRegion($(this).attr('key'));
				var regionData = dataInterface.getRegion($(this).attr('key'))
				
				regionMap.zoomToLoction(regionData.latlog, regionData.zoom)
			});
		});
	
		
	}

}
/**
 * Close Electorate
 */
ElectoratesPanel.prototype.closeElectorate = function() {
	this.electorateTable.deSelect();
	$('#panel-electorates input').val('');
	regionMap.reset()
	$('#panel-' + this.id + ' .rightCol .infoHolder').animate({
		'margin-left' : 0
	}, 200);
}
/**
 * Open Region
 */
ElectoratesPanel.prototype.openRegion = function(region) {
	this.electorateTable.deSelect();
	var selfRef = this;
	var stateName = "";
	var stateDescription = "";
	for (var i = 0, len = dataInterface.regions.length; i < len; i = i + 1) {
		if (region.toLowerCase() === dataInterface.regions[i].name.toLowerCase()) {
			stateName = dataInterface.regions[i].fullName;
			stateDescription = dataInterface.regions[i].description;
		}
	}
	var regionHTML = "<h3>"+stateName+"</h3>"
	
	regionHTML += "<h4>State summary</h4>";
	regionHTML += "<p>" + stateDescription + "</p>";
	
	regionHTML += "<h4><span>Seats to watch</span>Seats in this state</h4>";
	regionHTML += "<div class='scrollList'><ul class='seatList'>";
	var electorates = dataInterface.getElectorates(region);
	for (var i=0; i < electorates.length; i++) {
		var electorate = electorates[i];
		var declaredPartyCode = electorate.partyOneCode;
		var extraClass = '';
		if(i == 0) {
			extraClass = 'first';
		}
		if(i == electorates.length - 1) {
			extraClass = 'last';
		}
		if(electorate.keyseat == 1) {
			extraClass += ' keyseat';
		}
		var shownCode = (declaredPartyCode=='ZZZ') ? 'IND' : declaredPartyCode
		regionHTML += '<li key="' + electorate.seat + '" class="' + extraClass + '"><span style="color:' + dataInterface.parties[declaredPartyCode].colour + '">' + shownCode + '</span><label>' + electorate.seat + '</label></li>'
	};
	

	regionHTML += "</ul></div>";
	$('#panel-' + this.id + ' .rightCol .electorate .seat').html(regionHTML);
	$('#panel-' + this.id + ' .rightCol .infoHolder').animate({
		'margin-left' : -315
	}, 200);
	//<ul class='seatList'>
	if(!$.browser.msie) {
		$('#panel-' + this.id + ' .scrollList').jScrollPane();
	}
	// add events to the key seats
	$("#panel-" + this.id + " .rightCol .electorate .seat ul.seatList li").each(function(index) {
		$(this).click(function() {
			selfRef.openElectorate($(this).attr('key'))
		});
	});
}
/**
 * Close Region
 */
ElectoratesPanel.prototype.closeRegion = function(region) {
	$('#panel-electorates input').val('');
	regionMap.reset()
	$('#panel-' + this.id + ' .rightCol .infoHolder').animate({
		'margin-left' : 0
	}, 200);
}
/**
 * Electorate over
 */
ElectoratesPanel.prototype.electorateOver = function(electorateName) {
	var electorate = dataInterface.findElectorateData(electorateName);
	var partyOnePercent = Number(electorate.partyOnePercent)
	var partyTwoPercent = Number(electorate.partyTwoPercent)
	
	//var margin = mathExt.roundNumber(partyOnePercent - 50,2);
	var margin = electorate.swingNeededToChangeHands;
	var tipHTML = '<div class="regionTip"><h1>' + electorate.seat + '</h1>';
	if(electorate.keyseat) {
		tipHTML += '<h5>Seat to watch</h5>'
	}
	var declaredPartyCode = electorate.partyOneCode;
	var shownCode = (declaredPartyCode=='ZZZ') ? 'IND' : declaredPartyCode;
	tipHTML += '<div class="results"><div class="held"><h2 style="background:' + dataInterface.parties[declaredPartyCode].colour + '">' + shownCode + '</h2></div>';
	tipHTML += '<div class="margin"><h2>'+ margin +'%</h2></div>';
	tipHTML += '<div class="clear"></div></div>';
	tipHTML += '<h4>Click electorate for details</h4></div>';
	var infoOptions = {
		content : tipHTML,
		disableAutoPan : false,
		maxWidth : 0,
		zIndex : null,
		pixelOffset : new google.maps.Size(-91, -130),
		closeBoxURL : "",
		infoBoxClearance : new google.maps.Size(1, 1),
		isHidden : false,
		pane : "floatPane",
		enableEventPropagation : false

	};
	regionMap.openInfo(electorateName, infoOptions)
};