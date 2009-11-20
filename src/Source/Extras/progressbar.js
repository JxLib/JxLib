
/**
 * Class: Jx.Progressbar
 *
 * 
 * Example:
 * The following just uses the defaults.
 * (code)
 * var progressBar = new Jx.Progressbar();
 * progressBar.addEvent('update',function(){alert('updated!');});
 * progressBar.addEvent('complete',function(){
 *      alert('completed!');
 *      this.destroy();
 * });
 * 
 * progressbar.addTo('container');
 * 
 * var total = 90;
 * for (i=0; i < total; i++) {
 *      progressbar.update(total, i);
 * }
 * (end)
 * 
 * Events:
 * onUpdate - Fired when the bar is updated
 * onComplete - fires when the progress bar completes it's fill
 * 
 */
Jx.Progressbar = new Class({
    Family: 'Jx.Progressbar',
    Extends: Jx.Widget,
    
    options: {
        onUpdate: $empty,
        onComplete: $empty,
        /**
         * Option: messageText
         * The text of a message displayed above the bar. Set to NULL to prevent any text from appearing
         */
        messageText: 'Loading...',
        /**
         * Option: progressText
         * The text displayed inside the bar. This defaults to "{progress} of {total}" 
         * where {progress} and {total} are substituted for passed in values.
         */
        progressText: '{progress} of {total}',
        /**
         * Option: bar
         * an object that gives options for the bar itself. Specifically, 
         * the width and height of the bar. You can set either to 'auto' to
         * have the bar calculate its own width.
         */
        bar: {
            width: 'auto',
            height: 20
        },
        /**
         * Option: parent
         * The element to put this progressbar into
         */
        parent: null,
        /**
         * Option: template
         * The template used to create the progressbar
         */
        template: '<div class="jxProgressBar-container"><div class="jxProgressBar-message"></div><div class="jxProgressBar"><div class="jxProgressBar-outline"></div><div class="jxProgressBar-fill"></div><div class="jxProgressBar-text"></div></div></div>'
    },
    /**
     * Property: classes
     * The classes used in the template
     */
    classes: new Hash({
        domObj: 'jxProgressBar-container',
        message: 'jxProgressBar-message', 
        container: 'jxProgressBar',
        outline: 'jxProgressBar-outline',
        fill: 'jxProgressBar-fill',
        text: 'jxProgressBar-text'
    }),
    /**
     * Property: bar
     * the bar that is filled
     */
    bar: null,
    /**
     * Property: text
     * the element that contains the text that's shown on the bar (if any).
     */
    text: null,
    
    /**
     * APIMethod: render
     * Creates a new progressbar.
     */
    render: function () {
        this.parent();
        
        if ($defined(this.options.parent)) {
            this.domObj.inject($(this.options.parent));
        }
        
        //determine width of progressbar
        if (this.options.bar.width === 'auto') {
            //get width of container
            this.options.bar.width = this.domObj.getStyle('width').toInt();
        }
        
        //determine height
        if (this.options.bar.height === 'auto') {
            this.options.bar.height = this.domObj.getStyle('height').toInt() - 4;
        }
        
        //Message
        if (this.message) {
            if ($defined(this.options.messageText)) {
                this.message.set('html', this.options.messsageText);
            } else {
                this.message.destroy();
            }
        }
        
        //bar container itself
        if (this.container) {
            this.container.setStyles({
                'position': 'relative',
                'width': this.options.bar.width,
                'height' : this.options.bar.height + 4
            });
        }
        
        //Outline
        if (this.outline) {
            this.outline.setStyles({
                'width': this.options.bar.width,
                'height' : this.options.bar.height
            });
        }
        
        //Fill
        if (this.fill) {
            this.fill.setStyles({
                'width': 0,
                'height' : this.options.bar.height
            });
        }
        
        //TODO: check for {progress} and {total} in progressText
        var obj = {};
        if (this.options.progressText.contains('{progress}')) {
            obj.progress = 0;
        }
        if (this.options.progressText.contains('{total}')) {
            obj.total = 0;
        }
        
        //Progress text
        if (this.text) {
            this.text.set('html', this.options.progressText.substitute(obj));
        }
        
    },
    /**
     * APIMethod: update
     * called to update the progress bar with new percentage.
     * 
     * Parameters: 
     * total - the total # to progress up to
     * progress - the current position in the progress (must be less than or
     *              equal to the total)
     */
    update: function (total, progress) {
        var newWidth = (progress * this.options.bar.width) / total;
        
        //update bar width
        //TODO: animate this
        this.text.get('tween', {property:'width', onComplete: function() {
            var obj = {};
            if (this.options.progressText.contains('{progress}')) {
                obj.progress = progress;
            }
            if (this.options.progressText.contains('{total}')) {
                obj.total = total;
            }
            var t = this.options.progressText.substitute(obj);
            this.text.set('text', t);
        }.bind(this)}).start(newWidth);
        
        this.fill.get('tween', {property: 'width', onComplete: (function () {
            
            if (total === progress) {
                this.complete = true;
                this.fireEvent('complete');
            } else {
                this.fireEvent('update');
            }
        }).bind(this)}).start(newWidth);
        
    }
    
});