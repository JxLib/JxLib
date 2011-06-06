/**
 * Class: Jx.Slider
 * Hides and shows an element without depending on a fixed width or height
 * 
 * Copyright 2009 by Jonathan Bomgardner
 * License: MIT-style
 */
Jx.Slider = new Class({
	
	Implements: [Options,Events],
	
	options: {
		elem: null,		//the element that we'll be sliding
		trigger: null,
		onSlideOut: function(){},	//called when a panel slides out (shows)
		onSlideIn: function(){} //called when a panel slides in (hides)
	},
	
	initialize: function(options){
		
		this.setOptions(options);
		
		this.elem = $(this.options.elem);
		
		this.elem.set('tween',{onComplete:this.setDisplay.bind(this)});
		
		if (this.options.trigger != undefined){
			this.trigger = $(this.options.trigger);
			this.trigger.addEvent('click',this.handleClick.bind(this));
		}
		
		this.elem.store('slider',this);

	},
	
	handleClick: function(e){
		var h = this.elem.getStyle('height').toInt();
		if (h===0) {
			this.slide('in');
		} else {
			this.slide('out');
		}
	},
	
	setDisplay: function(){
		var h = this.elem.getStyle('height').toInt();
		if (h===0){
			this.elem.setStyle('display','none');
			this.fireEvent('slideIn', this.elem);
		} else {
			this.elem.setStyles({
				'overflow':'auto',
				'height':'auto'
			});
			this.fireEvent('slideOut', this.elem);
		}	
	},
	
	slide: function(dir){
		var h;
		if (dir === 'in') {
			h = this.elem.retrieve('height');
			this.elem.setStyles({
				'overflow':'hidden',
				'display':'block',
				'height':0
			});
			this.elem.tween('height',h);	
		} else {
			h = this.elem.getSize().y;
			this.elem.store('height',h);
			this.elem.setStyles({
				'overflow':'hidden',
				'height':h
			});
			this.elem.tween('height',0);
		}		
	}
});