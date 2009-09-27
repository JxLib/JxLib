
/**
 * Class: Jx.Slider
 */
Jx.Slider = new Class({
    
    Extends: Jx.Widget,
    
    options: {
        template: '<div class="jxSliderContainer"><div class="jxSliderKnob"></div></div>',
        max: 100,
        min: 0,
        step: 1,
        mode: 'horizontal',
        wheel: true,
        snap: true,
        startAt: 0,
        offset: 0,
        onChange: $empty,
        onComplete: $empty
    },
    
    slider: null,
    knob: null,
    sliderOpts: null,
    
    render: function () {
        this.parent();
        
        var els = this.processTemplate(this.options.template, ['jxSliderContainer', 'jxSliderKnob']);
        
        if (!els.has('jxSliderContainer')) {
            return;
        }
        
        this.domObj = els.get('jxSliderContainer');
        this.knob = els.get('jxSliderKnob');
        
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
    
    change: function (step) {
        this.fireEvent('change', [step, this]);
    },
    
    complete: function (step) {
        this.fireEvent('complete', [step, this]);
    },
    
    start: function () {
        if (!$defined(this.slider)) {
            this.slider = new Slider(this.domObj, this.knob, this.sliderOpts);
        }
        this.slider.set(this.options.startAt);
    }
});