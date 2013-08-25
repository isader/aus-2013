/*******************************************************************************************
 * Overview Panel
 ******************************************************************************************/
SwingPanel = function() {
	this.maxSwing = 15;
	this.electorateTable = new ElectorateTable();
}
/**
 * setUp Panel
 */
SwingPanel.prototype.create = function(id) {
	this.id = id;
	this.isBuilt = false;
	var panelHTML = '<div class="mobileHeader"><a href="#" class="back-to-overview">Back</a></div>';
	panelHTML += '<div class="panelHeader"><ul><li class="first selected mapTab">Key Seats</li><li class="last tableTab">All Seats</li></ul><h2>swingo-meter</h2><p class="intro">Click and drag the slider below to change the swing.</p></div>';
	panelHTML += '<div class="leftCol"></div>';
	panelHTML += '<div class="rightCol"><h4>Result of Swing</h4><h5 class="textResult"></h5><div class="swingControler"></div>';
	panelHTML += '<div class="resultTable"></div>';
	panelHTML += '</div>';
	return panelHTML;
}
/**
 * setUp Panel
 */
SwingPanel.prototype.setUp = function() {
	var selfRef = this;
	if(!this.isBuilt) {
		this.isBuilt = true;
		// load data
		$(dataInterface).bind(dataInterface.ELECTORATES_LOADED, function() {
			selfRef.build();
		})
		dataInterface.requestElectorates();

	}

}
/**
 * setUp Panel
 */
SwingPanel.prototype.build = function() {
	$(dataInterface).unbind(dataInterface.ELECTORATES_LOADED);
	var selfRef = this;

	// swing
	//this.swingControl = new SwingControler('.swingControler');
	this.swingControl = new SwingControler('.swingControler');
	$(this.swingControl).bind('change', function(e, percent) {
		selfRef.swingChange(percent);
	})
	// colour map
	this.electorateList = []
	for (var i=0; i < dataInterface.electorates.length; i++) {
		var electorate = dataInterface.electorates[i]
		// Colour Electorates by winner of last election
		var declaredPartyCode = electorate.partyOneCode;
		regionMap.colourRegion(electorate.seat, dataInterface.parties[declaredPartyCode].colour);
	}
	this.swingChange(0);
	this.buildTable();
	//tabs
	$('#panel-swing .mapTab').click(function() {
		$(selfRef).trigger('showMap');
		$('#panel-swing .mapTab').addClass('selected');
		$('#panel-swing .tableTab').removeClass('selected');
	});
	$('#panel-swing .tableTab').click(function() {
		$(selfRef).trigger('hideMap');
		$('#panel-swing .tableTab').addClass('selected');
		$('#panel-swing .mapTab').removeClass('selected');
	});
	
	
}

/**
 * Open Electorate
 */
SwingPanel.prototype.buildTable = function() {
	this.electorateTable.buildTable("#panel-swing .leftCol")
}
/**
 * Open Panel
 */
SwingPanel.prototype.swingChange = function(percent) {
	var selfRef = this;
	var swingPercent = (percent * (this.maxSwing / 100));
	$('#panel-' + this.id + ' .value').text(mathExt.roundNumber(Math.abs(swingPercent),2) + '%')
	// loop through the electorates and re color
	var partySeatsCount = []
	partySeatsCount.push({key:'ALP',count:0});
	partySeatsCount.push({key:'LNP',count:0});
	partySeatsCount.push({key:'ZZZ',count:0});
	
	var updatedRows = [];
	var l = dataInterface.electorates.length - 1;
	
	while(l >= 0) {
		
		var electiorateData = dataInterface.electorates[l];
	
		var percentOne = Number(electiorateData.partyOnePercent);
		var percentTwo = Number(electiorateData.partyTwoPercent);
		
		
		
		//- minus swing is a swing towards the LNP
		if(swingPercent < 0) {
			if(electiorateData.partyOneCode === 'LP' || electiorateData.partyOneCode === 'NP') {
				percentTwo -= Math.abs(swingPercent);
				percentOne += Math.abs(swingPercent);
			} else if(electiorateData.partyTwoCode === 'LP' || electiorateData.partyTwoCode === 'NP') {
				percentTwo += Math.abs(swingPercent);
				percentOne -= Math.abs(swingPercent);
			}
		}
		//+ minus swing is a swing towards the ALP
		if(swingPercent > 0) {
			if(electiorateData.partyOneCode == 'ALP') {
				percentTwo -= Math.abs(swingPercent);
				percentOne += Math.abs(swingPercent);
			} else if(electiorateData.partyTwoCode == 'ALP') {
				percentTwo += Math.abs(swingPercent);
				percentOne -= Math.abs(swingPercent);
			}
		}
		
		
		// Count the parties
		
		var seatWinner = (percentOne>percentTwo) ? electiorateData.partyOneCode : electiorateData.partyTwoCode;
		
		electiorateData.newPartyOnePercent = percentOne
		electiorateData.newPartyTwoPercent = percentTwo
		updatedRows.push(electiorateData);
		
		if(seatWinner == 'ALP') {
			partySeatsCount[0].count++;
		} else if(seatWinner == 'LP' || seatWinner == 'NP') {
			partySeatsCount[1].count++;
		} else {
			partySeatsCount[2].count++;
		}
		// Colour electorates by winner of last election
		regionMap.colourRegion(electiorateData.seat, dataInterface.parties[seatWinner].colour);
		//
		l--;
	}
	
	this.buildSeatCount(partySeatsCount)
	this.electorateTable.showSwing = true;
	this.electorateTable.rows = updatedRows;
	//this.sortOn = 'margin';
	this.electorateTable.buildTable("#panel-swing .leftCol")
}
SwingPanel.prototype.sortPercent = function(a, b) {
	return b.percent - a.percent;
}
/**
 * Build Seat Count
 */
SwingPanel.prototype.buildSeatCount = function(partySeatsCount) {
	// clear the table
	$('#panel-' + this.id + ' .resultTable').html('');
	var mostSeatWon = {
		party : '',
		seatsWon : 0
	}
	var resultsHTML = '';
	
	for (var i=0; i < partySeatsCount.length; i++) {
		var key = partySeatsCount[i].key;
		var count = partySeatsCount[i].count;
		var partyData = dataInterface.parties[key];
		if(count > mostSeatWon.seatsWon) {
			mostSeatWon = {
				party : key,
				seatsWon :count
			}
		}
		resultsHTML += '<h4>' + partyData.name + ' (' + count + ' seats won)</h4>'
		//$('#panel-' + this.id + ' .resultTable').append();
		var l = count - 1;
		while(l >= 0) {
			resultsHTML += '<div class="seatBlock" style="background:' + dataInterface.parties[key].colour + '"></div>';
			l--;
		};
		resultsHTML +='<div class="clear"></div>';
	}
	// show the result
	var result = 'Hung Parliament'
	if(mostSeatWon.seatsWon > 44) {
		result = 'Parliament formed by ' + dataInterface.parties[mostSeatWon.party].name;
	}
	$('#panel-' + this.id + ' .resultTable').html(resultsHTML);

	$('#panel-' + this.id + ' .textResult').html(result);
}
/**
 * Open Panel
 */
SwingPanel.prototype.opened = function() {
	regionMap.hideMarkers();
	regionMap.disable();
	$('#panel-swing .mapTab').addClass('selected');
	$('#panel-swing .tableTab').removeClass('selected');
	regionMap.reset();
	this.swingChange(0);
	this.swingControl.reset();
}
/**
 * Close Panel
 */
SwingPanel.prototype.closed = function() {
};