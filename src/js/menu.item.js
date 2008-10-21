// $Id: menu.item.js 999 2008-09-19 17:31:11Z pspencer $
/**
 * Class: Jx.Menu.Item
 * A menu item is a single entry in a menu.  It is typically composed of
 * a label and an optional icon.  Selecting the menu item emits an event.
 *
 * Jx.Menu.Item is represented by a <Jx.Button> with type MenuItem and the
 * associated CSS changes noted in <Jx.Button>.  The container of a MenuItem
 * is an 'li' element.
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * click - fired when the menu item is clicked.
 *
 * Implements:
 * Options - MooTools Class.Extras
 * Events - MooTools Class.Extras
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Menu.Item = new Class({
    Implements: [Options, Events],
    Extends: Jx.Button,
    /**
     * Property: owner
     * {<Jx.SubMenu> or <Jx.Menu>} the menu that contains the menu item.
     */
    owner: null,
    options: {
        enabled: true,
        image: null,
        label: '&nbsp;',
        toggleClass: 'Toggle'
    },
    /**
     * Constructor: Jx.Menu.Item
     * Create a new instance of Jx.Menu.Item
     *
     * Parameters:
     * options - {Object} an object containing options as below.
     * 
     * Options:
     * enabled - {Boolean} whether the menu item starts enabled or not (default true)
     *
     * See <Jx.Button> for other options
     */
    initialize: function(options) {
        this.parent($merge(
            {
                image: Jx.aPixel.src
            },
            options, 
            {
                container:'li',
                type:'MenuItem',
                toggleClass: (options.image ? null : this.options.toggleClass)
            }
        ));
        this.domObj.addEvent('mouseover', this.onMouseOver.bindWithEvent(this));
    },
    /**
     * Method: setOwner
     * Set the owner of this menu item
     *
     * Parameters:
     * obj - {Object} the new owner
     */
    setOwner: function(obj) {
        this.owner = obj;
    },
    /**
     * Method: hide
     * Hide the menu item.
     */
    hide: $empty,
    /**
     * Method: show
     * Show the menu item
     */
    show: $empty,
    clicked: function(o) {
        if (this.options.enabled) {
            if (this.options.toggle) {
                this.setActive(!this.options.isActive);
            }
            this.fireEvent('click', this);
            if (this.owner && this.owner.deactivate) {
                this.owner.deactivate(o.event);
            }
        }
    },
    /**
     * Method: onmouseover
     * handle the mouse moving over the menu item
     *
     * Parameters:
     * e - {Event} the mousemove event
     */
    onMouseOver: function(e) {
        if (this.owner && this.owner.setVisibleItem) {
            this.owner.setVisibleItem(this);
        }
        this.show(e);
    }
});

