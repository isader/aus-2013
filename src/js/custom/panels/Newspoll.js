/*******************************************************************************************
 * Overview Panel
 ******************************************************************************************/
NewsPoll = function() {

}
/**
 * setUp Panel
 */
NewsPoll.prototype.create = function(id) {
	this.id = id;
	this.isBuilt = false;
	this.daysOfTheWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	this.monthsOfTheYear =  [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
	var panelHTML = '<div class="panelHeader"><h1>State Polling</h1><h2></h2></div><div class="graphs">';
	panelHTML += '<div class="graph"><h2>TWO-PARTY PREFERRED</h2><p>Two-party preferred based on preference flow at August 2009 QLD election</p><div class="graphDisplay" id="twoPartyPrefered"></div></div>';
	panelHTML += '<div class="graph"><h2>PRIMARY VOTE</h2><p>If a state election was held today, which of the folling would you vote for?  If "uncommitted", to which one of these do you have a leaning? </p><div class="graphDisplay" id="primaryVote"></div></div>';
	panelHTML += '<div class="graph"><h2>BETTER PREMIER</h2><p>Who do you think would make the better premier?</p><div class="graphDisplay" id="betterPM"></div></div>';
	panelHTML += '<div class="graph"><h2>LEADERS NET SATISFACTION</h2><p>Are you satisfied or dissatisfied with the way... is doing his / her job as premier /  leader of the opposition?</p><div class="graphDisplay" id="satisfaction"></div></div></div><div id="loading"><img src="img/aus-spinner.gif"></div>';
	return panelHTML;
}
/**
 * setUp Panel
 */
NewsPoll.prototype.setUp = function() {
	var selfRef = this;
	if(!this.isBuilt) {
		this.isBuilt = true;
		$(dataInterface).bind(dataInterface.NEWSPOLL_LOADED, function() {
			selfRef.buildGraphs();
		})
		dataInterface.requestNewspoll();
	}
}
/**
 * Build Graphs
 */
NewsPoll.prototype.buildGraphs = function() {
	$('#panel-newspoll .graphs').show();
	$('#panel-newspoll #loading').hide();
	if(!$.browser.msie) {
		$('#panel-newspoll .graphs').jScrollPane();
	}
	var lastdate = dataInterface.twoPartyPerferred[0].date.split('-');
	$('#panel-newspoll .panelHeader h2').html('Latest Poll Results '+lastdate[2]+'/'+lastdate[1]+'/'+lastdate[0]);
	this.buildTwoPartyPreferred();
	this.buildPrimary();
	this.buildBetterPM();
	this.buildNetSatisfaction();
}
/**
 * Build Two Party Perferred
 */
NewsPoll.prototype.buildNetSatisfaction = function() {
	var selfRef = this;
	var partyData ={};
	partyData['ALP'] = [];
	partyData['LIB'] = [];
	partyData['NAT'] = [];

	// place the data into parties
	for (var i=0; i < dataInterface.satisfaction.length; i++) {
	 	var dataPoint = dataInterface.satisfaction[i];
	 	// add gov data
	 	if (partyData[dataPoint.party_id]==null){
	 		partyData[dataPoint.party_id] = [];
	 	}
	 	var dateBreakdown = dataPoint.date.split('-');
		var formatedDate = Date.UTC(Number(dateBreakdown[0]),Number(dateBreakdown[1])-1,Number(dateBreakdown[2]));
	 	partyData[dataPoint.party_id].push([formatedDate,Number(dataPoint.satisfied)-Number(dataPoint.dissatisfied)]);	 		 	
	};
	// reformat for a highcharts series
	var seriesData =[];
	for(var key in partyData){
		seriesData.push({name:key,data:partyData[key]});
	}	
	this.twoPartyGraph = new Highcharts.Chart({
         chart: {         	
            renderTo: 'satisfaction',
            type: 'line'
         },
          tooltip: {
        	formatter:function(){ selfRef.tooltipsSatisfaction(this); return false;},
       		shared: true
    	},
         colors: ['#ef5b46',  '#277e9c',  '#c6cb8b'],	 
    	legend: {y : 65},
		  xAxis: {labels: {align : 'center',x: 0, y: 25}},
         series: seriesData
      });
}
/** 
* Formats the toolstips as the user rolls over the graphs
* Add and key markers if they are found for the current data
*/
NewsPoll.prototype.tooltipsSatisfaction = function(point) {
		var selfRef = this;
		var colours = {}
	colours['ALP'] = '#ef5b46';
	colours['LIB'] = '#277e9c';
	colours['NAT'] = '#f1e543';
	$(document).unbind('mousemove', function(e){ selfRef.tooltipFollow(e) }); 
	$(document).bind('mousemove', function(e){ selfRef.tooltipFollow(e) }); 
	
	var date = new Date(point.x);
	var dayName = this.daysOfTheWeek[date.getDay()];
	var monthName = this.monthsOfTheYear[date.getMonth()].substring(0,3);
	var tooltipStr = '<span class="dateTitle">'+dayName+ ', '+ monthName+ ' ' +date.getDate()+', '+ date.getFullYear()+'</span>';
	var dataPoints = this.findDataPointByDate(date,dataInterface.satisfaction,true)
	var i = dataPoints.length-1;
	var expandGraph = 1.33;
	while(i>=0){
		var dataPoint = dataPoints[i];
		var offset = (100- (Number(dataPoint.dissatisfied)+Number(dataPoint.satisfied)))/2
		var colour = colours[dataPoint.party_id];
		tooltipStr +=  '<div class="grathBarSat" style="margin-left:'+offset+'px">'
		tooltipStr +=  '<div style="width:'+(Math.abs(Number(dataPoint.dissatisfied))*expandGraph)+'px !important;" class="bar0">'+dataPoint.dissatisfied+'</div>';
	 
		tooltipStr +=  '<div style="background-color:'+colour+' !important; width:'+Math.abs(Number(dataPoint.satisfied)*expandGraph)+'px !important;" class="bar1">'+dataPoint.satisfied+'</div>';
		tooltipStr +=  '</div><div class="clear"></div>'
		i--;
	}

	 $('#graphToolTip').html('');
	 $('#graphToolTip').html(tooltipStr);
	 this.showTooltip();
	// Returning false disables the native highcarts tooltip;

	
}

/**
 * Build Two Party Perferred
 */
NewsPoll.prototype.buildTwoPartyPreferred = function() {
	var selfRef = this;
	var partyData ={};
	// place the data into parties
	for (var i=0; i < dataInterface.twoPartyPerferred.length; i++) {
	 	var dataPoint = dataInterface.twoPartyPerferred[i];
	 	// add gov data
	 	if (partyData[dataPoint.gov_key]==null){
	 		partyData[dataPoint.gov_key] = [];
	 	}
	 	var dateBreakdown = dataPoint.date.split('-');
		var formatedDate = Date.UTC(Number(dateBreakdown[0]),Number(dateBreakdown[1])-1,Number(dateBreakdown[2]));
	 	partyData[dataPoint.gov_key].push([formatedDate,Number(dataPoint.gov_percent)]);
	 	// add opposition data
	 	if (partyData[dataPoint.opp_key]==null){
	 		partyData[dataPoint.opp_key] = [];
	 	}	 	
	 	partyData[dataPoint.opp_key].push([formatedDate,Number(dataPoint.opp_percent)]);
	 	
	};
	// reformat for a highcharts series
	var seriesData =[];
	for(var key in partyData){	
		seriesData.push({name:key,data:partyData[key]});
	}	
	this.twoPartyGraph = new Highcharts.Chart({
         chart: {
         	
            renderTo: 'twoPartyPrefered',
            type: 'line'
         },
         tooltip: {
        	formatter:function() { selfRef.tooltipsTwoParty(this); return false},
       		shared: true
    	},
         colors: ['#ef5b46', '#469bb8', '#277e9c', , '#7a7a7a'],
		 
    	legend: {y : 65},
		  xAxis: {labels: {align : 'center',x: 0, y: 25}},
         series: seriesData
      });
}

NewsPoll.prototype.tooltipsTwoParty = function(point) {
	var selfRef = this;
	$(document).unbind('mousemove', function(e){ selfRef.tooltipFollow(e) }); 
	$(document).bind('mousemove', function(e){ selfRef.tooltipFollow(e) }); 
	var date = new Date(point.x);
	var dayName = this.daysOfTheWeek[date.getDay()];
	var monthName = this.monthsOfTheYear[date.getMonth()].substring(0,3);
	var tooltipStr = '<span class="dateTitle">'+dayName+ ', '+ monthName+ ' ' +date.getDate()+', '+ date.getFullYear()+'</span>';
tooltipStr +=  '<div class="grathBar">'
	$.each(point.points, function(i, point) {
		 //point.series.color
		 tooltipStr +=  '<div style="background-color:'+point.series.color+' !important; width:'+(Math.abs(point.y)*1.33)+'px !important;" class="bar'+i+'">'+point.y+'</div>';
	});
	tooltipStr +=  '</div><div class="clear"></div>'
	 $('#graphToolTip').html('');
	 $('#graphToolTip').html(tooltipStr);
	 this.showTooltip();
}


/**
 * Build Two Party Perferred
 */
NewsPoll.prototype.buildBetterPM = function() {
	var selfRef = this;
	var partyData ={};
	// place the data into parties
	for (var i=0; i < dataInterface.betterPM.length; i++) {
	 	var dataPoint = dataInterface.betterPM[i];
	 	// add gov data
	 	if (partyData[dataPoint.gov_party_key]==null){
	 		partyData[dataPoint.gov_party_key] = [];
	 	}
	 	var dateBreakdown = dataPoint.date.split('-');
		var formatedDate = Date.UTC(Number(dateBreakdown[0]),Number(dateBreakdown[1])-1,Number(dateBreakdown[2]));
		var count = Number(dataPoint.gov_percent)
		if (count<0){
		 		count = null
		 	} 
	 	partyData[dataPoint.gov_party_key].push([formatedDate,count]);
	 	// add opposition data
	 	if (partyData[dataPoint.opp_party_key]==null){
	 		partyData[dataPoint.opp_party_key] = [];
	 	}
	 	count = Number(dataPoint.opp_percent)
		if (count<0){
		 		count = null
		 	} 
	 	partyData[dataPoint.opp_party_key].push([formatedDate,count]);
	 	
	};
	// reformat for a highcharts series
	var seriesData =[];
	for(var key in partyData){
		seriesData.push({name:key,data:partyData[key]});
	}
	this.twoPartyGraph = new Highcharts.Chart({
         chart: {
            renderTo: 'betterPM',
            type: 'line'
         },   
          tooltip: {
        	formatter:function(){ selfRef.tooltipBetterPM(this); return false;},
       		shared: true
    	},
    	legend: {y : 65},
		  xAxis: {labels: {align : 'center',x: 0, y: 25}},
         series: seriesData
      });
}


/** 
* Formats the toolstips as the user rolls over the graphs
* Add and key markers if they are found for the current data
*/
NewsPoll.prototype.tooltipBetterPM = function(point) {
		var selfRef = this;
	$(document).unbind('mousemove', function(e){ selfRef.tooltipFollow(e) }); 
	$(document).bind('mousemove', function(e){ selfRef.tooltipFollow(e) }); 
	var date = new Date(point.x);
	var dayName = this.daysOfTheWeek[date.getDay()];
	var monthName = this.monthsOfTheYear[date.getMonth()].substring(0,3);
	var tooltipStr = '<span class="dateTitle">'+dayName+ ', '+ monthName+ ' ' +date.getDate()+', '+ date.getFullYear()+'</span>';
	var dataPoint = this.findDataPointByDate(date,dataInterface.betterPM);
	
	$.each(point.points, function(i, point) {
		 //point.series.color
		 var laederName = dataPoint.gov_leader;
		 if (point.series.name==dataPoint.opp_party_key){
		 	laederName = dataPoint.opp_leader;
		 }
		 
		 tooltipStr +=  '<div class="graphData"><span>'+laederName+'</span></div>';
		 tooltipStr +=  '<div class="graphData"><div style="background-color:'+point.series.color+' !important; width:'+Math.abs(point.y)+'px !important;"></div><span>'+ point.y+'%</span></div>';
	});

	 $('#graphToolTip').html('');
	 $('#graphToolTip').html(tooltipStr);
	 this.showTooltip();
	// Returning false disables the native highcarts tooltip;

	
}

/**
 * Build Two Party Perferred
 */
NewsPoll.prototype.buildPrimary = function() {
	var selfRef = this;
	var partyData ={};
	var partyPoint = {};
	partyData['ALP'] = [];
	partyData['LIB'] = [];
	partyData['LNP'] = [];
	partyData['GRN'] = [];
	partyData['NAT'] = [];
	partyData['DEM'] = [];
	partyData['ONE'] = [];
	partyData['OTH'] = [];
	// place the data into parties
	for (var i=0; i < dataInterface.primary.length; i++) {
	 	var dataPoint = dataInterface.primary[i];
	 	var dateBreakdown = dataPoint.date.split('-');
		var formatedDate = Date.UTC(Number(dateBreakdown[0]),Number(dateBreakdown[1])-1,Number(dateBreakdown[2]));

		var parties = dataPoint.primary_vote.split(';');
		for (var h = 0; h < parties.length - 1; h++) {
			var party = parties[h].split(':');
			if (party[0] === "APL") {
				party[0] = "ALP";
			}
			else if (party[0] === "LIB_NAT") {
				party[0] = "LNP";
			}
			partyPoint[party[0]] = party[1];
		}

	 	// loop over parties
	 	for(var key in partyData) {
		 	if (partyData[key] == null) {
		 		partyData[key] = [];
		 	}
		 	var count = Number(partyPoint[key]);
		 	if (count < 0){
		 		count = null
		 	} 
		 	partyData[key].push([formatedDate,count]);
		 }	 	
	};
	// reformat for a highcharts series
	var seriesData =[];
	for(var key in partyData){	
		seriesData.push({name:key,data:partyData[key]});
	}
	this.twoPartyGraph = new Highcharts.Chart({
         chart: {
            renderTo: 'primaryVote',
            type: 'line'
         },
          tooltip: {
        	formatter:function(){ selfRef.tooltips(this); return false;},
       		shared: true
    	},
    	legend: {y : 65},
		  xAxis: {labels: {align : 'center',x: 0, y: 25}},
         series: seriesData
      });
}
/** 
* Formats the toolstips as the user rolls over the graphs
* Add and key markers if they are found for the current data
*/
NewsPoll.prototype.tooltips = function(point) {
		var selfRef = this;
	$(document).unbind('mousemove', function(e){ selfRef.tooltipFollow(e) }); 
	$(document).bind('mousemove', function(e){ selfRef.tooltipFollow(e) }); 
	var date = new Date(point.x);
	var dayName = this.daysOfTheWeek[date.getDay()];
	var monthName = this.monthsOfTheYear[date.getMonth()].substring(0,3);
	var tooltipStr = '<span class="dateTitle">'+dayName+ ', '+ monthName+ ' ' +date.getDate()+', '+ date.getFullYear()+'</span>';
	
	$.each(point.points, function(i, point) {
		 //point.series.color
		 tooltipStr +=  '<div class="graphData"><div style="background-color:'+point.series.color+' !important; width:'+Math.abs(point.y)+'px !important;"></div><span>'+point.series.name+ ': ' + point.y+'</span></div>';
	});

	 $('#graphToolTip').html('');
	 $('#graphToolTip').html(tooltipStr);
	 this.showTooltip();
	// Returning false disables the native highcarts tooltip;

	
}
/**
 * Open Panel
 */
NewsPoll.prototype.opened = function() {
}
/**
 * Close Panel
 */
NewsPoll.prototype.closed = function() {
}


/**
* Make the tooltip follow the mouse
*/
NewsPoll.prototype.tooltipFollow = function(e){
	
		$('#graphToolTip').css('left', e.pageX - 275);
		$('#graphToolTip').css('top', e.pageY);
		
		var showTip = false
		// See if the mouse is within any of the graph areas
		$('.highcharts-container').each(function(index) {
			var parent,
				offset,
				leftEdge,
				width,
				topEdge,
				height;
			
			parent = $(this);
			offset = $(this).offset();
			leftEdge = offset.left + Highcharts.theme.chart.marginLeft;
			width = $(parent).width() - Highcharts.theme.chart.marginLeft;
			topEdge = offset.top;
			height =  $(parent).height() - Highcharts.theme.chart.spacingBottom;
			
			if (e.pageX > leftEdge && e.pageX < leftEdge + width){
				if (e.pageY > topEdge && e.pageY < topEdge + height){
					showTip = true;
				}
			}
		});
		
		if(showTip){
			this.showTooltip(); 
		} else {
			this.hideTooltip();
		}
	}
	
NewsPoll.prototype.showTooltip = function() {
	 //$('#graphToolTip').fadeIn(100);
	 $('#graphToolTip').show();
	 //clearInterval(tooltipHideInterval);
}


NewsPoll.prototype.hideTooltip = function() {
	//$('#graphToolTip').fadeOut(100);
	$('#graphToolTip').hide();
	
}
/** 
* Loops through a dataset and finds a dataset by date
*/
NewsPoll.prototype.findDataPointByDate= function(date,dataset,multi){
	var dataPoints = []
	var i = dataset.length-1;
	var lookingdate = Date.UTC(date.getFullYear(),date.getMonth(),date.getDate());
	while(i>=0){
		var dataPoint = dataset[i];
	
		var dateBreakdown = dataPoint.date.split('-');
		var formatedDate = Date.UTC(Number(dateBreakdown[0]),Number(dateBreakdown[1])-1,Number(dateBreakdown[2]));
		
		
		if (lookingdate==formatedDate){
			if (multi){
				dataPoints.push(dataPoint)
			} else {
				return dataPoint;
			}
			
		}
		i--;
	}
	return dataPoints;
};