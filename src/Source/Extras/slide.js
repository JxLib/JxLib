
/**
 * Class: Jx.Slide
 * Hides and shows an element without depending on a fixed width or height
 * 
 * Copyright 2009 by Jonathan Bomgardner
 * License: MIT-style
 */
Jx.Slide = new Class({
    
    Implements: Jx.Object,
    
    options: {
        /**
         * Option: target
         * The element to slide
         */
        target: null,
        /**
         * Option: trigger
         * The element that will have a click event added to start the slide
         */
        trigger: null,
        /**
         * Option: type
         * The type of slide. Can be either "width" or "height". defaults to "height"
         */
        type: 'height',
        /**
         * Option: setOpenTo
         * Allows the caller to determine what the open target is set to. Defaults to 'auto'.
         */
        setOpenTo: 'auto',
        /**
         * Option: onSlideOut
         * function called when the target is revealed.
         */
        onSlideOut: $empty, 
        /**
         * Option: onSlideIn
         * function called when a panel is hidden.
         */
        onSlideIn: $empty
    },
    
    init: function () {
        
        this.target = $(this.options.target);
        
        this.target.set('tween', {onComplete: this.setDisplay.bind(this)});
        
        if ($defined(this.options.trigger)) {
            this.trigger = $(this.options.trigger);
            this.trigger.addEvent('click', this.handleClick.bindWithEvent(this));
        }
        
        this.target.store('slider', this);

    },
    
    handleClick: function (e) {
        var sizes = this.target.getMarginBoxSize();
        if (sizes.height === 0) {
            this.slide('in');
        } else {
            this.slide('out');
        }
    },
    
    setDisplay: function () {
        var h = this.target.getStyle(this.options.type).toInt();
        if (h === 0) {
            this.target.setStyle('display', 'none');
            this.fireEvent('slideOut', this.target);
        } else {
            //this.target.setStyle('overflow', 'auto');
            if (this.target.getStyle('position') !== 'absolute') {
                this.target.setStyle(this.options.type, this.opitons.setOpenTo);
            }
            this.fireEvent('slideIn', this.target);
        }   
    },
    
    slide: function (dir) {
        var h;
        if (dir === 'in') {
            h = this.target.retrieve(this.options.type);
            this.target.setStyles({
                'overflow': 'hidden',
                'display': 'block'
            });
            this.target.setStyle(this.options.type, 0);
            this.target.tween(this.options.type, h);    
        } else {
            if (this.options.type === 'height') {
                h = this.target.getMarginBoxSize().height;
            } else {
                h = this.target.getMarginBoxSize().width;
            }
            this.target.store(this.options.type, h);
            this.target.setStyle('overflow', 'hidden');
            this.target.setStyle(this.options.type, h);
            this.target.tween(this.options.type, 0);
        }       
    }
});