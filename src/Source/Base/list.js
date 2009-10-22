// $Id: $
/**
 * Class: Jx.List
 * 
 * Manage a list of DOM elements and provide an API and events for managing
 * those items within a container.
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * add - fired when an item is added
 * remove - fired when an item is removed
 * mouseenter - fired when the user mouses over an element
 * mouseleave - fired when the user mouses out of an element
 * select - fired when an item is selected
 * unselect - fired when an item is selected
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.List = new Class({
    Family: 'Jx.List',
    Extends: Jx.Object,
    parameters: ['container', 'options', 'manager'],
    /**
     * APIProperty: itemContainer
     * the element that will contain items as they are added
     */
    container: null,
    /**
     * APIProperty: selection
     * the current selection
     */
    selection: null,
    options: {
        /**
         * APIProperty: items
         * an array of items to add to the list right away
         */
        items: null,
        /**
         * APIProperty: hoverClass
         * the CSS class name to add to the wrapper element when the mouse is
         * over an item
         */
        hoverClass: 'jxHover',
        /**
         * APIProperty: selectClass
         * the CSS class name to add to the wrapper element when it is selected
         */
        selectClass: 'jxSelected',
        /**
         * Option: hover
         * {Boolean} default true.  If set to true, the wrapper element will
         * obtain the defined hoverClass if set and mouseenter/mouseleave
         * events will be emitted when the user hovers over and out of elements
         */
        hover: true,
        /**
         * Option: select
         * {Boolean} default true.  If set to true, the wrapper element will
         * obtain the defined selectClass if set and select/unselect events
         * will be emitted when items are selected and unselected.
         */
        select: true,
        /**
         * Option: selectMode
         * {string} default single.  May be single or multiple.  In single mode
         * only one item may be selected.  Selecting a new item will implicitly
         * unselect the currently selected item.
         */
        selectMode: 'single',
        /**
         * Option: selectEvents
         * {Array} Default ['click'].  An array of event names that will 
         * trigger selection.
         */
        selectEvents: ['click'],
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
         * not unselect items if unselecting them will drop the total number of
         * items selected below the minimum.
         */
        minimumSelection: 0
    },
    
    init: function() {
        this.container = document.id(this.options.container);
        this.container.store('jxList', this);
        this.selection = [];
        
        var target = this;
        this.bound = {
            mouseenter: function() {
                this.addClass(target.options.hoverClass);
                target.fireEvent('mouseenter', this, target);
            },
            mouseleave: function() {
                this.removeClass(target.options.hoverClass);
                target.fireEvent('mouseleave', this, target);
            }
        };
        if ($defined(this.options.manager)) {
            this.manager = this.options.manager;
            this.manager.add(target);
            this.bound.click = function () {
                target.manager.select(this, target);
            };
        } else {
            this.bound.click = function () {
                target.select(this);
            };
        };
        if ($defined(this.options.items)) {
            this.add(this.options.items);
        }
    },
    
    cleanup: function() {
        this.container.getChildren().each(function(item){
            this.remove(item);
        }, this);
        this.bound = null;
        if ($defined(this.manager)) {
            this.manager.remove(this);
            this.manager = null;
        }
        this.container.eliminate('jxList');
        
    },
    
    /**
     * APIMethod: add
     * add an item to the list of items at the specified position
     *
     * Parameters:
     * item - {mixed} the object to add, a DOM element or an
     * object that provides a getElement method.  An array of items may also
     * be provided.  All items are inserted sequentially at the indicated
     * position.
     * position - {mixed} optional, the position to add the element, either
     * an integer position in the list or another item to place this item after
     */
    add: function(item, position) {
        if ($type(item) == 'array') {
            item.each(function(what){ this.add(what, position); }.bind(this) );
            return;
        }
        /* the element being wrapped */
        var el = document.id(item);
        if (el) {
            if (this.options.hover && this.options.hoverClass) {
                el.addEvents({
                    mouseenter: this.bound.mouseenter,
                    mouseleave: this.bound.mouseleave
                });
            }
            if (this.options.select) {
                el.addEvents({
                    click: this.bound.click
                });
            }
            if ($defined(position)) {
                if ($type(position) == 'integer') {
                    if (position < this.container.childNodes.length) {
                        el.inject(this.container.childNodes[position],' before');
                    } else {
                        el.inject(this.container, 'bottom');
                    }
                    this.fireEvent('add', item, this);
                } else if (this.container.hasChild(position)) {
                    el.inject(position,'after');
                    this.fireEvent('add', item, this);
                }
            } else {
                el.inject(this.container, 'bottom');
            }
            if (this.selection.length < this.options.minimumSelection) {
                this.select(el);
            }
        }
    },
    /**
     * Method: remove
     * remove an item from the list of items
     *
     * Parameters:
     * item - {mixed} the item to remove or the index of the item to remove.  An
     * array of items may also be provided.
     *
     * Returns:
     * {mixed} the item that was removed or null if the item is not a member
     * of this list.
     */
    remove: function(item) {
        if (this.container.hasChild(item)) {
            this.unselect(item);
            document.id(item).dispose();
            document.id(item).removeEvents(this.bound);
            this.fireEvent('remove', item, this);
            return item;
        }
        return null;
    },
    /**
     * Method: replace
     * replace one item with another
     *
     * Parameters:
     * item - {mixed} the item to replace or the index of the item to replace
     * withItem - {mixed} the object, DOM element, Jx.Object or an object 
     * implementing getElement to add
     *
     * Returns:
     * {mixed} the item that was removed
     */
    replace: function(item, withItem) {
        if (this.container.hasChild(item)) {
            this.add(withItem, item);
            this.remove(item);
        }
    },
    /**
     * APIMethod: indexOf
     * find the index of an item in the list
     *
     * Parameters:
     * item - {mixed} the object, DOM element, Jx.Object or an object 
     * implementing getElement to find the index of
     * 
     * Returns:
     * {integer} the position of the item or -1 if not found
     */
    indexOf: function(item) {
        return $A(this.container.childNodes).indexOf(item);
    },
    /**
     * APIMethod: select
     * select an item
     *
     * Parameters:
     * item - {mixed} the object to select, a DOM element, a Jx.Object, or an
     * object that provides a getElement method.  An array of items may also be
     * provided.
     */
    select: function(item) {
        if (this.container.hasChild(item)) {
            if (this.options.selectMode == 'multiple') {
                if (this.selection.contains(item)) {
                    this.unselect(item);
                } else {
                    document.id(item).addClass(this.options.selectClass);
                    this.selection.push(item);
                    this.fireEvent('select', item, this);
                }
            } else if (this.options.selectMode == 'single') {
                if (!this.selection.contains(item)) {
                    document.id(item).addClass(this.options.selectClass);
                    this.selection.push(item);
                    if (this.selection.length > 1) {
                        this.unselect(this.selection[0]);
                    }
                } else {
                    this.unselect(item);
                }
                this.fireEvent('select', item, this);
            }
        }
    },
    /**
     * APIMethod: unselect
     * unselect an item or items
     *
     * Parameters:
     * item - {mixed} the object to select, a DOM element, a Jx.Object, or an
     * object that provides a getElement method.  An array of elements may also
     * be provided.
     */
    unselect: function(item) {
        if ($defined(this.manager)) {
            this.manager.unselect(item, this);
        } else {
            if (this.container.hasChild(item) && this.selection.contains(item)) {
                if (this.selection.length > this.options.minimumSelection) {
                    document.id(item).removeClass(this.options.selectClass);
                    this.selection.erase(item);
                    this.fireEvent('unselect', item, this);
                }
            }
        }
    },
    /**
     * APIMethod: selected
     * returns the selected item or items
     *
     * Returns:
     * {mixed} the selected item or an array of selected items
     */
    selected: function() {
        return this.selection;
    },
    /**
     * APIMethod: empty
     * clears all of the items from the list
     */
    empty: function(){
        this.container.getChildren().each(function(item){
            this.remove(item);
        }, this);
    }

});