/*
---

name: Jx.Tree

description: Jx.Tree displays hierarchical data in a tree structure of folders and nodes.

license: MIT-style license.

requires:
 - Jx.Widget.List

provides: [Jx.Tree]

css:
 - tree

images:
 - tree.png
 - tree_vert_line.png
...
 */
// $Id$
/**
 * Class: Jx.Tree
 *
 * Jx.Tree displays hierarchical data in a tree structure of folders and nodes.
 *
 * Example:
 * (code)
 * (end)
 *
 * Extends: <Jx.Widget>
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
define("jx/tree", ['../base','./widget/list','./tree/item','./tree/folder'],
       function(base, WidgetList, Item, Folder){
        
    var tree = new Class({
    
        Extends: WidgetList,
        Family: 'Jx.Tree',
        parameters: ['options'],
        pluginNamespace: 'Tree',
        /**
         * APIProperty: selection
         * {<Jx.Selection>} the selection object for this tree.
         */
        selection: null,
        /**
         * Property: ownsSelection
         * {Boolean} indicates if this object created the <Jx.Selection> object
         * or not.  If true then the selection object will be destroyed when the
         * tree is destroyed, otherwise the selection object will not be
         * destroyed.
         */
        ownsSelection: false,
        /**
         * Property: list
         * {<Jx.List>} the list object is used to manage the DOM elements of the
         * items added to the tree.
         */
        list: null,
        dirty: true,
        /**
         * APIProperty: domObj
         * {HTMLElement} the DOM element that contains the visual representation
         * of the tree.
         */
        domObj: null,
        options: {
            /**
             * Option: select
             * {Boolean} are items in the tree selectable?  See <Jx.Selection>
             * for other options relating to selections that can be set here.
             */
            select: true,
            /**
             * Option: template
             * the default HTML template for a tree can be overridden
             */
            template: '<ul class="jxTreeRoot jxListContainer"></ul>',
            
            trackEvents: {
                mouseenter: {
                    on: true,
                    obj: 'li > a'
                },
                mouseleave: {
                    on: true,
                    obj: 'li > a'
                },
                click: {
                    on: true,
                    obj: 'li > a, li > img'
                }
            }
        },
        /**
         * APIProperty: classes
         * {Object} anobject of property to CSS class names for extracting references
         * to DOM elements from the supplied templates.  Requires
         * domObj element, anything else is optional.
         */
        classes: {domObj: 'jxTreeRoot'},
        
        frozen: false,
        
        init: function(){
            //in global mode, folder and item are not defined when the class is defined.
            //get them now
            if (base.global && Folder === undefined) {
                Folder = require('jx/tree/folder');
            }
            if (base.global && Item === undefined) {
                Item = require('jx/tree/item');
            }
            this.parent();
        },
        
        /**
         * APIMethod: render
         * Render the Jx.Tree.
         */
        render: function() {
            this.parent();
    
            this.options.returnJx = true;
            
            this.bound.toggle = this.toggle.bind(this);
    
            this.addEvents({
                click: this.bound.toggle,
                dblclick: this.bound.toggle
            });
        },
        /**
         * APIMethod: freeze
         * stop the tree from processing updates every time something is added or
         * removed.  Used for bulk changes, call thaw() when done updating.  Note
         * the tree will still display the changes but it will delay potentially
         * expensive recursion across the entire tree on every change just to
         * update visual styles.
         */
        freeze: function() { this.frozen = true; },
        /**
         * APIMethod: thaw
         * unfreeze the tree and recursively update styles
         */
        thaw: function() { this.frozen = false; this.update(true); },
        
        setDirty: function(state) {
          this.dirty = state;
        },
    
        /**
         * APIMethod: add
         * add one or more items to the tree at a particular position in the tree
         *
         * Parameters:
         * item - {<Jx.Tree.Item>} or an array of items to be added
         * position - {mixed} optional location to add the items.  By default,
         * this is 'bottom' meaning the items are added at the end of the list.
         * See <Jx.Widget.List::add> for options
         *
         * Returns:
         * {<Jx.Tree>} a reference to this object for chaining calls
         */
        add: function(item, position) {
            if (typeOf(item) == 'array') {
                item.each(function(what){ this.add(what, position); }.bind(this) );
                return;
            }
            if (instanceOf(item, Folder)) {
                item.addEvents({
                    add: function(what) { 
                        this.fireEvent('add', what); 
                    }.bind(this),
                    remove: function(what) { 
                        this.fireEvent('remove', what); 
                    }.bind(this)
                    /*
                    click: function(what) { 
                        this.fireEvent('click', what); 
                    }.bind(this)
                    */
                });
                item.setSelection(this.selection);
                item.stopListening();
            }
            
            item.owner = this;
            this.parent(item,position);
            this.setDirty(true);
            this.update(true);
            this.fireEvent('add',item);
            return this;
        },
        /**
         * APIMethod: remove
         * remove an item from the tree
         *
         * Parameters:
         * item - {<Jx.Tree.Item>} the tree item to remove
         *
         * Returns:
         * {<Jx.Tree>} a reference to this object for chaining calls
         */
        remove: function(item) {
            if (instanceOf(item, Folder)) {
                item.removeEvents('add');
                item.removeEvents('remove');
                item.removeEvents('disclose');
                item.setSelection(null);
            }
            item.owner = null;
            this.parent(item);
            this.setDirty(true);
            this.update(true);
            return this;
        },
        /**
         * APIMethod: replace
         * replaces one item with another
         *
         * Parameters:
         * item - {<Jx.Tree.Item>} the tree item to remove
         * withItem - {<Jx.Tree.Item>} the tree item to insert
         *
         * Returns:
         * {<Jx.Tree>} a reference to this object for chaining calls
         */
        replace: function(item, withItem) {
            if (instanceOf(item, Folder)) {
                item.setSelection(null);
            }
            if (instanceOf(withItem, Folder)) {
                withItem.setSelection(this.selection);
            }
            item.owner = null;
            withItem.owner = this;
            this.parent(item, withItem);
            this.setDirty(true);
            this.update(true);
            return this;
        },
    
        /**
         * Method: cleanup
         * Clean up a Jx.Tree instance
         */
        cleanup: function() {
            // stop updates when removing existing items.
            this.freeze();
            this.parent();
        },
        
        /**
         * Method: update
         * Update the CSS of the Tree's DOM element in case it has changed
         * position
         *
         * Parameters:
         * shouldDescend - {Boolean} propagate changes to child nodes
         */
        update: function(shouldDescend) {
            // since the memory leak cleanup, it seems that update gets called
            // from the bound onRemove event after the list has been cleaned
            // up.  I suspect that there is a delayed function call for IE in
            // event handling (or some such thing) PS
            if (this.frozen) return;
            
            var last = this.count() - 1;
            this.items().each(function(item, idx){
                var lastItem = idx == last,
                    jx = $jx(item);
                if (instanceOf(jx, Folder)) {
                    jx.update(shouldDescend, lastItem);
                } else if (instanceOf(jx, Item)) {
                    jx.update(lastItem);
                }
            });
            this.setDirty(false);
        },
    
        /**
         * APIMethod: empty
         * recursively empty this tree and any folders in it
         */
        empty: function() {
            this.items().each(function(item){
              if (instanceOf(item, Folder)) {
                item.empty();
              } 
              this.remove(item);
              item.destroy();
            }, this);
            this.setDirty(true);
        },
    
        /**
         * APIMethod: findChild
         * Get a reference to a child node by recursively searching the tree
         *
         * Parameters:
         * path - {Array} an array of labels of nodes to search for
         *
         * Returns:
         * {Object} the node or null if the path was not found
         */
        findChild : function(path) {
            //path is empty - we are asking for this node
            if (path.length === 0) {
                return false;
            }
            //path has more than one thing in it, find a folder and descend into it
            var name = path[0];
            var result = false;
            this.items().some(function(item) {
                var treeItem = base.getWidget(item);
                if (treeItem && treeItem.getLabel() == name) {
                    if (path.length > 0) {
                        var folder = base.getWidget(item);
                        if (folder && instanceOf(folder, Folder) && path.length > 1) {
                            result = folder.findChild(path.slice(1, path.length));
                        } else {
                          result = treeItem;
                        }
                    } else {
                        result = treeItem;
                    }
                }
                return result;
            });
            return result;
        },
        
         /**
         * APIMethod: toggle
         * Checks if we have a folder and toggles its state between open and closed
         *
         * Returns:
         * {<Jx.Tree>} a reference to this for chaining
         */
        toggle: function(el, obj) {
            console.log('in toggle method');
            if (!this.holdEvents) {
                var jx = base.getWidget(el);
                if (instanceOf(jx, Folder) && jx.isEnabled(el)) {
                    if (jx.isOpen()) {
                        jx.collapse();
                    } else {
                        jx.expand();
                    }
                }
            }
            return this;
        },
        
        /**
         * APIMethod: setSelection
         * sets the <Jx.Selection> object to be used by this tree.  Used primarily
         * by <Jx.TreeFolder> to propogate a single selection object throughout a
         * tree.
         *
         * Parameters:
         * selection - {<Jx.Selection>} the new selection object to use
         *
         * Returns:
         * {<Jx.Tree>} a reference to this object for chaining
         */
        setSelection: function(selection) {
            if (this.selection && this.ownsSelection) {
                this.selection.removeEvents(this.bound);
                this.selection.destroy();
                this.ownsSelection = false;
            }
            this.selection = selection;
            this.parent(selection);
            this.each(function(item) {
                var jx = base.getWidget(item);
                if (instanceOf(jx, Folder)) {
                    jx.setSelection(selection);
                }
            });
            return this;
        }
    });
    
    if (base.global) {
        base.global.Tree = tree;
    }
    
    return tree;
    
});

