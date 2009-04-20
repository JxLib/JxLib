// $Id$
/**
 * Class: Jx.Toolbar
 * A toolbar is a container object that contains other objects such as
 * buttons.  The toolbar organizes the objects it contains automatically,
 * wrapping them as necessary.  Multiple toolbars may be placed within
 * the same containing object.
 *
 * Jx.Toolbar includes CSS classes for styling the appearance of a
 * toolbar to be similar to traditional desktop application toolbars.
 *
 * There is one special object, Jx.ToolbarSeparator, that provides
 * a visual separation between objects in a toolbar.
 *
 * While a toolbar is generally a *dumb* container, it serves a special purpose
 * for menus by providing some infrastructure so that menus can behave
 * properly.
 *
 * In general, almost anything can be placed in a Toolbar, and mixed with 
 * anything else.
 *
 * Example:
 * The following example shows how to create a Jx.Toolbar instance and place two objects in it.
 * (code)
 * //myToolbarContainer is the id of a <div> in the HTML page.
 * function myFunction() {}
 * var myToolbar = new Jx.Toolbar('myToolbarContainer');
 * 
 * var myButton = new Jx.Button(buttonOptions);
 *
 * var myElement = document.createElement('select');
 *
 * myToolbar.add(myButton, new Jx.ToolbarSeparator(), myElement);
 * (end)
 *
 * Events:
 * add - fired when one or more buttons are added to a toolbar
 * remove - fired when on eor more buttons are removed from a toolbar
 *
 * Implements: 
 * Options
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Toolbar = new Class({
    Family: 'Jx.Toolbar',
    Implements: [Options,Events],
    /**
     * Property: items
     * {Array} an array of the things in the toolbar.
     */
    items : null,
    /**
     * Property: domObj
     * {HTMLElement} the HTML element that the toolbar lives in
     */
    domObj : null,
    /**
     * Property: isActive
     * When a toolbar contains <Jx.Menu> instances, they want to know
     * if any menu in the toolbar is active and this is how they
     * find out.
     */
    isActive : false,
    options: {
        type: 'Toolbar',
        position: 'top',
        parent: null,
        autoSize: false,
        scroll: true
    },
    /**
     * Constructor: Jx.Toolbar
     * Create a new instance of Jx.Toolbar.
     *
     * Parameters:
     * options - an options object as documented below
     *
     * Options:
     * parent - {HTMLElement} object reference or id to place the toolbar in.
     * position - one of 'top', 'right', 'bottom', or 'left', indicates how
     * the toolbar is being placed in the page and may influence the behaviour
     * of items in the toolbar that open sub panels, they will tend to open
     * them towards the center of the page.  Default is top.
     */
    initialize : function(options) {
        this.setOptions(options);
        this.items = [];
        
        this.domObj = new Element('ul', {
            id: this.options.id,
            'class':'jx'+this.options.type
        });
        
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
        this.deactivateWatcher = this.deactivate.bindWithEvent(this);
        if (this.options.items) {
            this.add(this.options.items);
        }
    },
    
    addTo: function(parent) {
        var tbc = $(parent).retrieve('jxBarContainer');
        if (!tbc) {
            tbc = new Jx.Toolbar.Container({
                parent: parent, 
                position: this.options.position, 
                autoSize: this.options.autoSize,
                scroll: this.options.scroll
            });
        }
        tbc.add(this);
        return this;
    },
    
    /**
     * Method: add
     * Add an item to the toolbar.  If the item being added is a Jx component
     * with a domObj property, the domObj is added.  If the item being added
     * is an LI element, then it is given a CSS class of *jxToolItem*.
     * Otherwise, the thing is wrapped in a <Jx.ToolbarItem>.
     *
     * Parameters:
     * thing - {Object} the thing to add.  More than one thing can be added
     * by passing multiple arguments.
     */
    add: function( ) {
        $A(arguments).flatten().each(function(thing) {
            if (thing.domObj) {
                thing = thing.domObj;
            }
            if (thing.tagName == 'LI') {
                if (!thing.hasClass('jxToolItem')) {
                    thing.addClass('jxToolItem');
                }
                this.domObj.appendChild(thing);
            } else {
                var item = new Jx.Toolbar.Item(thing);
                this.domObj.appendChild(item.domObj);
            }            
        }, this);

        if (arguments.length > 0) {
            this.fireEvent('add', this);
        }
        return this;
    },
    /**
     * Method: remove
     * remove an item from a toolbar.  If the item is not in this toolbar
     * nothing happens
     *
     * Parameters:
     * item - {Object} the object to remove
     *
     * Returns:
     * {Object} the item that was removed, or null if the item was not
     * removed.
     */
    remove: function(item) {
        if (item.domObj) {
            item = item.domObj;
        }
        var li = item.findElement('LI');
        if (li && li.parentNode == this.domObj) {
            item.dispose();
            li.dispose();
            this.fireEvent('remove', this);
        } else {
            return null;
        }
    },
    /**
     * Method: deactivate
     * Deactivate the Toolbar (when it is acting as a menu bar).
     */
    deactivate: function() {
        this.items.each(function(o){o.hide();});
        this.setActive(false);
    },
    /**
     * Method: isActive
     * Indicate if the toolbar is currently active (as a menu bar)
     *
     * Returns:
     * {Boolean}
     */
    isActive: function() { 
        return this.isActive; 
    },
    /**
     * Method: setActive
     * Set the active state of the toolbar (for menus)
     *
     * Parameters: 
     * b - {Boolean} the new state
     */
    setActive: function(b) { 
        this.isActive = b;
        if (this.isActive) {
            document.addEvent('click', this.deactivateWatcher);
        } else {
            document.removeEvent('click', this.deactivateWatcher);
        }
    },
    /**
     * Method: setVisibleItem
     * For menus, they want to know which menu is currently open.
     *
     * Parameters:
     * obj - {<Jx.Menu>} the menu that just opened.
     */
    setVisibleItem: function(obj) {
        if (this.visibleItem && this.visibleItem.hide && this.visibleItem != obj) {
            this.visibleItem.hide();
        }
        this.visibleItem = obj;
        if (this.isActive()) {
            this.visibleItem.show();
        }
    },
    showItem: function(item) {
        this.fireEvent('show', item);
    }
});
