if( typeof console == "undefined") {
	this.console = {
		log : function() {
		}
	};
}

function trace(message) {
	$('#trace').append(message + '<br>')
}


$(document).ready(function() {
	new TabPanels();
});
/*******************************************************************************************
 * TabPanels Boxes
 ******************************************************************************************/
/**
 * Init the TabPanels Boxes
 */
TabPanels = function() {
	
	
	// vars
	this.currentPanel = 0;
	this.panelList = [];
	this.panelHeight = 640;
	// a list of the panels to display
	// define the panels
	
	this.panelList.push({
		name : 'Overview',
		id : 'overview',
		panel : new OverviewPanel(),
		showMap : false
	});
	this.panelList.push({
		name : 'Electorates',
		id : 'electorates',
		panel : new ElectoratesPanel(),
		showMap : true
	});
	/**
	this.panelList.push({
		name : 'Swing-o-meter',
		id : 'swing',
		panel : new SwingPanel(),
		showMap : true
	});
	**/
	this.panelList.push({
		name : 'Newspoll',
		id : 'newspoll',
		panel : new NewsPoll(),
		showMap : false
	});

	
	
	this.loadData();
}
/**
 * Load data
 */
TabPanels.prototype.loadData = function() {
	var selfRef = this;
	$(dataInterface).bind(dataInterface.ELECTORATES_LOADED, function() {
		selfRef.dataLoaded();
	})
	dataInterface.requestElectorates();

}
TabPanels.prototype.dataLoaded = function() {
	$(dataInterface).unbind(dataInterface.ELECTORATES_LOADED);
	this.buildMenu();
	this.buildPanels();
	this.moveToPanel(0);
	regionMap.buildMap('map');
	$('#loading').hide();
	$('#main').show();
}
/**
 * Build up the menu
 */
TabPanels.prototype.buildMenu = function() {
	var selfRef = this;
	for(var i = 0; i < this.panelList.length; i++) {
		var classname = this.panelList[i].id;
		$('#nav ul').append('<li id="menu-' + i + '" class="' + classname + '">' + this.panelList[i].name + '</li>')
		$('#menu-' + i).click(function() {
			var id = Number($(this).attr('id').split('-')[1]);
			selfRef.moveToPanel(id);
		});
	}
}
/**
 * Build up each Panel
 */
TabPanels.prototype.buildPanels = function() {
	var selfRef = this;

	for(var i = 0; i < this.panelList.length; i++) {
		var panel = this.panelList[i].panel;

		$(panel).bind('panelSelected', function(event, id, data) {

			selfRef.moveToPanel(id, data);
		});

		$(panel).bind('hideMap', function(event) {
			selfRef.hideMap();
		});
		$(panel).bind('showMap', function(event) {
			selfRef.showMap();
		});
		var id = this.panelList[i].id;
		$('#contentHolder').append('<div class="panel" id="panel-' + id + '">' + panel.create(id) + '</div>');

	};
	$('#contentHolder .panel').each(function(id) {
		$(this).css("top", (selfRef.panelHeight * id) + 'px');
	});
}
/**
 * Move To Next Panel
 */
TabPanels.prototype.nextPanel = function() {
	this.moveToPanel(this.currentPanel + 1)
}
/**
 * Move To Panel
 */
TabPanels.prototype.moveToPanel = function($id, $data) {
	this.closePanel();
	var classname = this.panelList[this.currentPanel].id;
	$('#menu-' + this.currentPanel).removeClass(classname + 'Selected');
	this.currentPanel = $id;
	classname = this.panelList[this.currentPanel].id;
	$('#menu-' + this.currentPanel).addClass(classname + 'Selected');
	var selfRef = this;
	this.setUpPanel();
	var margin = -this.currentPanel * this.panelHeight
	this.currentPageData = $data
	$('#contentHolder').animate({
		'margin-top' : margin
	}, 0, function() {
		selfRef.panelOpened(selfRef.currentPageData);
	});
	$(".table-seats").hide();
}
/**
 * setUp Panel
 */
TabPanels.prototype.setUpPanel = function() {
	this.panelList[this.currentPanel].panel.setUp();
	if(!this.panelList[this.currentPanel].showMap) {
		this.hideMap();
	}

}
/**
 * Open Panel
 */
TabPanels.prototype.panelOpened = function($data) {
	this.panelList[this.currentPanel].panel.opened($data);
	if(this.panelList[this.currentPanel].showMap) {
		this.showMap();
	} else {
		this.hideMap();
	}
}
TabPanels.prototype.showMap = function() {
		$('#map').css('top', '67px');
}
TabPanels.prototype.hideMap = function() {
		$('#map').css('top', '640px');
}

/**
 * Close Panel
 */
TabPanels.prototype.closePanel = function() {
	this.panelList[this.currentPanel].panel.closed();
};