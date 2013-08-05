/*******************************************************************************************
 * Overview Panel
 ******************************************************************************************/
OverviewPanel = function() {

}
/**
 * setUp Panel
 */
OverviewPanel.prototype.create = function(id) {
	this.id = id;
	this.searchMessage = 'Search by suburb, postcode or electorate';
	this.currentSeat = 0;
	
	var panelHTML = '<div class="intro"><div class="main-search"><input type="text" name="elecorateName" id="elecorateName" value="' + this.searchMessage + '" /><span class="search-icon"></span></div><a href="https://twitter.com/aus_politics" class="twitter-follow-button" data-show-count="false">Follow @aus_politics</a></div>';
	panelHTML += '<div class="leftCol"><h2>Seats to Watch</h2><div class="nav"><div class="back"></div><div class="num">0 of 0</div><div class="next"></div></div><div class="seats"><div class="seatsHolder"></div></div></div>';
	panelHTML += '<div class="rightCol">';
	//panelHTML += '<div class="callout electSearch"><h2>electorate  search</h2><p>View the key seats and search for information about each electorate including candidates and demographic data.</p><input type="text" name="elecorateName" id="elecorateName" value="'+this.searchMessage+'" class="message"></input></div>';
	panelHTML += '<div class="callout swing"><h2>Swing-o-meter</h2><p>See how vote swings in either direction can affect the outcome of the election.</p><div class="pageBtn">Try the swing-o-meter</div></div>';
	panelHTML += "<div class='callout polling'><h2>Polling</h2><p>Find out what Queensland really thinks with Newspoll's insights into voters' preferred party and Premier.</p><div class='pageBtn'>View the latest polls</div></div>";
	//panelHTML += '<div class="callout twitter"><h2>Twitter</h2><p>Find out what Queensland really thinks with Newspoll\'s insights into voters\' preffered party and Premier.</p><div class="pageBtn">View the latest headlines</div></div>';
	panelHTML += '</div>';
	return panelHTML;
}
/**
 * setUp Panel
 */
OverviewPanel.prototype.setUp = function() {
	var selfRef = this;
	if(!this.isBuilt) {
		this.isBuilt = true; 
		
		! function(d, s, id) {
			var js, fjs = d.getElementsByTagName(s)[0];
			if(!d.getElementById(id)) {
				js = d.createElement(s);
				js.id = id;
				js.src = "//platform.twitter.com/widgets.js";
				fjs.parentNode.insertBefore(js, fjs);
			}
		}(document, "script", "twitter-wjs");
		
		$(dataInterface).bind(dataInterface.ELECTORATES_LOADED, function() {
			selfRef.build();
		})
		dataInterface.requestElectorates();
	}
}
/**
 * Build
 */
OverviewPanel.prototype.build = function() {
	var selfRef = this;
	$(dataInterface).unbind(dataInterface.ELECTORATES_LOADED);

	// build the search box
	var districtNames = [];
	this.seatsToWatch = []
	for (var i=0; i < dataInterface.electorates.length; i++) {
		var electorate = dataInterface.electorates[i]
		if(electorate.keyseat) {
			this.seatsToWatch.push(electorate);
			//
		}
		districtNames.push(electorate.name);
	}
	// Build the seats to watch
	for(var i = 0; i < this.seatsToWatch.length; i++) {
		var electorate = this.seatsToWatch[i];
		var seatHTML = '<div class="seat"><h3>' + electorate.seat + '</h3>';
		var imageName = electorate.seat.split(' ').join('-').toLowerCase();
		seatHTML += '<img src="img/'+imageName+'.jpg" width="220px" height="180px"/>'
		seatHTML += '<div class="description"><p>'+electorate.description+'</p><div class="pageBtn" key="'+electorate.seat+'">View seat in detail</div></div>';
		seatHTML += '<div class="clear"></div>'
		$('.seatsHolder').append(seatHTML);
	}
	// build set link
	$('.seat .pageBtn').each(function(index) {
		$(this).click(function() {
			selfRef.openElectorate($(this).attr("key"));
		});
	});

	// add the list of names to the auto complete
	this.autoComplete = $('#panel-overview input').autocomplete(dataInterface.searchList, {showCount:1, appendNextToInput:1, formatMatch: function (row) {
		//console.log(row);
		if (row.type === "Electorate") {
			return row.name;
		}
		else if (row.type === "Suburb") {
			return [row.suburb, row.postcode];
		}
	}}).result(function(event, item) {
			var electorate = item.name;
			$(this).val(selfRef.searchMessage);
			selfRef.openElectorate(electorate);
	});
	//
	$('#panel-overview input').focus(function() {
 		 if($(this).val()==selfRef.searchMessage){
 		 	$(this).val('')
 		 	$(this).removeClass('message');
 		 }
	});
	$('#panel-overview input').blur(function() {
 		 if($(this).val()==''){
 		 	$(this).val(selfRef.searchMessage)
 		 	$(this).addClass('message');
 		 }
	});
	
	// input change test
	$('#panel-overview input').keypress(function(e) {
		if(e.which == 13) {
			var electorate = $(this).val();
			$(this).val(selfRef.searchMessage);
			$(this).addClass('message');
			selfRef.openElectorate(electorate);
			
		}
	});
	//btns
	$('#panel-overview .swing .pageBtn').click(function(e) {
		$(selfRef).trigger('panelSelected', 2);
	});
	$('#panel-overview .polling .pageBtn').click(function(e) {
		$(selfRef).trigger('panelSelected', 3);
	});
	//seats nav
	$('#panel-overview .nav .back').click(function(e) {

		if(selfRef.currentSeat > 0) {
			selfRef.moveToSeat(selfRef.currentSeat - 1)
		}
	});
	$('#panel-overview .nav .next').click(function(e) {

		if(selfRef.currentSeat < selfRef.seatsToWatch.length - 1) {
			selfRef.moveToSeat(selfRef.currentSeat + 1)
		}
	});
	this.moveToSeat(0);
}
/**
 * Open OverviewPanel
 */
OverviewPanel.prototype.openElectorate = function(electorate) {
	
	$(this).trigger('panelSelected', [1, {
		electorate : electorate
	}]);
}
/**
 * Open Panel
 */
OverviewPanel.prototype.moveToSeat = function(id) {
	var margin = -515 * id;
	this.currentSeat = id;
	$('.nav .num').html((this.currentSeat + 1) + ' of ' + this.seatsToWatch.length)
	$('.seatsHolder').stop();
	$('.seatsHolder').animate({
		'margin-left' : margin
	});
	if (this.currentSeat==this.seatsToWatch.length-1){
		$('#panel-overview .nav .next').addClass('disable');
	} else {
		$('#panel-overview .nav .next').removeClass('disable');
	}
	if (this.currentSeat==0){
		$('#panel-overview .nav .back').addClass('disable');
	} else {
		$('#panel-overview .nav .back').removeClass('disable');
	}
}
/**
 * Open Panel
 */
OverviewPanel.prototype.opened = function() {
	$('#panel-electorates input').val(this.searchMessage);
	$('#panel-electorates input').addClass('message');	
}
/**
 * Close Panel
 */
OverviewPanel.prototype.closed = function() {
	
	
};