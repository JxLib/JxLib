/*
---

name: Jx.Button.Color

description: A button that allows the user to select a color.

license: MIT-style license.

requires:
 - Jx.Button.Flyout
 - Jx.ColorPalette

provides: [Jx.Button.Color]

...
 */
// $Id$
/**
 * Class: Jx.Button.Color
 *
 * Extends: <Jx.Button.Flyout>
 *
 * A <Jx.ColorPalette> wrapped up in a Jx.Button.  The button includes a
 * preview of the currently selected color.  Clicking the button opens
 * the color panel.
 *
 * A color button is essentially a <Jx.Button.Flyout> where the content
 * of the flyout is a <Jx.ColorPalette>.  For performance, all color buttons
 * share an instance of <Jx.ColorPalette> which means only one button can be
 * open at a time.  This isn't a huge restriction as flyouts already close
 * each other when opened.
 *
 * Example:
 * (code)
 * var colorButton = new Jx.Button.Color({
 *     onChange: function(button) {
 *         console.log('color:' + button.options.color + ' alpha: ' +
 *                     button.options.alpha);
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
    Extends: Jx.Button.Flyout,
    Family: 'Jx.Button.Color',

    /**
     * Property: swatch
     * the color swatch element used to portray the currently selected
     * color
     */
    swatch: null,

    options: {
        /**
         * Option: color
         * a color to initialize the panel with, defaults to #000000
         * (black) if not specified.
         */
        color: '#000000',
        /**
         * Option: alpha
         * an alpha value to initialize the panel with, defaults to 1
         *  (opaque) if not specified.
         *
         */
        alpha: 100,
        /*
         * Option: template
         * the HTML template for the color button
         */
        template: '<span class="jxButtonContainer"><a class="jxButton jxButtonFlyout jxDiscloser"><span class="jxButtonContent"><span class="jxButtonSwatch"><span class="jxButtonSwatchColor"></span></span><span class="jxButtonLabel"></span></span></a></span>'
    },

    /**
     * Property: classes
     * {<Hash>} a hash of object properties to CSS class names used to
     * automatically extract references to important DOM elements when
     * processing a widget template.  This allows developers to provide custom
     * HTML structures without affecting the functionality of widgets.
     */
    classes: {
        domObj: 'jxButtonContainer',
        domA: 'jxButton',
        swatch: 'jxButtonSwatchColor',
        domLabel: 'jxButtonLabel'
    },

    /**
     * Method: render
     * creates a new color button.
     */
    render: function() {
        if (!Jx.Button.Color.ColorPalette) {
            Jx.Button.Color.ColorPalette = new Jx.ColorPalette(this.options);
        }

        /* we need to have an image to replace, but if a label is
           requested, there wouldn't normally be an image. */
        this.options.image = Jx.aPixel.src;

        /* now we can safely initialize */
        this.parent();
        this.updateSwatch();

        this.bound.changed = this.changed.bind(this);
        this.bound.hide = this.hide.bind(this);
    },
    cleanup: function() {
      this.bound.changed = false;
      this.bound.hide = false;
      this.parent();
    },
    /**
     * APIMethod: clicked
     * override <Jx.Button.Flyout> to use a singleton color palette.
     */
    clicked: function() {
        var cp = Jx.Button.Color.ColorPalette;
        if (cp.currentButton) {
            cp.currentButton.hide();
        }
        cp.currentButton = this;
        cp.addEvent('change', this.bound.changed);
        cp.addEvent('click', this.bound.hide);
        this.content.appendChild(cp.domObj);
        cp.domObj.setStyle('display', 'block');
        Jx.Button.Flyout.prototype.clicked.apply(this, arguments);
        /* setting these before causes an update problem when clicking on
         * a second color button when another one is open - the color
         * wasn't updating properly
         */

        cp.options.color = this.options.color;
        cp.options.alpha = this.options.alpha/100;
        cp.updateSelected();
    },

    /**
     * APIMethod: hide
     * hide the color panel
     */
    hide: function() {
        var cp = Jx.Button.Color.ColorPalette;
        this.setActive(false);
        cp.removeEvent('change', this.bound.changed);
        cp.removeEvent('click', this.bound.hide);
        Jx.Button.Flyout.prototype.hide.apply(this, arguments);
        cp.currentButton = null;
    },

    /**
     * APIMethod: setColor
     * set the color represented by this color panel
     *
     * Parameters:
     * color - {String} the new hex color value
     */
    setColor: function(color) {
        this.options.color = color;
        this.updateSwatch();
    },

    /**
     * APIMethod: setAlpha
     * set the alpha represented by this color panel
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
     * handle the color changing in the palette by updating the preview swatch
     * in the button and firing the change event.
     *
     * Parameters:
     * panel - <Jx.ColorPalette> the palette that changed.
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
            styles.opacity = 1;
            styles.filter = '';
        }
        this.swatch.setStyles(styles);
    }
});
