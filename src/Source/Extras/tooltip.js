/*
---

name: Jx.Tooltip

description: These are very simple tooltips that are designed to be instantiated in javascript and directly attached to the object that they are the tip for.

license: MIT-style license.

requires:
 - Jx.Widget

provides: [Jx.Tooltip]

css:
 - tooltip

...
 */
// $Id$
/**
 * Class: Jx.Tooltip
 *
 * Extends: <Jx.Widget>
 *
 * An implementation of tooltips. These are very simple tooltips that are
 * designed to be instantiated in javascript and directly attached to the
 * object that they are the tip for. We can only have one Tip per element so
 * we use element storage to store the tip object and check for it's presence
 * before creating a new tip. If one is there we remove it and create this new
 * one.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Tooltip = new Class({
    Family: 'Jx.Widget',
    Extends : Jx.Widget,
    Binds: ['enter', 'leave', 'move'],
    options : {
        /**
         * Option: offsets
         * An object with x and y components for where to put the tip related
         * to the mouse cursor.
         */
        offsets : {
            x : 15,
            y : 15
        },
        /**
         * Option: showDelay
         * The amount of time to delay before showing the tip. This ensures we
         * don't show a tip if we're just passing over an element quickly.
         */
        showDelay : 100,
        /**
         * Option: cssClass
         * a class to be added to the tip's container. This can be used to
         * style the tip.
         */
        cssClass : null
    },

    /**
     * Parameters:
     * target - The DOM element that triggers the toltip when moused over.
     * tip - The contents of the tip itself. This can be either a string or
     *       an Element.
     * options - <Jx.Tooltip.Options> and <Jx.Widget.Options>
     */
    parameters: ['target','tip','options'],

    /**
     * Method: render
     * Creates the tooltip
     *
     */
    render : function () {
        this.parent();
        this.target = document.id(this.options.target);

        var t = this.target.retrieve('Tip');
        if (t) {
            this.target.eliminate('Tip');
        }

        //set up the tip options
        this.domObj = new Element('div', {
            styles : {
                'position' : 'absolute',
                'top' : 0,
                'left' : 0,
                'visibility' : 'hidden'
            }
        }).inject(document.body);

        if (Jx.type(this.options.tip) === 'string' || Jx.type(this.options.tip) == 'object') {
            this.domObj.set('html', this.getText(this.options.tip));
        } else {
            this.domObj.grab(this.options.tip);
        }

        this.domObj.addClass('jxTooltip');
        if ($defined(this.options.cssClass)) {
            this.domObj.addClass(this.options.cssClass);
        }

        this.options.target.store('Tip', this);

        //add events
        this.options.target.addEvent('mouseenter', this.enter);
        this.options.target.addEvent('mouseleave', this.leave);
        this.options.target.addEvent('mousemove', this.move);
    },

    /**
     * Method: enter
     * Method run when the cursor passes over an element with a tip
     *
     * Parameters:
     * event - the event object
     */
    enter : function (event) {
        this.timer = $clear(this.timer);
        this.timer = (function () {
            this.domObj.setStyle('visibility', 'visible');
            this.position(event);
        }).delay(this.options.delay, this);
    },
    /**
     * Method: leave
     * Executed when the mouse moves out of an element with a tip
     *
     * Parameters:
     * event - the event object
     */
    leave : function (event) {
        this.timer = $clear(this.timer);
        this.timer = (function () {
            this.domObj.setStyle('visibility', 'hidden');
        }).delay(this.options.delay, this);
    },
    /**
     * Method: move
     * Called when the mouse moves over an element with a tip.
     *
     * Parameters:
     * event - the event object
     */
    move : function (event) {
        this.position(event);
    },
    /**
     * Method: position
     * Called to position the tooltip.
     *
     * Parameters:
     * event - the event object
     */
    position : function (event) {
        var size = window.getSize(), scroll = window.getScroll();
        var tipSize = this.domObj.getMarginBoxSize();
        var tip = {
            x : this.domObj.offsetWidth,
            y : this.domObj.offsetHeight
        };
        var tipPlacement = {
            x: event.page.x + this.options.offsets.x,
            y: event.page.y + this.options.offsets.y
        };

        if (event.page.y + this.options.offsets.y + tip.y + tipSize.height - scroll.y > size.y) {
            tipPlacement.y = event.page.y - this.options.offsets.y - tipSize.height - scroll.y;
        }

        if (event.page.x + this.options.offsets.x + tip.x + tipSize.width - scroll.x > size.x) {
            tipPlacement.x = event.page.x - this.options.offsets.x - tipSize.width - scroll.x;
        }

        this.domObj.setStyle('top', tipPlacement.y);
        this.domObj.setStyle('left', tipPlacement.x);
    },
    /**
     * APIMethod: detach
     * Called to manually remove a tooltip.
     */
    detach : function () {
        this.target.eliminate('Tip');
        this.destroy();
    }
});
