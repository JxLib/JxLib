/*
---

name: Jx.ButtonSet

description: A ButtonSet manages a set of Jx.Button instances by ensuring that only one of the buttons is active.

license: MIT-style license.

requires:
 - Jx.Object

provides: [Jx.ButtonSet]


...
 */
// $Id$
/**
 * Class: Jx.ButtonSet
 *
 * Extends: <Jx.Object>
 *
 * A ButtonSet manages a set of <Jx.Button> instances by ensuring that only
 * one of the buttons is active.  All the buttons need to have been created
 * with the toggle option set to true for this to work.
 *
 * Example:
 * (code)
 * var toolbar = new Jx.Toolbar('bar');
 * var buttonSet = new Jx.ButtonSet();
 *
 * var b1 = new Jx.Button({label: 'b1', toggle:true, contentID: 'content1'});
 * var b2 = new Jx.Button({label: 'b2', toggle:true, contentID: 'content2'});
 * var b3 = new Jx.Button({label: 'b3', toggle:true, contentID: 'content3'});
 * var b4 = new Jx.Button({label: 'b4', toggle:true, contentID: 'content4'});
 *
 * buttonSet.add(b1,b2,b3,b4);
 * (end)
 *
 * Events:
 * change - the current button has changed
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.ButtonSet = new Class({
    Family: 'Jx.ButtonSet',
    Extends: Jx.Object,
    Binds: ['buttonChanged'],
    /**
     * Property: buttons
     * {Array} array of buttons that are managed by this button set
     */
    buttons: [],
    
    cleanup: function() {
      this.buttons.each(function(b){
        b.removeEvent('down', this.buttonChanged);
        b.setActive = null;
      },this);
      this.activeButton = null;
      this.buttons = null;
      this.parent();
    },

    /**
     * APIMethod: add
     * Add one or more <Jx.Button>s to the ButtonSet.
     *
     * Parameters:
     * button - {<Jx.Button>} an instance of <Jx.Button> to add to the button
     * set.  More than one button can be added by passing extra parameters to
     * this method.
     */
    add : function() {
        $A(arguments).each(function(button) {
            if (button.domObj.hasClass(button.options.toggleClass)) {
                button.domObj.removeClass(button.options.toggleClass);
                button.domObj.addClass(button.options.toggleClass+'Set');
            }
            button.addEvent('down',this.buttonChanged);
            button.setActive = function(active) {
                if (button.options.active && this.activeButton == button) {
                    return;
                } else {
                    Jx.Button.prototype.setActive.apply(button, [active]);
                }
            }.bind(this);
            if (!this.activeButton || button.options.active) {
                button.options.active = false;
                button.setActive(true);
            }
            this.buttons.push(button);
        }, this);
        return this;
    },
    /**
     * APIMethod: remove
     * Remove a button from this Button.
     *
     * Parameters:
     * button - {<Jx.Button>} the button to remove.
     */
    remove : function(button) {
        this.buttons.erase(button);
        if (this.activeButton == button) {
            if (this.buttons.length) {
                this.buttons[0].setActive(true);
            }
            button.removeEvent('down',this.buttonChanged);
            button.setActive = Jx.Button.prototype.setActive;
        }
    },
    /**
     * APIMethod: empty
     * empty the button set and clear the active button
     */
    empty: function() {
      this.buttons = [];
      this.activeButton = null;
    },
    /**
     * APIMethod: setActiveButton
     * Set the active button to the one passed to this method
     *
     * Parameters:
     * button - {<Jx.Button>} the button to make active.
     */
    setActiveButton: function(button) {
        var b = this.activeButton;
        this.activeButton = button;
        if (b && b != button) {
            b.setActive(false);
        }
    },
    /**
     * Method: buttonChanged
     * Handle selection changing on the buttons themselves and activate the
     * appropriate button in response.
     *
     * Parameters:
     * button - {<Jx.Button>} the button to make active.
     */
    buttonChanged: function(button) {
        this.setActiveButton(button);
        this.fireEvent('change', this);
    }
});