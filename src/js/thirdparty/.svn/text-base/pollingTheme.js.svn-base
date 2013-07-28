/**
 * Grid theme for Highcharts JS
 * @author Ryan O'Connell
 */
Highcharts.theme = {
	colors: ['#ef5b46', '#469bb8', '#277e9c', '#129312', '#f1e543', '#013801', '#bcbcbc', '#918f75'],
	symbols: ['diamond', 'diamond', 'diamond', 'diamond', 'diamond', 'diamond'],
	chart: {
		backgroundColor: '#ffffff',
		borderWidth: 0,
		plotBackgroundColor: '#e0e0de',
		plotShadow: false,
		plotBorderWidth: 0,
		showAxes : true,
		reflow : false,
		marginLeft : 30,
		marginRight : 0,
		zoomType: 'x',
		spacingBottom : 80,
		style: {color: '#666',
				fontFamily: 'Arial, Verdana, sans-serif',
				fontSize: '11px'
			}
		//width : 424
	},
	plotOptions: {
		line: {
			lineWidth: 2	
		},
		column: {
			borderWidth : 0
		}
	},
	labels : {	
		items : [{html: 'KEY', style: {left: '0px', top: '322px'}}] 
	},
	xAxis: {
		labels: {
			align : 'center',
            x: 0,
            y: 15
		},
		gridLineColor : '#ffffff',
		gridLineDashStyle : 'Solid',
		gridLineWidth: 1,
		lineColor: '#000',
		lineWidth: 3,
		tickColor: '#000',
		tickWidth: 3,
		title: {text: ''},
		type: 'datetime',
		maxZoom: 5 * 24 * 3600000
	},
	yAxis: {
		gridLineColor : '#ffffff',
		gridLineDashStyle : 'Solid',
		gridLineWidth: 1,
		minorGridLineColor : '#ffffff',
		minorGridLineDashStyle  : 'solid',
		minorTickInterval: 2,
		lineColor: '#000',
		lineWidth: 0,
		tickWidth: 0,
		tickColor: '#000',
		title: 
			{text: null},
		labels: {
			align: 'right',
			style: {
				
			}
		}
	},
	legend: {
		borderWidth: 1,
		borderRadius: 0,
		borderColor: '#dfded2',
		align : 'left',
		verticalAlign  : 'bottom',
		x: 0,
		y: 50,
		itemStyle: {			
			color: '#277f9c'
		},
		itemHoverStyle: {
			color: '#004563'
		},
		itemHiddenStyle: {
			color: '#e0e0de'
		}
	},
	title: { text: ''},
	tooltip: {
		backgroundColor: '#fff',
		borderRadius: 0,
		borderWidth: 0,
		shared: true,
		crosshairs: [{
            width: 1,
            color: '#000'
        }],
		style: {
			color: '#333333',
			fontSize: '8pt'
		}
	},
	credits: {
		enabled: false
	}
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
	
