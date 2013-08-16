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

	var headersHTML = '<div class="headersTable"><table><tr>';
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
			name : 'Children In Public Schools',
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
		/*headers.push({
			name : 'Gross Household Weekly Income Under $600',
			key : 'grossHouseholdWeeklyIncomeUnder600',
			intDir : 'Up'
		});*/
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
			name : 'One-Parent Family',
			key : 'familyCompositionOneParentFamily',
			intDir : 'Up'
		});
		/*headers.push({
			name : 'Couples With Children',
			key : 'FamilyCompositionCoupleWithChildren',
			intDir : 'Up'
		});
		headers.push({
			name : 'Couple Without Children',
			key : 'familyCompositionCoupleWithoutChildren',
			intDir : 'Up'
		});
		headers.push({
			name : 'Bachelor Degree',
			key : 'bachelorDegree',
			intDir : 'Up'
		});
		headers.push({
			name : 'Jobless rate (*NAT. AV. 5.7%)',
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
			key : 'medianWeeklyHouseholdIncome',
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
		});*/
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
	var tempHTML = "";
	while(i >= 0) {
		var header = headers[i];
		var className = '';
		if(this.sortOn == header.key) {
			className = 'selected ' + this.sortDirection.toLowerCase();
		}
		tempHTML += '<th class="' + className + ' ' + header.key + '" key="' + header.key + '" intDir="' + header.intDir + '">' + header.name + '</th>';
		i--;
	};
	headersHTML += tempHTML + '</tr></table></div>';
	tableHTML += tempHTML;
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
			tableHTML += '<td class="state">' + electorate.state.toUpperCase() + '</td>';
			tableHTML += '<td class="party" style="color:' + dataInterface.parties[winningParty].colour + '">' + shownCode + '</td>';
			tableHTML += '<td class="margin">' + margin + '%</td>';
			tableHTML += '<td class="status">' + electorate.swingStatus + '</td>';
			/*tableHTML += '<td>' + electorate.populationByAge0_14 + '</td>';
			tableHTML += '<td>' + electorate.populationByAge15_24 + '</td>';
			tableHTML += '<td>' + electorate.populationByAge25_44 + '</td>';
			tableHTML += '<td>' + electorate.populationByAge45_65 + '</td>';
			tableHTML += '<td>' + electorate.populationByAge65plus + '</td>';*/
			//tableHTML += '<td class="medianWeeklyHouseholdIncome">' + electorate.medianWeeklyHouseholdIncome + '</td>';
			//tableHTML += '<td class="mortgagePayments30OrMoreOfIncome">' + electorate.mortgagePayments30OrMoreOfIncome + '</td>';
			//tableHTML += '<td class="unemploymentRateShowNationalAverage">' + electorate.unemploymentRateShowNationalAverage + '</td>';
			//tableHTML += '<td class="bachelorDegree">' + electorate.bachelorDegree + '</td>';
			//tableHTML += '<td>' + electorate.familyCompositionCoupleWithoutChildren + '</td>';
			//tableHTML += '<td class="FamilyCompositionCoupleWithChildren">' + electorate.FamilyCompositionCoupleWithChildren + '</td>';
			tableHTML += '<td class="familyCompositionOneParentFamily">' + electorate.familyCompositionOneParentFamily + '</td>';
			tableHTML += '<td class="bornInAustralia">' + electorate.bornInAustralia + '</td>';
			tableHTML += '<td class="bothParentsBornInAustralia">' + electorate.bothParentsBornInAustralia + '</td>';
			//tableHTML += '<td>' + electorate.grossHouseholdWeeklyIncomeUnder600 + '</td>';
			tableHTML += '<td class="grossHouseholdWeeklyIncomeAbove3000">' + electorate.grossHouseholdWeeklyIncomeAbove3000 + '</td>';
			tableHTML += '<td class="year12SchoolLevelAttained">' + electorate.year12SchoolLevelAttained + '</td>';
			tableHTML += '<td class="childrenInGovernmentsSchools">' + electorate.childrenInGovernmentsSchools + '</td>';
			tableHTML += '<td class="singleIncomeFamilies">' + electorate.singleIncomeFamilies + '</td>';
			tableHTML += '</tr>';
		}
		i--;
	}
	tableHTML += '</table></div>';
	$(placeIn).html(headersHTML + tableHTML)
	
	if(this.selectedKey){
		this.selectedRow = $(placeIn + ' .selected');
	}
	
	if(!$.browser.msie) {
		$(placeIn + ' .resultsTable').jScrollPane({ autoReinitialise: true });
	}

	$(placeIn + ' table tr th').each(function(index) {
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
		$(placeIn + " table tr.resultRow").each(function(index) {
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

ElectorateTable.prototype.statusUp = function(a, b) {
	var A = a.swingStatus.toLowerCase();
	var B = b.swingStatus.toLowerCase();
	if(A < B) {
		return -1;
	} else if(A > B) {
		return 1;
	} else {
		return 0;
	}
}
ElectorateTable.prototype.statusDown = function(a, b) {
	var A = b.swingStatus.toLowerCase();
	var B = a.swingStatus.toLowerCase();
	if(A < B) {
		return -1;
	} else if(A > B) {
		return 1;
	} else {
		return 0;
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

ElectorateTable.prototype.familyCompositionOneParentFamilyDown = function(a, b) {
	return parseFloat(b.familyCompositionOneParentFamily.replace('%', '')) - parseFloat(a.familyCompositionOneParentFamily.replace('%', ''));
}
ElectorateTable.prototype.familyCompositionOneParentFamilyUp = function(a, b) {
	return parseFloat(a.familyCompositionOneParentFamily.replace('%', '')) - parseFloat(b.familyCompositionOneParentFamily.replace('%', ''));
};

ElectorateTable.prototype.bornInAustraliaDown = function(a, b) {
	return parseFloat(b.bornInAustralia.replace('%', '')) - parseFloat(a.bornInAustralia.replace('%', ''));
}
ElectorateTable.prototype.bornInAustraliaUp = function(a, b) {
	return parseFloat(a.bornInAustralia.replace('%', '')) - parseFloat(b.bornInAustralia.replace('%', ''));
};

ElectorateTable.prototype.bothParentsBornInAustraliaDown = function(a, b) {
	return parseFloat(b.bothParentsBornInAustralia.replace('%', '')) - parseFloat(a.bothParentsBornInAustralia.replace('%', ''));
}
ElectorateTable.prototype.bothParentsBornInAustraliaUp = function(a, b) {
	return parseFloat(a.bothParentsBornInAustralia.replace('%', '')) - parseFloat(b.bothParentsBornInAustralia.replace('%', ''));
};

ElectorateTable.prototype.grossHouseholdWeeklyIncomeAbove3000Down = function(a, b) {
	return parseFloat(b.grossHouseholdWeeklyIncomeAbove3000.replace('%', '')) - parseFloat(a.grossHouseholdWeeklyIncomeAbove3000.replace('%', ''));
}
ElectorateTable.prototype.grossHouseholdWeeklyIncomeAbove3000Up = function(a, b) {
	return parseFloat(a.grossHouseholdWeeklyIncomeAbove3000.replace('%', '')) - parseFloat(b.grossHouseholdWeeklyIncomeAbove3000.replace('%', ''));
};

ElectorateTable.prototype.year12SchoolLevelAttainedDown = function(a, b) {
	return parseFloat(b.year12SchoolLevelAttained.replace('%', '')) - parseFloat(a.year12SchoolLevelAttained.replace('%', ''));
}
ElectorateTable.prototype.year12SchoolLevelAttainedUp = function(a, b) {
	return parseFloat(a.year12SchoolLevelAttained.replace('%', '')) - parseFloat(b.year12SchoolLevelAttained.replace('%', ''));
};

ElectorateTable.prototype.childrenInGovernmentsSchoolsDown = function(a, b) {
	return parseFloat(b.childrenInGovernmentsSchools.replace('%', '')) - parseFloat(a.childrenInGovernmentsSchools.replace('%', ''));
}
ElectorateTable.prototype.childrenInGovernmentsSchoolsUp = function(a, b) {
	return parseFloat(a.childrenInGovernmentsSchools.replace('%', '')) - parseFloat(b.childrenInGovernmentsSchools.replace('%', ''));
};

ElectorateTable.prototype.singleIncomeFamiliesDown = function(a, b) {
	return parseFloat(b.singleIncomeFamilies.replace('%', '')) - parseFloat(a.singleIncomeFamilies.replace('%', ''));
}
ElectorateTable.prototype.singleIncomeFamiliesUp = function(a, b) {
	return parseFloat(a.singleIncomeFamilies.replace('%', '')) - parseFloat(b.singleIncomeFamilies.replace('%', ''));
};