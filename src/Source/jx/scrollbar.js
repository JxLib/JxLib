/*
---

name: Jx.Scrollbar

description: An implementation of a custom CSS-styled scrollbar.

license: MIT-style license.

requires:
 - Jx.Slider

provides: [Jx.Scrollbar]

css:
 - scrollbar

...
 */
// $Id$
/**
 * Class: Jx.Scrollbar
 * Creates a custom scrollbar either vertically or horizontally (determined by
 * options). These scrollbars are designed to be styled entirely through CSS.
 * 
 * Copyright 2009 by Jonathan Bomgardner
 * License: MIT-style
 * 
 * Based in part on 'Mootools CSS Styled Scrollbar' on
 * http://solutoire.com/2008/03/10/mootools-css-styled-scrollbar/
 */
define("jx/scrollbar", ['../base','./widget','./slider'], function(base, Widget, Slider){
    
    var scrollbar = new Class({
    
        Extends: Widget,
        Family: 'Jx.Scrollbar',
        
        Binds: ['scrollIt'],
        
        options: {
            /**
             * Option: direction
             * Determines which bars are visible. Valid options are 'horizontal'
             * or 'vertical'
             */
            direction: 'vertical',
            /**
             * Option: useMouseWheel
             * Whether to allow the mouse wheel to move the content. Defaults 
             * to true.
             */
            useMouseWheel: true,
            /**
             * Option: useScrollers
             * Whether to show the scrollers. Defaults to true.
             */
            useScrollers: true,
            /**
             * Option: scrollerInterval
             * The amount to scroll the content when using the scrollers. 
             * useScrollers option must be true. Default is 50 (px).
             */
            scrollerInterval: 50,
            /**
             * Option: template
             * the HTML template for a scrollbar
             */
            template: '<div class="jxScrollbarContainer"><div class="jxScrollLeft"></div><div class="jxSlider"></div><div class="jxScrollRight"></div></div>'
        },
        
        classes: {
            domObj: 'jxScrollbarContainer',
            scrollLeft: 'jxScrollLeft',
            scrollRight: 'jxScrollRight',
            sliderHolder: 'jxSlider'
        },
        
        el: null,
        //element is the element we want to scroll. 
        parameters: ['element', 'options'],
        
        /**
         * Method: render
         * render the widget
         */
        render: function () {
            this.parent();
            this.el = document.id(this.options.element);
            if (this.el) {
                this.el.addClass('jxHas'+this.options.direction.capitalize()+'Scrollbar');
                
                //wrap content to make scroll work correctly
                var children = this.el.getChildren();
                this.wrapper = new Element('div',{
                    'class': 'jxScrollbarChildWrapper'
                });
                
                /**
                 * the wrapper needs the same settings as the original container
                 * specifically, the width and height
                 */ 
                this.wrapper.setStyles({
                    width: this.el.getStyle('width'),
                    height: this.el.getStyle('height')
                });
                
                children.inject(this.wrapper);
                this.wrapper.inject(this.el);
                
                this.domObj.inject(this.el);
                
                var scrollSize = this.wrapper.getScrollSize();
                var size = this.wrapper.getContentBoxSize();
                this.steps = this.options.direction==='horizontal'?scrollSize.x-size.width:scrollSize.y-size.height;
                this.slider = new Slider({
                    snap: false,
                    min: 0,
                    max: this.steps,
                    step: 1,
                    mode: this.options.direction,
                    onChange: this.scrollIt
                    
                });
                
                if (!this.options.useScrollers) {
                    this.scrollLeft.dispose();
                    this.scrollRight.dispose();
                    //set size of the sliderHolder
                    if (this.options.direction === 'horizontal') {
                        this.sliderHolder.setStyle('width','100%');
                    } else {
                        this.sliderHolder.setStyle('height', '100%');
                    }
                    
                } else {
                    this.scrollLeft.addEvents({
                        mousedown: function () {
                            this.slider.slider.set(this.slider.slider.step - this.options.scrollerInterval);
                            this.pid = function () {
                                this.slider.slider.set(this.slider.slider.step - this.options.scrollerInterval);
                            }.periodical(1000, this);
                        }.bind(this),
                        mouseup: function () {
                            window.clearInterval(this.pid);
                        }.bind(this)
                    });
                    this.scrollRight.addEvents({
                        mousedown: function () {
                            this.slider.slider.set(this.slider.slider.step + this.options.scrollerInterval);
                            this.pid = function () {
                                this.slider.slider.set(this.slider.slider.step + this.options.scrollerInterval);
                            }.periodical(1000, this);
                        }.bind(this),
                        mouseup: function () {
                            window.clearInterval(this.pid);
                        }.bind(this)
                    });
                    //set size of the sliderHolder
                    var holderSize, scrollerRightSize, scrollerLeftSize;
                    if (this.options.direction === 'horizontal') {
                        scrollerRightSize = this.scrollRight.getMarginBoxSize().width;
                        scrollerLeftSize = this.scrollLeft.getMarginBoxSize().width;
                        holderSize = size.width - scrollerRightSize - scrollerLeftSize;
                        this.sliderHolder.setStyle('width', holderSize + 'px');
                    } else {
                        scrollerRightSize = this.scrollRight.getMarginBoxSize().height;
                        scrollerLeftSize = this.scrollLeft.getMarginBoxSize().height;
                        holderSize = size.height - scrollerRightSize - scrollerLeftSize;
                        this.sliderHolder.setStyle('height', holderSize + 'px');
                    }
                }
                document.id(this.slider).inject(this.sliderHolder);
                
                //allows mouse wheel to function
                if (this.options.useMouseWheel) {
                    $$(this.el, this.domObj).addEvent('mousewheel', function(e){
                        e = new Event(e).stop();
                        var step = this.slider.slider.step - e.wheel * 30;
                        this.slider.slider.set(step);
                    }.bind(this));
                }
                
                //stop slider if we leave the window
                document.id(document.body).addEvent('mouseleave', function(){ 
                    this.slider.slider.drag.stop();
                }.bind(this));
    
                this.slider.start();
            }
        },
        
        /**
         * Method: scrollIt
         * scroll the content in response to the slider being moved.
         */
        scrollIt: function (step) {
            var x = this.options.direction==='horizontal'?step:0;
            var y = this.options.direction==='horizontal'?0:step;
            this.wrapper.scrollTo(x,y);
        }
    });
    
    if (base.global) {
        base.global.Scrollbar = scrollbar;
    }
    
    return scrollbar;
});