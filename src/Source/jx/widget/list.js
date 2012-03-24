/*
---

name: Jx.Widget.List

description: A class that is used to manage lists of DOM elements

license: MIT-style license.

requires:
 - Jx.Widget
 - Jx.Selection
 - Core/Element.Delegation

provides: [Jx.Widget.List]

...
 */
// $Id$
/**
 * Class: Jx.Widget.List
 *
 * Creates a Widget that has the capability to manage a list of DOM 
 * elements and provide an API and events for managing
 * those items within a container.  Works with Jx.Selection to manage
 * selection of items in the list.  You have two options for managing
 * selections.  The first, and default, option is to specify select: true
 * in the constructor options and any of the <Jx.Selection> options as well.
 * This will create a default Jx.Selection object to manage selections.  The
 * second option is to pass a Jx.Selection object as the third constructor
 * argument.  This allows sharing selection between multiple lists.
 * 
 * This class contains all of the methods in <Jx.Widget> as well as those defined
 * in <Jx.List> (though they are slightly modified.
 *
 * Example:
 * (code)
 * var list = new Jx.Widget.List({
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
define('jx/widget/list', ['../../base','../widget','../selection'], function(base, Widget, Selection){
    
    var list = new Class({
        
        Extends: Widget,
        Family: 'Jx.Widget.List',
        /**
         * Constructor: Jx.Widget.List
         * create a new instance of Jx.Widget.List
         *
         * Parameters:
         * options - {Object} an object containing optional parameters
         * selection - 
         */
        parameters: ['options'],
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
        /**
         * APIProperty: holdEvents
         * Tells the event handlers whether they should continue. This allows outside
         * code to stop default handling of events to prevent them from firing
         * additional unwanted events in some circumstances.
         */
        holdEvents: false,
        
        options: {
            /**
             * Option: selection
             * {<Jx.Selection>} null or a Jx.Selection object. If the
             * select option is set to true, then list will use this selection object
             * to track selections or create its own if no selection object is
             * supplied.
             */
            selection: null,
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
            select: false,
            /**
             * Option: returnJx
             * {Boolean} Determines whether the select and unselect methods fire with
             * a DOM object or Jx object as it's parameter. If true, then we run $jx()
             * on the selected, or unselected, element to find the first Jx object and
             * fire the event with that class as the parameter. Defaults to false.
             */
            returnJx: false,
            
            trackEvents: {
                mouseenter: {
                    on: true,
                    obj: 'li'
                },
                mouseleave: {
                    on: true,
                    obj: 'li'
                },
                mousedown: {
                    on: true,
                    obj: 'li'
                },
                mouseup: {
                    on: true,
                    obj: 'li'
                },
                keydown: {
                    on: true,
                    obj: 'li'
                },
                keyup: {
                    on: true,
                    obj: 'li'
                },
                click: {
                    on: true,
                    obj: 'li'
                },
                dblclick: {
                    on: true,
                    obj: 'li'
                },
                contextmenu: {
                    on: true,
                    obj: 'li'
                }
            },
            template: '<div class="jxWidget jxListContainer"></div>',
            /**
             * Option: selectionFunction
             * This should be a function that returns a boolean value indicating
             * whether the passed in node is selectable or not.
             */
            selectionFunction: function(el, e){
                var item = document.id(el).retrieve('jxListTargetItem') || el;
                return !item.hasClass('jxUnselectable');
            },
            /**
             * Option: selectionEvents
             * Determines whether we listen for and rethrow events from Jx.Selection
             */
            selectionEvents: {
                select: true,
                unselect: true
            }
        },
        
        classes: {
            domObj: 'jxWidget',
            container: 'jxListContainer'
        },
    
        /**
         * Method: init
         * internal method to initialize this object
         */
        init: function() {
            this.parent();
            
            //this.container = document.id(this.options.container);
            if (this.container) {
                this.container.store('jxList', this);
            }
    
            var target = this,
                options = this.options;
                
            
            //We'll be using Element Event delegation from moo-more so we don't need
            //all of the bound methods attached to every item in the list. This 
            //allows for fewer events attached and items can be dynamically added 
            //and removed without worrying about attaching or removing events.
            this.bound = Object.merge({},this.bound,{
                'mousedown': function(e,el) {
                    if (!target.holdEvents) {
                        el = document.id(base.getWidget(el));
                        if (target.isEnabled(el)) {
                            el.addClass(options.pressClass);
                            target.fireEvent('mousedown', [el, target, e]);
                        }
                    }
                },
                'mouseup': function(e,el) {
                    if (!target.holdEvents) {
                        el = document.id(base.getWidget(el));
                        if (target.isEnabled(el)) {
                            el.removeClass(options.pressClass);
                            target.fireEvent('mouseup', [el, target, e]);
                        }
                    }
                },
                'mouseenter': function(e,el) {
                    if (!target.holdEvents) {
                        //console.log('mouseenter in Widget.List on ',el);
                        el = document.id(base.getWidget(el));
                        if (target.isEnabled(el)) {
                            //remove class from any other item that has it as
                            //entering a nested li won't remove the class from 
                            //a higher level
                            var el2 = target.container.getElement('.' + options.hoverClass);
                            if (el2 !== null && el2 !== undefined) {
                                el2.removeClass(options.hoverClass);
                            }
                            el.addClass(options.hoverClass);
                            target.fireEvent('mouseenter', [el, target, e]);
                        }
                    }
                },
                'mouseleave': function(e,el) {
                    if (!target.holdEvents) {
                        //console.log('mouseleave in Widget.List on ',el);
                        el = document.id(base.getWidget(el));
                        if (target.isEnabled(el)) {
                            //remove hoverClass
                            el.removeClass(options.hoverClass);
                            //and the pressedClass
                            el.removeClass(options.pressClass);
                            target.fireEvent('mouseleave', [el, target, e]);
                        }
                    }
                },
                'keydown': function(e,el) {
                    if (!target.holdEvents) {
                        el = document.id(base.getWidget(el));
                        if (e.key == 'enter' && target.isEnabled(el)) {
                            el.addClass('jxPressed');
                        }
                    }
                },
                'keyup': function(e,el) {
                    if (!target.holdEvents) {
                        el = document.id(base.getWidget(el));
                        if (e.key == 'enter' && target.isEnabled(el)) {
                            el.removeClass('jxPressed');
                        }
                    }
                },
                'click': function (e,el) {
                    if (!target.holdEvents) {
                        el = document.id(base.getWidget(el));
                        console.log('click in Widget.List on ',el);
                        if (target.selection &&
                            target.isEnabled(el) &&
                            target.isSelectable(el, e)) {
                            target.selection.select(el, target);
                        }
                        target.fireEvent('click', [el, target, e]);
                    }
                },
                'dblclick': function (e,el) {
                    if (!target.holdEvents) {
                        el = document.id(base.getWidget(el));
                        if (target.selection &&
                            target.isEnabled(el) &&
                            target.isSelectable(el, e)) {
                            target.selection.select(el, target);
                        }
                        target.fireEvent('dblclick', [el, target, e]);
                    }
                },
                'contextmenu': function(e,el) {
                  if (!target.holdEvents) {
                      el = document.id(base.getWidget(el));
                      var cm = el.retrieve('jxContextMenu');
                      if (cm) {
                        cm.show(e);
                        el.removeClass(options.pressClass);
                        e.stop();  //only stop it if we have our own context menu
                      }
                  }
                },
                select: function(item) {
                    if (!target.holdEvents) {
                        item = document.id(base.getWidget(item));
                        if (this.isEnabled(item)) {
                            var itemTarget;
                            if (this.options.returnJx) {
                                itemTarget = base.getWidget(item);
                            } else {
                                itemTarget = item.retrieve('jxListTargetItem') || item;
                            }
                            this.fireEvent('select', itemTarget);
                        }
                    }
                }.bind(this),
                unselect: function(item) {
                    if (!target.holdEvents) {
                        item = document.id(base.getWidget(item));
                        if (this.isEnabled(item)) {
                            var itemTarget;
                            if (this.options.returnJx) {
                                itemTarget = base.getWidget(item);
                            } else {
                                itemTarget = item.retrieve('jxListTargetItem') || item;
                            }
                            this.fireEvent('unselect', itemTarget);
                        }
                    }
                }.bind(this)
            });
            
            //activate each event on the container
            var trackEvents = this.options.trackEvents;
            if (trackEvents) {
                for (var key in trackEvents) {
                    if (trackEvents[key].on){
                        if (trackEvents[key].obj !== null && trackEvents[key].obj !== undefined) {
                            this.container.addEvent(key + ':relay(' + trackEvents[key].obj + ')',this.bound[key]);
                        } else {
                            this.container.addEvent(key, this.bound[key]);
                        }
                    }
                }
            }
            
            if (options.selection) {
                this.setSelection(options.selection);
                options.select = true;
            } else if (options.select) {
                var opts = Object.merge({},options);
                delete opts.plugins;
                this.selection = new Selection(opts);
                this.ownsSelection = true;
            }
            
            if (this.selection !== undefined && this.selection !== null) {
                var selectionEvents = this.options.selectionEvents;
                for (var key in selectionEvents) {
                    if (selectionEvents[key]) {
                        this.selection.addEvent(key, this.bound[key])
                    }
                }
            }
    
            if (options.items !== undefined && options.items !== null) {
                this.add(options.items);
            }
        },
    
        isEnabled: function(el) {
            var item = el.retrieve('jxListTargetItem') || el;
            return !item.hasClass('jxDisabled');
        },
        
        isSelectable: function(el, e) {
            return this.options.selectionFunction(el, e);
        },
        
        setHoldEvents: function(state){
            this.holdEvents = state;
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
         * APIMethod: stopListening
         * removes all events from this list so that the list no longer monitors them.
         * This is designed to be used when nesting one list within another so that
         * the first list can manage everything and the subsequent lists don't mess
         * things up.
         */
        stopListening: function(){
            this.container.removeEvents(this.bound);
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
            if (typeOf(item) == 'array') {
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
                
                if (position !== undefined && position !== null) {
                    if (typeOf(position) == 'number') {
                        if (position < container.childNodes.length) {
                            el.inject(container.childNodes[position],'before');
                        } else {
                            el.inject(container, 'bottom');
                        }
                    } else if (['top','bottom','after','before'].contains(position)) {
                        el.inject(container,position);   
                    } else {
                        var tempEl = document.id(position);
                        if (tempEl !== undefined && tempEl !== null &&
                            container.contains(tempEl)) {
                            el.inject(position,'after');
                        }
                    } 
                        
                } else {
                    el.inject(container, 'bottom');
                }
                if (this.options.returnJx) {
                    this.fireEvent('add', base.getWidget(item), this);
                } else {
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
                if (this.options.returnJx) {
                    this.fireEvent('remove', base.getWidget(item), this);
                } else {
                    this.fireEvent('remove', item, this);
                }
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
            var items = Array.from(this.container.childNodes);
            if (this.options.returnJx) {
                items = items.map(function(item) {
                    return base.getWidget(item);
                });
            }
            return items;
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
    
    if (base.global) {
        base.global.Widget.List = list;
    }
    
    return list;
    
});