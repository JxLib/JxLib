/*
---

name: Jx.Slider

description: A wrapper for mootools' slider class to make it more Jx Friendly.

license: MIT-style license.

requires:
 - Jx.Widget
 - More/Slider

provides: [Jx.Slider]

css:
 - slider

...
 */
// $Id$
/**
 * Class: Jx.Slider
 * This class wraps the mootools-more slider class to make it more Jx friendly
 *
 * Copyright 2009 by Jonathan Bomgardner
 * License: MIT-style
 */
Jx.Slider = new Class({
    Extends: Jx.Widget,
    Family: 'Jx.Slider',

    options: {
        /**
         * Option: template
         * The template used to render the slider
         */
        template: '<div class="jxSliderContainer"><div class="jxSliderKnob"></div></div>',
        /**
         * Option: max
         * The maximum value the slider should have
         */
        max: 100,
        /**
         * Option: min
         * The minimum value the slider should ever have
         */
        min: 0,
        /**
         * Option: step
         * The distance between adjacent steps. For example, the default (1)
         * with min of 0 and max of 100, provides 100 steps between the min
         * and max values
         */
        step: 1,
        /**
         * Option: mode
         * Whether this is a vertical or horizontal slider
         */
        mode: 'horizontal',
        /**
         * Option: wheel
         * Whether the slider reacts to the scroll wheel.
         */
        wheel: true,
        /**
         * Option: snap
         * whether to snap to each step
         */
        snap: true,
        /**
         * Option: startAt
         * The value, or step, to put the slider at initially
         */
        startAt: 0,
        /**
         * Option: offset
         *
         */
        offset: 0,
        onChange: function(){},
        onComplete: function(){}
    },
    classes: {
        domObj: 'jxSliderContainer',
        knob: 'jxSliderKnob'
    },
    slider: null,
    knob: null,
    sliderOpts: null,
    disabled: false,
    /**
     * APIMethod: render
     * Create the slider but does not start it up due to issues with it
     * having to be visible before it will work properly.
     */
    render: function () {
        this.parent();

        this.sliderOpts = {
            range: [this.options.min, this.options.max],
            snap: this.options.snap,
            mode: this.options.mode,
            wheel: this.options.wheel,
            steps: (this.options.max - this.options.min) / this.options.step,
            offset: this.options.offset,
            onChange: this.change.bind(this),
            onComplete: this.complete.bind(this)
        };

    },
    /**
     * Method: change
     * Called when the slider moves
     */
    change: function (step) {
        this.fireEvent('change', [step, this]);
    },
    /**
     * Method: complete
     * Called when the slider stops moving and the mouse button is released.
     */
    complete: function (step) {
        this.fireEvent('complete', [step, this]);
    },
    /**
     * APIMethod: start
     * Call this method after the slider has been rendered in the DOM to start
     * it up and position the slider at the startAt poisition.
     */
    start: function () {
        if (this.slider === undefined || this.slider === null) {
            this.slider = new Slider(this.domObj, this.knob, this.sliderOpts);
        }
        this.slider.set(this.options.startAt);
    },
    /**
     * APIMethod: set
     * set the value of the slider
     */
    set: function(value) {
      this.slider.set(value);
    },
    
    /**
     * APIMethod: enable
     * Use this to enable the slider if disabled.
     */
    enable: function(){
        if (this.disabled) {
            this.slider.attach();
            this.domObj.removeClass('jxSliderDisabled');
            this.disabled = false;
        }
    },
    
    /** 
     * APIMethod: disable
     * Use this to disable the slider.
     */
    disable: function() {
        if (!this.disabled){
            this.slider.detach();
            this.domObj.addClass('jxSliderDisabled');
            this.disabled = true;
        }
    }
});