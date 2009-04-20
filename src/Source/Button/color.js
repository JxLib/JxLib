// $Id$ 
/**
 * Class: Jx.Button.Color
 * A <Jx.ColorPalette> wrapped up in a Jx.Button.  The button includes a
 * preview of the currently selected color.  Clicking the button opens
 * the color panel.
 *
 * A color button is essentially a <Jx.Button.Flyout> where the content
 * of the flyout is a <Jx.ColorPalette>.
 *
 * Example:
 * (code)
 * var colorButton = new Jx.Button.Color({
 *     onChange: function(button) {
 *         console.log('color:' + button.options.color + ' alpha: ' + button.options.alpha);     
 *     }
 * });
 * (end)
 *
 * Events:
 * change - fired when the color is changed.
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Button.Color = new Class({
    Family: 'Jx.Button.Color',
    /**
     * Extends:
     * <Jx.Button.Flyout>
     */
    Extends: Jx.Button.Flyout,
    swatch: null,
    options: {
        color: '#000000',
        alpha: 100
    },
    /**
     * Constructor: Jx.Button.Color
     * initialize a new colour button.
     *
     * Parameters:
     * options - {Object} an object containing a variable list of optional initialization
     * parameters.
     *
     * Options:
     * color - a colour to initialize the panel with, defaults to #000000
     *      (black) if not specified.
     * alpha - an alpha value to initialize the panel with, defaults to 1
     *      (opaque) if not specified.
     */

    initialize: function(options) {
        if (!Jx.Button.Color.ColorPalette) {
            Jx.Button.Color.ColorPalette = new Jx.ColorPalette(this.options);
        }
        var d = new Element('span', {'class':'jxButtonSwatch'});

        this.selectedSwatch = new Element('span');
        d.appendChild(this.selectedSwatch);

        this.colorChangeFn = this.changed.bind(this);
        this.hideFn = this.hide.bind(this);
        /* we need to have an image to replace, but if a label is 
           requested, there wouldn't normally be an image. */
        options.image = Jx.aPixel.src;

        /* now we can safely initialize */
        this.parent(options);
        
        // now replace the image with our swatch
        d.replaces(this.domImg);
        this.updateSwatch();
    },

    /**
     * Method: show
     * show the color panel when the user clicks the button
     */
    clicked: function() {
        if (Jx.Button.Color.ColorPalette.currentButton) {
            Jx.Button.Color.ColorPalette.currentButton.hide();
        }
        Jx.Button.Color.ColorPalette.currentButton = this;
        Jx.Button.Color.ColorPalette.addEvent('change', this.colorChangeFn);
        Jx.Button.Color.ColorPalette.addEvent('click', this.hideFn);
        this.content.appendChild(Jx.Button.Color.ColorPalette.domObj);
        Jx.Button.Color.ColorPalette.domObj.setStyle('display', 'block');
        Jx.Button.Flyout.prototype.clicked.apply(this, arguments);
        /* setting these before causes an update problem when clicking on
         * a second color button when another one is open - the color
         * wasn't updating properly
         */
         
        Jx.Button.Color.ColorPalette.options.color = this.options.color;
        Jx.Button.Color.ColorPalette.options.alpha = this.options.alpha/100;
        Jx.Button.Color.ColorPalette.updateSelected();
},

    /**
     * Method: hide
     * hide the colour panel
     */
    hide: function() {
        this.setActive(false);
        Jx.Button.Color.ColorPalette.removeEvent('change', this.colorChangeFn);
        Jx.Button.Color.ColorPalette.removeEvent('click', this.hideFn);
        Jx.Button.Flyout.prototype.hide.apply(this, arguments);
        Jx.Button.Color.ColorPalette.currentButton = null;
    },

    /**
     * Method: setColor
     * set the colour represented by this colour panel
     *
     * Parameters:
     * color - {String} the new hex color value
     */
    setColor: function(color) {
        this.options.color = color;
        this.updateSwatch();
    },

    /**
     * Method: setAlpha
     * set the alpha represented by this colour panel
     *
     * Parameters:
     * alpha - {Integer} the new alpha value (between 0 and 100)
     */
    setAlpha: function(alpha) {
        this.options.alpha = alpha;
        this.updateSwatch();
    },

    /**
     * Method: changed
     * colorChangeListener callback function when the user changes
     * the colour in the panel (just update the preview).
     */
    changed: function(panel) {
        var changed = false;
        if (this.options.color != panel.options.color) {
            this.options.color = panel.options.color;
            changed = true;
        }
        if (this.options.alpha != panel.options.alpha * 100) {
            this.options.alpha = panel.options.alpha * 100;
            changed = true;
        }
        if (changed) {
            this.updateSwatch();
            this.fireEvent('change',this);
        }
    },

    /**
     * Method: updateSwatch
     * Update the swatch color for the current color
     */
    updateSwatch: function() {
        var styles = {'backgroundColor':this.options.color};
        if (this.options.alpha < 100) {
            styles.filter = 'Alpha(opacity='+(this.options.alpha)+')';
            styles.opacity = this.options.alpha / 100;
            
        } else {
            styles.opacity = '';
            styles.filter = '';
        }
        this.selectedSwatch.setStyles(styles);
    }
});
