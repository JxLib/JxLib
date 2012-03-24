/*
---

name: Jx.Toolbar

description: A toolbar is a container object that contains other objects such as buttons.

license: MIT-style license.

requires:
 - Jx.Widget
 - Jx.List

provides: [Jx.Toolbar]

css:
 - toolbar

images:
 - toolbar.png
...
 */
// $Id$
/**
 * Class: Jx.Toolbar
 *
 * Extends: <Jx.Widget>
 *
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
 * While a toolbar is generally a *dumb* container, it serves a special
 * purpose for menus by providing some infrastructure so that menus can behave
 * properly.
 *
 * In general, almost anything can be placed in a Toolbar, and mixed with
 * anything else.
 *
 * Example:
 * The following example shows how to create a Jx.Toolbar instance and place
 * two objects in it.
 *
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
define("jx/toolbar", ['../base','./widget','./toolbar/container','./toolbar/item','./list', 'require'],
       function(base, Widget, Container, Item, List, require){
        
    var toolbar = new Class({
        Extends: Widget,
        Family: 'Jx.Toolbar',
        /**
         * Property: list
         * {<Jx.List>} the list that holds the items in this toolbar
         */
        list : null,
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
        active : false,
        options: {
            /* Option: position
             * the position of this toolbar in the container.  The position
             * affects some items in the toolbar, such as menus and flyouts, which
             * need to open in a manner sensitive to the position.  May be one of
             * 'top', 'right', 'bottom' or 'left'.  Default is 'top'.
             */
            position: 'top',
            /* Option: parent
             * a DOM element to add this toolbar to
             */
            parent: null,
            /* Option: autoSize
             * if true, the toolbar will attempt to set its size based on the
             * things it contains.  Default is false.
             */
            autoSize: false,
            /**
             * Option: align
             * Determines whether the toolbar is aligned left, center, or right.
             * Mutually exclusive with the scroll option. If scroll is set to true
             * this option does nothing. Default: 'left', valid values: 'left',
             * 'center', or 'right'
             */
            align: 'left',
            /* Option: scroll
             * if true, the toolbar may scroll if the contents are wider than
             * the size of the toolbar
             */
            scroll: true,
            template: '<ul class="jxToolbar"></ul>'
        },
        classes: {
            domObj: 'jxToolbar'
        },
        
        init: function(){
            //in a global build, Container and Item will be null due to the dependency
            //they have on toolbar (they come after this in the file).
            //So... load them in correctly
            if (base.global) {
                Container = require('jx/toolbar/container');
                Item = require('jx/toolbar/item');
            }
            this.parent();
        },
        /**
         * APIMethod: render
         * Create a new instance of Jx.Toolbar.
         */
        render: function() {
            this.parent();
            this.domObj.store('jxToolbar', this);
            if (this.options.id !== undefined && this.options.id !== null) {
                this.domObj.id = this.options.id;
            }
    
            this.list = new List(this.domObj, {
                onAdd: function(item) {
                    this.fireEvent('add', this);
                }.bind(this),
                onRemove: function(item) {
                    this.fireEvent('remove', this);
                }.bind(this)
            });
    
            this.deactivateWatcher = this.deactivate.bind(this);
            if (this.options.items) {
                this.add(this.options.items);
            }
        },
    
        /**
         * Method: addTo
         * add this toolbar to a DOM element automatically creating a toolbar
         * container if necessary
         *
         * Parameters:
         * parent - the DOM element or toolbar container to add this toolbar to.
         */
        addTo: function(parent) {
            var tbc = document.id(parent).retrieve('jxBarContainer');
            if (!tbc) {
                tbc = new Container({
                    parent: parent,
                    position: this.options.position,
                    autoSize: this.options.autoSize,
                    align: this.options.align,
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
            Array.from(arguments).flatten().each(function(thing) {
                var item = thing;
                if (item.domObj) {
                    item = item.domObj;
                }
    
                if (item.tagName == 'LI') {
                    if (!item.hasClass('jxToolItem')) {
                        item.addClass('jxToolItem');
                    }
                } else {
                    item = new Item(thing);
                }
                this.list.add(item);
            }, this);
            
            //Update the size of the toolbar container.
            this.update();
            
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
            this.list.remove(li);
            this.update();
            return this;
        },
        /**
         * APIMethod: empty
         * remove all items from the toolbar
         */
        empty: function() {
          this.list.each(function(item){this.remove(item);},this);
        },
        /**
         * Method: deactivate
         * Deactivate the Toolbar (when it is acting as a menu bar).
         */
        deactivate: function() {
            this.list.each(function(item){
                if (item.retrieve('jxMenu')) {
                    item.retrieve('jxMenu').hide();
                }
            });
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
            return this.active;
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
        },
        /**
         * Method: update
         * Updates the size of the UL so that the size is always consistently the 
         * exact size of the size of the sum of the buttons. This will keep all of 
         * the buttons on one line.
         */
        update: function () {
            // if (['top','bottom'].contains(this.options.position)) {
            //     (function(){
            //         var s = 0;
            //         var children = this.domObj.getChildren();
            //         children.each(function(button){
            //             var size = button.getMarginBoxSize();
            //             s += size.width +0.5;
            //         },this);
            //         if (s !== 0) {
            //             this.domObj.setStyle('width', Math.round(s));
            //         } else {
            //             this.domObj.setStyle('width','auto');
            //         }
            //     }).delay(1,this);
            // }
            this.fireEvent('update');
        },
        changeText : function(lang) {
          this.update();
        }
    });
    
    if (base.global) {
        base.global.Toolbar = toolbar;
    }
    
    return toolbar;
});
