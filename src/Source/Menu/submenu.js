/*
---

name: Jx.Menu.SubMenu

description: A sub menu contains menu items within a main menu or another sub menu.

license: MIT-style license.

requires:
 - Jx.Menu.Item
 - Jx.Menu

provides: [Jx.Menu.SubMenu]

...
 */
// $Id$
/**
 * Class: Jx.Menu.SubMenu
 *
 * Extends: <Jx.Menu.Item>
 *
 * Implements: <Jx.AutoPosition>, <Jx.Chrome>
 *
 * A sub menu contains menu items within a main menu or another
 * sub menu.
 *
 * The structure of a SubMenu is the same as a <Jx.Menu.Item> with
 * an additional unordered list element appended to the container.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Menu.SubMenu = new Class({
    Family: 'Jx.Menu.SubMenu',
    Extends: Jx.Menu.Item,
    /**
     * Property: subDomObj
     * {HTMLElement} the HTML container for the sub menu.
     */
    subDomObj: null,
    /**
     * Property: owner
     * {<Jx.Menu> or <Jx.SubMenu>} the menu or sub menu that this sub menu
     * belongs
     */
    owner: null,
    /**
     * Property: visibleItem
     * {<Jx.MenuItem>} the visible item within the menu
     */
    visibleItem: null,
    /**
     * Property: list
     * {<Jx.List>} a list to manage menu items
     */
    list: null,
    options: {
        template: '<li class="jxMenuItemContainer"><a class="jxMenuItem jxButtonSubMenu"><span class="jxMenuItemContent"><img class="jxMenuItemIcon" src="'+Jx.aPixel.src+'"><span class="jxMenuItemLabel"></span></span></a></li>',
        position: {
            horizontal: ['right left', 'left right'],
            vertical: ['top top']
        }
    },

    /**
     * APIMethod: render
     * Create a new instance of Jx.SubMenu
     */
    render: function() {
        this.parent();
        this.open = false;

        this.menu = new Jx.Menu(null, {
            position: this.options.position
        });
        this.menu.domObj = this.domObj;
    },
    cleanup: function() {
      this.menu.domObj = null;
      this.menu.destroy();
      this.menu = null;
      this.parent();
    },
    /**
     * Method: setOwner
     * Set the owner of this sub menu
     *
     * Parameters:
     * obj - {Object} the owner
     */
    setOwner: function(obj) {
        this.owner = obj;
        this.menu.owner = obj;
    },
    /**
     * Method: show
     * Show the sub menu
     */
    show: function() {
        if (this.open || this.menu.list.count() == 0) {
            return;
        }
        this.menu.show();
        this.open = true;
        // this.setActive(true);
    },

    eventInMenu: function(e) {
        if (this.visibleItem &&
            this.visibleItem.eventInMenu &&
            this.visibleItem.eventInMenu(e)) {
            return true;
        }
        return document.id(e.target).descendantOf(this.domObj) ||
               this.menu.eventInMenu(e);
    },

    /**
     * Method: hide
     * Hide the sub menu
     */
    hide: function() {
        if (!this.open) {
            return;
        }
        this.open = false;
        this.menu.hide();
        this.visibleItem = null;
    },
    /**
     * Method: add
     * Add menu items to the sub menu.
     *
     * Parameters:
     * item - {<Jx.MenuItem>} the menu item to add.  Multiple menu items
     * can be added by passing multiple arguments to this function.
     */
    add: function(item, position) {
        this.menu.add(item, position, this);
        return this;
    },
    /**
     * Method: remove
     * Remove a menu item from the menu
     *
     * Parameters:
     * item - {<Jx.MenuItem>} the menu item to remove
     */
    remove: function(item) {
        this.menu.remove(item);
        return this;
    },
    /**
     * Method: replace
     * Replace a menu item with another menu item
     *
     * Parameters:
     * what - {<Jx.MenuItem>} the menu item to replace
     * withWhat - {<Jx.MenuItem>} the menu item to replace it with
     */
    replace: function(item, withItem) {
        this.menu.replace(item, withItem);
        return this;
    },
    /**
     * APIMethod: empty
     * remove all items from the sub menu
     */
    empty: function() {
      this.menu.empty();
    },
    /**
     * Method: deactivate
     * Deactivate the sub menu
     *
     * Parameters:
     * e - {Event} the event that triggered the menu being
     * deactivated.
     */
    deactivate: function(e) {
        if (this.owner) {
            this.owner.deactivate(e);
        }
    },
    /**
     * Method: isActive
     * Indicate if this sub menu is active
     *
     * Returns:
     * {Boolean} true if the <Jx.Menu> that ultimately contains
     * this sub menu is active, false otherwise.
     */
    isActive: function() {
        if (this.owner) {
            return this.owner.isActive();
        } else {
            return false;
        }
    },
    /**
     * Method: setActive
     * Set the active state of the <Jx.Menu> that contains this sub menu
     *
     * Parameters:
     * isActive - {Boolean} the new active state
     */
    setActive: function(isActive) {
        if (this.owner && this.owner.setActive) {
            this.owner.setActive(isActive);
        }
    },
    /**
     * Method: setVisibleItem
     * Set a sub menu of this menu to be visible and hide the previously
     * visible one.
     *
     * Parameters:
     * obj - {<Jx.SubMenu>} the sub menu that should be visible
     */
    setVisibleItem: function(obj) {
        if (this.visibleItem != obj) {
            if (this.visibleItem && this.visibleItem.hide) {
                this.visibleItem.hide();
            }
            this.visibleItem = obj;
            this.visibleItem.show();
        }
    }
});