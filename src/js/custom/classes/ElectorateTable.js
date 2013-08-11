ElectorateTable = function() {
	this.placeIn
	this.rows = dataInterface.electorates;
	this.sortOn = 'name';
	this.sortDirection = 'Down'
	this.showSwing = false;
	this.selectedRow
	this.selectedKey
}

ElectorateTable.prototype.buildTable = function(placeIn) {
	this.placeIn = placeIn;
	var selfRef = this;
	var sortFunc = this.sortOn + this.sortDirection;
	selfRef.rows.sort(selfRef[sortFunc])

	var tableHTML = '<div class="resultsTable"><table>';
	tableHTML += '<tr>';

	var headers = [];

	if(!this.showSwing) {
		headers.push({
			name : 'Single Income Families',
			key : 'singleIncomeFamilies',
			intDir : 'Up'
		});
		headers.push({
			name : 'Children In Governments Schools',
			key : 'childrenInGovernmentsSchools',
			intDir : 'Up'
		});
		headers.push({
			name : 'Year 12 School Level Attained',
			key : 'year12SchoolLevelAttained',
			intDir : 'Up'
		});
		headers.push({
			name : 'Gross Household Weekly Income Above $3000',
			key : 'grossHouseholdWeeklyIncomeAbove3000',
			intDir : 'Up'
		});
		headers.push({
			name : 'Gross Household Weekly Income Under $600',
			key : 'grossHouseholdWeeklyIncomeUnder600',
			intDir : 'Up'
		});
		headers.push({
			name : 'Both Parents Born In Australia',
			key : 'bothParentsBornInAustralia',
			intDir : 'Up'
		});
		headers.push({
			name : 'Born In Australia',
			key : 'bornInAustralia',
			intDir : 'Up'
		});
		headers.push({
			name : 'Family Composition One Parent Family',
			key : 'familyCompositionOneParentFamily',
			intDir : 'Up'
		});
		headers.push({
			name : 'Family Composition Couple With Children',
			key : 'FamilyCompositionCoupleWithChildren',
			intDir : 'Up'
		});
		headers.push({
			name : 'Family Composition Couple Without Children',
			key : 'familyCompositionCoupleWithoutChildren',
			intDir : 'Up'
		});
		headers.push({
			name : 'Bachelor Degree',
			key : 'bachelorDegree',
			intDir : 'Up'
		});
		headers.push({
			name : 'Unemployment Rate Show National Average',
			key : 'unemploymentRateShowNationalAverage',
			intDir : 'Up'
		});
		headers.push({
			name : 'Mortgage Payments 30% Or More Of Income',
			key : 'mortgagePayments30OrMoreOfIncome',
			intDir : 'Up'
		});
		headers.push({
			name : 'Median Weekly Household Income',
			key : 'MedianWeeklyHouseholdIncome',
			intDir : 'Up'
		});
		headers.push({
			name : 'Age 65+',
			key : 'age65',
			intDir : 'Up'
		});
		headers.push({
			name : 'Age 44-64',
			key : 'age4464',
			intDir : 'Up'
		});
		headers.push({
			name : 'Age 25-44',
			key : 'age2544',
			intDir : 'Up'
		});
		headers.push({
			name : 'Age 15-24',
			key : 'age1524',
			intDir : 'Up'
		});
		headers.push({
			name : 'Age 0-14',
			key : 'age014',
			intDir : 'Up'
		});
	}

	headers.push({
		name : 'Status',
		key : 'status',
		intDir : 'Up'
	});

	if(this.showSwing) {
		headers.push({
			name : 'Margin %',
			key : 'marginSwing',
			intDir : 'Up'
		})
	} else {
		headers.push({
			name : 'Margin %',
			key : 'margin',
			intDir : 'Up'
		})
	}

	headers.push({
		name : 'Held by',
		key : 'party',
		intDir : 'Up'
	});

	headers.push({
		name : 'State',
		key : 'state',
		intDir : 'Down'
	});

	headers.push({
		name : 'Electorate',
		key : 'name',
		intDir : 'Down'
	});


	var i = headers.length - 1;
	while(i >= 0) {
		var header = headers[i];
		var className = '';
		if(this.sortOn == header.key) {
			className = 'selected ' + this.sortDirection.toLowerCase();
		}
		tableHTML += '<th class="' + className + '" key="' + header.key + '" intDir="' + header.intDir + '">' + header.name + '</th>';
		i--;
	};
	tableHTML += '<tr>';
	
	

	var i = this.rows.length - 1;
	while(i >= 0) {

		var electorate = this.rows[i];
		var partyOnePercent = electorate.partyOnePercent;
		var partyTwoPercent = electorate.partyTwoPercent;

		if(this.showSwing) {
			partyOnePercent = (electorate.newPartyOnePercent) ? electorate.newPartyOnePercent : electorate.partyOnePercent
			partyTwoPercent = (electorate.newPartyTwoPercent) ? electorate.newPartyTwoPercent : electorate.partyTwoPercent
		}

		var margin = Number(partyOnePercent) - 50;
		winningParty = electorate.partyOneCode;
		if(margin < 0) {
			winningParty = electorate.partyTwoCode;
		}
		margin = mathExt.roundNumber(Math.abs(margin), 2)
		//
		var shownCode = (winningParty == 'ZZZ') ? 'IND' : winningParty;

		var extraClasses = '';
		if(this.selectedKey == electorate.seat) {
			extraClasses = 'selected'
		}
		if(this.showSwing) {
			extraClasses = 'swingRow'
			tableHTML += '<tr key="' + electorate.seat + '" class="resultRow ' + extraClasses + '"><td class="name">' + electorate.seat + '</td><td>' + electorate.state.toUpperCase() + '</td><td class="party" style="color:' + dataInterface.parties[winningParty].colour + '">' + shownCode + '</td><td>' + margin + '%</td><td>' + electorate.swingStatus + '</td></tr>';
		}
		else {
			tableHTML += '<tr key="' + electorate.seat + '" class="resultRow ' + extraClasses + '">';
			tableHTML += '<td class="name">' + electorate.seat + '</td>';
			tableHTML += '<td>' + electorate.state.toUpperCase() + '</td>';
			tableHTML += '<td class="party" style="color:' + dataInterface.parties[winningParty].colour + '">' + shownCode + '</td>';
			tableHTML += '<td>' + margin + '%</td>';
			tableHTML += '<td>' + electorate.swingStatus + '</td>';
			tableHTML += '<td>' + electorate.populationByAge0_14 + '</td>';
			tableHTML += '<td>' + electorate.populationByAge15_24 + '</td>';
			tableHTML += '<td>' + electorate.populationByAge25_44 + '</td>';
			tableHTML += '<td>' + electorate.populationByAge45_65 + '</td>';
			tableHTML += '<td>' + electorate.populationByAge65plus + '</td>';
			tableHTML += '<td>' + electorate.medianWeeklyHouseholdIncome + '</td>';
			tableHTML += '<td>' + electorate.mortgagePayments30OrMoreOfIncome + '</td>';
			tableHTML += '<td>' + electorate.unemploymentRateShowNationalAverage + '</td>';
			tableHTML += '<td>' + electorate.bachelorDegree + '</td>';
			tableHTML += '<td>' + electorate.familyCompositionCoupleWithoutChildren + '</td>';
			tableHTML += '<td>' + electorate.FamilyCompositionCoupleWithChildren + '</td>';
			tableHTML += '<td>' + electorate.familyCompositionOneParentFamily + '</td>';
			tableHTML += '<td>' + electorate.bornInAustralia + '</td>';
			tableHTML += '<td>' + electorate.bothParentsBornInAustralia + '</td>';
			tableHTML += '<td>' + electorate.grossHouseholdWeeklyIncomeUnder600 + '</td>';
			tableHTML += '<td>' + electorate.grossHouseholdWeeklyIncomeAbove3000 + '</td>';
			tableHTML += '<td>' + electorate.year12SchoolLevelAttained + '</td>';
			tableHTML += '<td>' + electorate.childrenInGovernmentsSchools + '</td>';
			tableHTML += '<td>' + electorate.singleIncomeFamilies + '</td>';
			tableHTML += '</tr>';
		}
		i--;
	}
	tableHTML += '</table></div>';
	$(placeIn).html(tableHTML)
	
	if(this.selectedKey){
		this.selectedRow = $(placeIn + ' .resultsTable .selected');
	}
	
	if(!$.browser.msie) {
		$(placeIn + ' .resultsTable').jScrollPane({ autoReinitialise: true });
	}

	$(placeIn + ' .resultsTable table tr th').each(function(index) {
		$(this).click(function() {
			if(selfRef.sortOn == $(this).attr('key')) {
				if(selfRef.sortDirection == "Down") {
					selfRef.sortDirection = 'Up';
				} else {
					selfRef.sortDirection = 'Down';

				}

			} else {
				selfRef.sortDirection = $(this).attr('intDir')
			}
			selfRef.sortOn = $(this).attr('key')
			selfRef.buildTable(selfRef.placeIn);

		})
	});
	if(!this.showSwing) {
		$(placeIn + " .resultsTable table tr.resultRow").each(function(index) {
			$(this).click(function() {
				selfRef.deSelect();
				selfRef.selectedKey = $(this).attr('key');
				selfRef.selectedRow = this;
				$(selfRef.selectedRow).addClass('selected');
				$(selfRef).trigger('selected', $(this).attr('key'));
			})
		});
	}
}
ElectorateTable.prototype.deSelect = function() {
	if(this.selectedRow) {
		$(this.selectedRow).removeClass('selected')
		this.selectedKey = ''
	}
}

ElectorateTable.prototype.partyUp = function(a, b) {
	var A = a.partyOneCode.toLowerCase();
	var B = b.partyOneCode.toLowerCase();

	if(A < B) {
		return -1;
	} else if(A > B) {
		return 1;
	} else {
		return 0;
	}
}
ElectorateTable.prototype.partyDown = function(a, b) {
	var A = b.partyOneCode.toLowerCase();
	var B = a.partyOneCode.toLowerCase();
	if(A < B) {
		return -1;
	} else if(A > B) {
		return 1;
	} else {
		return 0;
	}
}

ElectorateTable.prototype.stateUp = function(a, b) {
	var A = a.state.toLowerCase();
	var B = b.state.toLowerCase();
	if(A < B) {
		return -1;
	} else if(A > B) {
		return 1;
	} else {
		return 0;
	}
}
ElectorateTable.prototype.stateDown = function(a, b) {
	var A = b.state.toLowerCase();
	var B = a.state.toLowerCase();
	if(A < B) {
		return -1;
	} else if(A > B) {
		return 1;
	} else {
		return 0;
	}
}

ElectorateTable.prototype.nameUp = function(a, b) {
	var A = a.seat.toLowerCase();
	var B = b.seat.toLowerCase();
	if(A < B) {
		return -1;
	} else if(A > B) {
		return 1;
	} else {
		return 0;
	}
}
ElectorateTable.prototype.nameDown = function(a, b) {
	var A = b.seat.toLowerCase();
	var B = a.seat.toLowerCase();
	if(A < B) {
		return -1;
	} else if(A > B) {
		return 1;
	} else {
		return 0;
	}
}

ElectorateTable.prototype.marginUp = function(a, b) {
	var ApartyOnePercent = a.partyOnePercent
	var ApartyTwoPercent = a.partyTwoPercent
	var BpartyOnePercent = b.partyOnePercent
	var BpartyTwoPercent = b.partyTwoPercent

	return (Number(ApartyOnePercent) - Number(ApartyTwoPercent)) - (Number(BpartyOnePercent) - Number(BpartyTwoPercent));
}
ElectorateTable.prototype.marginDown = function(a, b) {
	var ApartyOnePercent = a.partyOnePercent
	var ApartyTwoPercent = a.partyTwoPercent
	var BpartyOnePercent = b.partyOnePercent
	var BpartyTwoPercent = b.partyTwoPercent

	return (Number(BpartyOnePercent) - Number(BpartyTwoPercent)) - (Number(ApartyOnePercent) - Number(ApartyTwoPercent));
}

ElectorateTable.prototype.marginSwingDown = function(a, b) {
	var ApartyOnePercent = a.newPartyOnePercent
	var ApartyTwoPercent = a.newPartyTwoPercent
	var BpartyOnePercent = b.newPartyOnePercent
	var BpartyTwoPercent = b.newPartyTwoPercent

	var marginOne = Math.abs(Number(ApartyOnePercent) - 50)
	var marginTwo = Math.abs(Number(BpartyOnePercent) - 50)

	return marginOne - marginTwo;
}
ElectorateTable.prototype.marginSwingUp = function(a, b) {
	var ApartyOnePercent = a.newPartyOnePercent
	var ApartyTwoPercent = a.newPartyTwoPercent
	var BpartyOnePercent = b.newPartyOnePercent
	var BpartyTwoPercent = b.newPartyTwoPercent
	var marginOne = Math.abs(Number(ApartyOnePercent) - 50)
	var marginTwo = Math.abs(Number(BpartyOnePercent) - 50)

	return marginTwo - marginOne;
};