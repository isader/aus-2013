/*******************************************************************************************
 * SwingControler
 ******************************************************************************************/
/**
 * Init the SwingControler
 */
SwingControler = function(id) {
	var selfRef = this;
	this.rotation = 0;
	this.rotationRange = 90;
	this.percentMax = 100;
	this.widthRange = 600;
	this.xRange = 100;
	this.startX = 0;
	this.id = id;
	if($.browser.msie) {
		this.basic = true;
	} else {
		this.basic = false;
	}
	this.basicClass = '';
	this.currentPercent = 0;
	if(this.basic) {
		this.basicClass = 'basic';
	}
	$(this.id).append('<div class="swingLeft"></div><div class="swingRight"></div><div class="swingControl ' + this.basicClass + '"><span></span></div><div class="key ' + this.basicClass + '"><label class="value">0%</label><label class="reset">reset</label></div>')

	$(this.id).mousedown(function(e) {
		selfRef.startDrag(e);
	});
	var hammertime = Hammer(this.id).on("dragleft", function(e) {
		var startX = e.gesture.startEvent.touches[0].pageX,
			pageX = e.gesture.touches[0].pageX;

        selfRef.updateSwingSwipe(startX, pageX);
    });
    var hammertime = Hammer(this.id).on("dragright", function(e) {
        var startX = e.gesture.startEvent.touches[0].pageX,
			pageX = e.gesture.touches[0].pageX;

        selfRef.updateSwingSwipe(startX, pageX);
    });
	$(this.id + ' .reset').click(function() {
		selfRef.reset();
	});
	$(this.id + ' .swingLeft').click(function() {
		selfRef.setPercent(-1)
		$(selfRef).trigger('change', selfRef.currentPercent)
	});
	$(this.id + ' .swingRight').click(function() {
		selfRef.setPercent(1)
		$(selfRef).trigger('change', selfRef.currentPercent)
	});
	if(this.basic) {
		this.rangeCenter = -((this.widthRange) / 2 - $(this.id + ' .swingControl').width() / 2);
		$(this.id + ' .swingControl span').css('margin-left', this.rangeCenter + 'px');
	}

}

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

SwingControler.prototype.reset = function() {
	
	this.rotation = 0;
	this.currentPercent = 0;
	this.setPercent(0)
	$(this).trigger('change', this.currentPercent)
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