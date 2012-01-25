/*
---

name: Jx.List

description: A class that is used to manage lists of DOM elements

license: MIT-style license.

requires:
 - Jx.Object
 - Jx.Selection

provides: [Jx.List]

...
 */
// $Id$
/**
 * Class: Jx.List
 *
 * Manage a list of DOM elements and provide an API and events for managing
 * those items within a container.  Works with Jx.Selection to manage
 * selection of items in the list.  You have two options for managing
 * selections.  The first, and default, option is to specify select: true
 * in the constructor options and any of the <Jx.Selection> options as well.
 * This will create a default Jx.Selection object to manage selections.  The
 * second option is to pass a Jx.Selection object as the third constructor
 * argument.  This allows sharing selection between multiple lists.
 *
 * Example:
 * (code)
 * var list = new Jx.List('container',{
 *   hover: true,
 *   select: true,
 *   onSelect: function(el) {
 *     alert(el.get('html'));
 *   }
 * });
 * list.add(new Element('li', {html:'1'}));
 * list.add(new Element('li', {html:'2'}));
 * list.add(new Element('li', {html:'3'}));
 *
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
    Extends: Jx.Object,
    Family: 'Jx.List',
    /**
     * Constructor: Jx.List
     * create a new instance of Jx.List
     *
     * Parameters:
     * container - {Mixed} an element reference or id of an element that will
     * contain the items in the list
     * options - {Object} an object containing optional parameters
     * selection - {<Jx.Selection>} null or a Jx.Selection object. If the
     * select option is set to true, then list will use this selection object
     * to track selections or create its own if no selection object is
     * supplied.
     */
    parameters: ['container', 'options', 'selection'],
    /* does this object own the selection object (and should clean it up) */
    ownsSelection: false,
    /**
     * APIProperty: container
     * the element that will contain items as they are added
     */
    container: null,
    /**
     * APIProperty: selection
     * <Jx.Selection> a selection object if selection is enabled
     */
    selection: null,
    options: {
        /**
         * Option: items
         * an array of items to add to the list right away
         */
        items: null,
        /**
         * Option: hover
         * {Boolean} default false.  If set to true, the wrapper element will
         * obtain the defined hoverClass if set and mouseenter/mouseleave
         * events will be emitted when the user hovers over and out of elements
         */
        hover: false,
        /**
         * Option: hoverClass
         * the CSS class name to add to the wrapper element when the mouse is
         * over an item
         */
        hoverClass: 'jxHover',

        /**
         * Option: press
         * {Boolean} default false.  If set to true, the wrapper element will
         * obtain the defined pressClass if set and mousedown/mouseup
         * events will be emitted when the user clicks on elements
         */
        press: false,
        /**
         * Option: pressedClass
         * the CSS class name to add to the wrapper element when the mouse is
         * down on an item
         */
        pressClass: 'jxPressed',

        /**
         * Option: select
         * {Boolean} default false.  If set to true, the wrapper element will
         * obtain the defined selectClass if set and select/unselect events
         * will be emitted when items are selected and unselected.  For other
         * selection objects, see <Jx.Selection>
         */
        select: false
    },

    /**
     * Method: init
     * internal method to initialize this object
     */
    init: function() {
        this.container = document.id(this.options.container);
        this.container.store('jxList', this);

        var target = this,
            options = this.options,
            isEnabled = function(el) {
                var item = el.retrieve('jxListTargetItem') || el;
                return !item.hasClass('jxDisabled');
            },
            isSelectable = function(el) {
                var item = el.retrieve('jxListTargetItem') || el;
                return !item.hasClass('jxUnselectable');
            };
        this.bound = Object.merge({},this.bound, {
            mousedown: function() {
                if (isEnabled(this)) {
                    this.addClass(options.pressClass);
                    target.fireEvent('mousedown', this, target);
                }
            },
            mouseup: function() {
                if (isEnabled(this)) {
                    this.removeClass(options.pressClass);
                    target.fireEvent('mouseup', this, target);
                }
            },
            mouseenter: function() {
                if (isEnabled(this)) {
                    this.addClass(options.hoverClass);
                    target.fireEvent('mouseenter', this, target);
                }
            },
            mouseleave: function() {
                if (isEnabled(this)) {
                    this.removeClass(options.hoverClass);
                    target.fireEvent('mouseleave', this, target);
                }
            },
            keydown: function(e) {
                if (e.key == 'enter' && isEnabled(this)) {
                    this.addClass('jxPressed');
                }
            },
            keyup: function(e) {
                if (e.key == 'enter' && isEnabled(this)) {
                    this.removeClass('jxPressed');
                }
            },
            click: function (e) {
                if (target.selection &&
                    isEnabled(this) &&
                    isSelectable(this)) {
                    target.selection.select(this, target);
                }
                target.fireEvent('click', this, target);
            },
            select: function(item) {
                if (isEnabled(item)) {
                    var itemTarget = item.retrieve('jxListTargetItem') || item;
                    target.fireEvent('select', itemTarget);
                }
            },
            unselect: function(item) {
                if (isEnabled(item)) {
                    var itemTarget = item.retrieve('jxListTargetItem') || item;
                    target.fireEvent('unselect', itemTarget);
                }
            },
            contextmenu: function(e) {
              var cm = this.retrieve('jxContextMenu');
              if (cm) {
                cm.show(e);
                this.removeClass(options.pressClass);
              }
              e.stop();
            }
        });

        if (options.selection) {
            this.setSelection(options.selection);
            options.select = true;
        } else if (options.select) {
            this.selection = new Jx.Selection(options);
            this.ownsSelection = true;
        }

        if (options.items !== undefined && options.items !== null) {
            this.add(options.items);
        }
    },

    /**
     * Method: cleanup
     * destroy the list and release anything it references
     */
    cleanup: function() {
        this.container.getChildren().each(function(item){
            this.remove(item);
        }, this);
        if (this.selection && this.ownsSelection) {
            this.selection.removeEvents();
            this.selection.destroy();
        }
        this.setSelection(null);
        this.container.eliminate('jxList');
        var bound = this.bound;
        bound.mousedown=null;
        bound.mouseup=null;
        bound.mouseenter=null;
        bound.mouseleave=null;
        bound.keydown=null;
        bound.keyup=null;
        bound.click=null;
        bound.select=null;
        bound.unselect=null;
        bound.contextmenu=null;
        this.parent();
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
     * an integer position in the list or another item to place this item
     * after
     */
    add: function(item, position) {
        if (Jx.type(item) == 'array') {
            item.each(function(what){
              this.add(what, position);
            }.bind(this) );
            return;
        }
        /* the element being wrapped */
        var el = document.id(item),
            target = el.retrieve('jxListTarget') || el,
            bound = this.bound,
            options = this.options,
            container = this.container;
        if (target) {
            target.store('jxListTargetItem', el);
            target.addEvents({
              contextmenu: this.bound.contextmenu
            });
            if (options.press && options.pressClass) {
                target.addEvents({
                    mousedown: bound.mousedown,
                    mouseup: bound.mouseup,
                    keyup: bound.keyup,
                    keydown: bound.keydown
                });
            }
            if (options.hover && options.hoverClass) {
                target.addEvents({
                    mouseenter: bound.mouseenter,
                    mouseleave: bound.mouseleave
                });
            }
            if (this.selection) {
                target.addEvents({
                    click: bound.click
                });
            }
            if (position !== undefined && position !== null) {
                if (Jx.type(position) == 'number') {
                    if (position < container.childNodes.length) {
                        el.inject(container.childNodes[position],'before');
                    } else {
                        el.inject(container, 'bottom');
                    }
                } else if (container.contains(document.id(position))) {
                    el.inject(position,'after');
                }
                this.fireEvent('add', item, this);
            } else {
                el.inject(container, 'bottom');
                this.fireEvent('add', item, this);
            }
            if (this.selection) {
                this.selection.defaultSelect(el);
            }
        }
    },
    /**
     * APIMethod: remove
     * remove an item from the list of items
     *
     * Parameters:
     * item - {mixed} the item to remove or the index of the item to remove.
     * An array of items may also be provided.
     *
     * Returns:
     * {mixed} the item that was removed or null if the item is not a member
     * of this list.
     */
    remove: function(item) {
        var el = document.id(item),
            target;
        if (el && this.container.contains(el)) {
            this.unselect(el, true);
            el.dispose();
            target = el.retrieve('jxListTarget') || el;
            target.removeEvents(this.bound);
            this.fireEvent('remove', item, this);
            return item;
        }
        return null;
    },
    /**
     * APIMethod: replace
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
        if (this.container.contains(document.id(item))) {
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
        return Array.from(this.container.childNodes).indexOf(item);
    },
    /**
     * APIMethod: count
     * returns the number of items in the list
     */
    count: function() {
        return this.container.childNodes.length;
    },
    /**
     * APIMethod: items
     * returns an array of the items in the list
     */
    items: function() {
        return Array.from(this.container.childNodes);
    },
    /**
     * APIMethod: each
     * applies the supplied function to each item
     *
     * Parameters:
     * func - {function} the function to apply, it will receive the item and
     * index of the item as parameters
     * context - {object} the context to execute the function in, null by
     * default.
     */
    each: function(f, context) {
        Array.from(this.container.childNodes).each(f, context);
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
        if (this.selection) {
            this.selection.select(item);
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
     * force - {Boolean} force deselection even if this violates the minimum
     * selection constraint (used internally when removing items)
     */
    unselect: function(item, force) {
        if (this.selection) {
            this.selection.unselect(item);
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
        return this.selection ? this.selection.selected : [];
    },
    /**
     * APIMethod: empty
     * clears all of the items from the list
     */
    empty: function(){
        this.container.getChildren().each(function(item){
            this.remove(item);
        }, this);
    },
    /**
     * APIMethod: setSelection
     * sets the <Jx.Selection> object that this list will use for selection
     * events.
     *
     * Parameters:
     * {<Jx.Selection>} the selection object, or null to remove it.
     */
    setSelection: function(selection) {
        var sel = this.selection;
        if (sel == selection) return;

        if (sel) {
            sel.removeEvents(this.bound);
            if (this.ownsSelection) {
                sel.destroy();
                this.ownsSelection = false;
            }
        }

        this.selection = selection;
        if (selection) {
            selection.addEvents({
                select: this.bound.select,
                unselect: this.bound.unselect
            });
        }
    }

});