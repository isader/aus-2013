/*******************************************************************************************
 * SwingControler
 ******************************************************************************************/
/**
 * Init the SwingControler
 */
SwingControler = function(id) {
	var selfRef = this;
	//this.rotation = 0;
	//this.rotationRange = 90;
	//this.percentMax = 100;
	//this.widthRange = 600;
	//this.xRange = 100;
	//this.startX = 0;
	this.id = id;
	this.currentPercent = 0;
	/*
	if($.browser.msie) {
		this.basic = true;
	} else {
		this.basic = false;
	}
	this.basicClass = '';
	if(this.basic) {
		this.basicClass = 'basic';
	}
	*/
	$(this.id).append('<div class="swingLeft"></div><div class="swingRight"></div><div id="swing-slider"></div><div class="key"><label class="value">0%</label><label class="reset">reset</label></div>')
	this.slider = $("#swing-slider");
	/*
	$(this.id).mousedown(function(e) {
		selfRef.startDrag(e);
	});
*/
	$(this.id + ' .reset').click(function() {
		selfRef.currentPercent = 0;
		selfRef.slider.slider('value', selfRef.currentPercent);
		$(selfRef).trigger('change', selfRef.currentPercent);
		//selfRef.reset();
	});
	$(this.id + ' .swingLeft').click(function() {
		selfRef.currentPercent = selfRef.currentPercent - 1;
		selfRef.slider.slider('value', selfRef.currentPercent);
		$(selfRef).trigger('change', selfRef.currentPercent);
	});
	$(this.id + ' .swingRight').click(function() {
		selfRef.currentPercent = selfRef.currentPercent + 1;
		selfRef.slider.slider('value', selfRef.currentPercent);
		$(selfRef).trigger('change', selfRef.currentPercent);
	});
	/*
	if(this.basic) {
		this.rangeCenter = -((this.widthRange) / 2 - $(this.id + ' .swingControl').width() / 2);
		$(this.id + ' .swingControl span').css('margin-left', this.rangeCenter + 'px');
	}
*/
    this.slider.slider({
      range: "min",
      value: 0,
      min: -100,
      max: 100,
      stop: function(event, ui) {
      	//console.log(ui.value);
      	selfRef.currentPercent = ui.value;
		$(selfRef).trigger('change', selfRef.currentPercent);
      }
    });

    SwingControler.prototype.reset = function() {
		this.currentPercent = 0;
		this.slider.slider('value', this.currentPercent);
		$(this).trigger('change', this.currentPercent);
	}
/*
    function disableSliderTrack($slider){
	    $slider.bind("mousedown", function(event) {
	    	console.log(isTouchInSliderHandle($(this), event));
	        return isTouchInSliderHandle($(this), event);   
	    });

	    $slider.bind("touchstart", function(event) {
	    	console.log(isTouchInSliderHandle($(this), event));
	        return isTouchInSliderHandle($(this), event.originalEvent.touches[0]);
	    });
	}

	function isTouchInSliderHandle($slider, coords){
	    var x = coords.pageX;
	    var y = coords.pageY;

	    var $handle = $slider.find(".ui-slider-handle");

	    var left = $handle.offset().left;
	    var right = (left + $handle.outerWidth());
	    var top = $handle.offset().top;
	    var bottom = (top + $handle.outerHeight());

	    return (x >= left && x <= right && y >= top && y <= bottom);    
	}
	
	disableSliderTrack(this.slider);
*/

}
/**
SwingControler.prototype.startDrag = function(e) {
	var selfRef = this;
	this.startX = e.pageX;
	$(document).on('mouseup', function(e) {
		selfRef.endDrag(e)
	});
	$(document).on('mousemove', function(e) {
		selfRef.updateSwing(e, false)
	});
}

SwingControler.prototype.endDrag = function(e) {
	this.updateSwing(e, true);
	$(document).off();

}



SwingControler.prototype.updateSwingSwipe = function(startX, pageX) {
	var difference = startX - pageX;
	startX = pageX;
	difference = difference * -1;
	var percent = difference / (this.xRange / 100);
	this.setPercent(percent);
}

SwingControler.prototype.updateSwing = function(e, update) {
	var difference = this.startX - e.pageX;
	this.startX = e.pageX;
	difference = difference * -1;
	var percent = difference / (this.xRange / 100);
	this.setPercent(percent)
	
	if($.browser.msie) {
		if(update) {
			$(this).trigger('change', this.currentPercent)
		}

	} else {
		$(this).trigger('change', this.currentPercent)
	}
}

SwingControler.prototype.setPercent = function(percent) {
	this.currentPercent += percent;
	this.currentPercent = (this.currentPercent > this.percentMax) ? this.percentMax : this.currentPercent;
	this.currentPercent = (this.currentPercent < -this.percentMax) ? -this.percentMax : this.currentPercent;
	if(!this.basic) {
		var degrees = percent * (this.rotationRange / 100);
		this.rotation += degrees;
		this.rotation = (this.rotation > this.rotationRange) ? this.rotationRange : this.rotation;
		this.rotation = (this.rotation < -this.rotationRange) ? -this.rotationRange : this.rotation
		$(this.id + ' .swingControl span').css('-webkit-transform', 'rotate(' + this.rotation + 'deg)');
		$(this.id + ' .swingControl span').css('-moz-transform', 'rotate(' + this.rotation + 'deg)');
		$(this.id + ' .swingControl span').css('-o-transform', 'rotate(' + this.rotation + 'deg)');
		$(this.id + ' .swingControl span').css('-ms-transform', 'rotate(' + this.rotation + 'deg)');
		$(this.id + ' .swingControl span').css('-ms-transform', 'rotate(' + this.rotation + 'deg)');
		//currentPercent = this.rotation / (this.rotationRange / 100);
	} else {

		var offset = this.currentPercent * ((this.widthRange / 4) / 100);

		var margin = this.rangeCenter + offset;
		$(this.id + ' .swingControl span').css('margin-left', (margin) + 'px');
	}
	
};
*/

