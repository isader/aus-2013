String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function ColourExt() {
}

ColourExt.prototype.hex = function(c) {
	var s = "0123456789abcdef";
	var i = parseInt(c);
	if(i == 0 || isNaN(c))
		return "00";
	i = Math.round(Math.min(Math.max(0, i), 255));
	return s.charAt((i - i % 16) / 16) + s.charAt(i % 16);
}
/* Convert an RGB triplet to a hex string */
ColourExt.prototype.convertToHex = function(rgb) {
	return this.hex(rgb[0]) + this.hex(rgb[1]) + this.hex(rgb[2]);
}
/* Remove '#' in color hex string */
ColourExt.prototype.trimHash = function(s) {
	return (s.charAt(0) == '#') ? s.substring(1, 7) : s;
}
/* Convert a hex string to an RGB triplet */
ColourExt.prototype.convertToRGB = function(hex) {
	var color = [];
	color[0] = parseInt((this.trimHash(hex)).substring(0, 2), 16);
	color[1] = parseInt((this.trimHash(hex)).substring(2, 4), 16);
	color[2] = parseInt((this.trimHash(hex)).substring(4, 6), 16);
	return color;
}
// @format (hex|rgb|null) : Format to return, default is integer
ColourExt.prototype.randomColor = function() {
	return Math.round(0xffffff * Math.random()).toString(16);
}
/** 
* Converts a hex number back to an integer, uses the javascript parseInt method 
* with a base number (or radix) of 16. EG: parseInt("0x" + hex); 
* 
* @param {String} hex The hex code to convert 
* @returns {Integer} The integer conversion of the hex number 
*/  
ColourExt.prototype.hexToInt = function(hex) {  
    return parseInt("0x" + hex);  
}
ColourExt.prototype.hsvToRgb = function(h, s, v) {
	var s = s / 100, v = v / 100;
	var hi = Math.floor((h / 60) % 6);
	var f = (h / 60) - hi;
	var p = v * (1 - s);
	var q = v * (1 - f * s);
	var t = v * (1 - (1 - f) * s);
	var rgb = [];
	switch (hi) {
		case 0:
			rgb = [v, t, p];
			break;
		case 1:
			rgb = [q, v, p];
			break;
		case 2:
			rgb = [p, v, t];
			break;
		case 3:
			rgb = [p, q, v];
			break;
		case 4:
			rgb = [t, p, v];
			break;
		case 5:
			rgb = [v, p, q];
			break;
	}
	var r = Math.min(255, Math.round(rgb[0] * 256)), g = Math.min(255, Math.round(rgb[1] * 256)), b = Math.min(255, Math.round(rgb[2] * 256));
	return [r, g, b];

}
/**
 * Given to colours and the percent you want to be between them will return you a colour
 */
ColourExt.prototype.getPointInFade = function(startColour, endColour, perecent) {

	var start = this.convertToRGB(startColour);
	var end = this.convertToRGB(endColour);
	var c = [];
	c[0] = start[0] * perecent + (1 - perecent) * end[0];
	c[1] = start[1] * perecent + (1 - perecent) * end[1];
	c[2] = start[2] * perecent + (1 - perecent) * end[2];
	return this.convertToHex(c);
}

function NumberExt() {
}

NumberExt.prototype.addCommas = function(nStr) {
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
}
NumberExt.prototype.addDot = function(nStr) {
  nStr += '';
  x = nStr.split('.');
  x1 = x[0];
  x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + '.' + '$2');
  }
  return x1 + x2;
}
var numberExt = new NumberExt();


function MathExt() {
}

MathExt.prototype.roundNumber = function(num, dec) {
	var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
	return result;
};

var mathExt = new MathExt();
