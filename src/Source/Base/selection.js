/*
---

name: Jx.Selection

description: A class to manage selection across multiple list objects

license: MIT-style license.

requires:
 - Jx.Object

provides: [Jx.Selection]

...
 */
// $Id$
/**
 * Class: Jx.Selection
 *
 * Manage selection of objects.
 *
 * Example:
 * (code)
 * var selection = new Jx.Selection();
 * (end)
 *
 * Events:
 * select - fired when an item is added to the selection.  This event may be
 *    changed by passing the eventToFire option when creating the selection
 *    object.
 * unselect - fired when an item is removed from the selection.  This event
 *    may be changed by passing the eventToFire option when creating the
 *    selection object.
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */


Jx.Selection = new Class({
    Family: 'Jx.Selection',
    Extends: Jx.Object,
    options: {
        /**
         * Option: eventToFire
         * Allows the developer to change the event that is fired in case one
         * object is using multiple selectionManager instances.  The default
         * is to use 'select' and 'unselect'.  To modify the event names,
         * pass different values:
         * (code)
         * new Jx.Selection({
         *   eventToFire: {
         *     select: 'newSelect',
         *     unselect: 'newUnselect'
         *   }
         * });
         * (end)
         */
        eventToFire: {
            select: 'select',
            unselect: 'unselect'
        },
        /**
         * APIProperty: selectClass
         * the CSS class name to add to the wrapper element when it is
         * selected
         */
        selectClass: 'jxSelected',
        /**
         * Option: selectMode
         * {string} default single.  May be single or multiple.  In single
         * mode only one item may be selected.  Selecting a new item will
         * implicitly unselect the currently selected item.
         */
        selectMode: 'single',
        /**
         * Option: selectToggle
         * {Boolean} Default true.  Selection of a selected item will unselect
         * it.
         */
        selectToggle: true,
        /**
         * Option: minimumSelection
         * {Integer} Default 0.  The minimum number of items that must be
         * selected.  If set to a number higher than 0, items added to a list
         * are automatically selected until this minimum is met.  The user may
         * not unselect items if unselecting them will drop the total number
         * of items selected below the minimum.
         */
        minimumSelection: 0
    },

    /**
     * Property: selection
     * {Array} an array holding the current selection
     */
    selection: null,

    /**
     * Constructor: Jx.Selection
     * create a new instance of Jx.Selection
     *
     * Parameters:
     * options - {Object} options for the new instance
     */
    init: function () {
        this.selection = [];
        this.parent();
    },

    cleanup: function() {
      this.selection = null;
      this.parent();
    },

    /**
     * APIMethod: defaultSelect
     * select an item if the selection does not yet contain the minimum
     * number of selected items.  Uses <Jx.Selection::select> to select
     * the item, so the same criteria is applied to the item if it is
     * to be selected.
     */
    defaultSelect: function(item) {
        if (this.selection.length < this.options.minimumSelection) {
            this.select(item);
        }
    },

    /**
     * APIMethod: select
     * select an item.
     *
     * Parameters:
     * item - {DOMElement} a DOM element or an element ID.
     */
    select: function (item) {
        var options = this.options,
            selection = this.selection;
        item = document.id(item);
        if (options.selectMode === 'multiple') {
            if (selection.contains(item)) {
                this.unselect(item);
            } else {
                document.id(item).addClass(options.selectClass);
                selection.push(item);
                this.fireEvent(options.eventToFire.select, item);
            }
        } else if (options.selectMode == 'single') {
            if (!this.selection.contains(item)) {
                document.id(item).addClass(options.selectClass);
                selection.push(item);
                if (selection.length > 1) {
                    this.unselect(selection[0]);
                }
                this.fireEvent(options.eventToFire.select, item);
            } else {
                if (options.selectToggle) {
                  this.unselect(item);
                }
            }
        }
    },

    /**
     * APIMethod: unselect
     * remove an item from the selection.  The item must already be in the
     * selection.
     *
     * Parameters:
     * item - {DOMElement} a DOM element or an element ID.
     */
    unselect: function (item) {
        var selection = this.selection,
            options = this.options;
        if (selection.contains(item) &&
            selection.length > options.minimumSelection) {
            document.id(item).removeClass(options.selectClass);
            selection.erase(item);
            this.fireEvent(options.eventToFire.unselect, [item, this]);
        }
    },

    /**
     * APIMethod: selected
     * returns the items in the current selection.
     *
     * Returns:
     * {Array} an array of DOM elements in the current selection
     */
    selected: function () {
        return this.selection;
    },

    /**
     * APIMethod: isSelected
     * test if an item is in the current selection.
     *
     * Parameters:
     * item - {DOMElement} a DOM element or an element ID.
     *
     * Returns:
     * {Boolean} true if the current selection contains the item, false
     * otherwise
     */
    isSelected: function(item) {
        return this.selection.contains(item);
    }
});