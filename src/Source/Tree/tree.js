/*
---

name: Jx.Tree

description: Jx.Tree displays hierarchical data in a tree structure of folders and nodes.

license: MIT-style license.

requires:
 - Jx.Widget
 - Jx.List

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
Jx.Tree = new Class({
    Family: 'Jx.Tree',
    Extends: Jx.Widget,
    parameters: ['options','container', 'selection'],
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
        template: '<ul class="jxTreeRoot"></ul>'
    },
    /**
     * APIProperty: classes
     * {Hash} a hash of property to CSS class names for extracting references
     * to DOM elements from the supplied templates.  Requires
     * domObj element, anything else is optional.
     */
    classes: new Hash({domObj: 'jxTreeRoot'}),
    
    frozen: false,
    
    /**
     * APIMethod: render
     * Render the Jx.Tree.
     */
    render: function() {
        this.parent();
        if ($defined(this.options.container) &&
            document.id(this.options.container)) {
            this.domObj = this.options.container;
        }

        if (this.options.selection) {
            this.selection = this.options.selection;
        } else if (this.options.select) {
            this.selection = new Jx.Selection(this.options);
            this.ownsSelection = true;
        }

        this.bound.select = function(item) {
            this.fireEvent('select', item.retrieve('jxTreeItem'));
        }.bind(this);
        this.bound.unselect = function(item) {
            this.fireEvent('unselect', item.retrieve('jxTreeItem'));
        }.bind(this);
        this.bound.onAdd = function(item) {this.update();}.bind(this);
        this.bound.onRemove = function(item) {this.update();}.bind(this);

        if (this.selection && this.ownsSelection) {
            this.selection.addEvents({
                select: this.bound.select,
                unselect: this.bound.unselect
            });
        }

        this.list = new Jx.List(this.domObj, {
                hover: true,
                press: true,
                select: true,
                onAdd: this.bound.onAdd,
                onRemove: this.bound.onRemove
            }, this.selection);
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
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
      if (state && this.owner && this.owner.setDirty) {
        this.owner.setDirty(state);
      }
    },

    /**
     * APIMethod: add
     * add one or more items to the tree at a particular position in the tree
     *
     * Parameters:
     * item - {<Jx.TreeItem>} or an array of items to be added
     * position - {mixed} optional location to add the items.  By default,
     * this is 'bottom' meaning the items are added at the end of the list.
     * See <Jx.List::add> for options
     *
     * Returns:
     * {<Jx.Tree>} a reference to this object for chaining calls
     */
    add: function(item, position) {
        if ($type(item) == 'array') {
            item.each(function(what){ this.add(what, position); }.bind(this) );
            return;
        }
        item.addEvents({
            add: function(what) { this.fireEvent('add', what).bind(this); },
            remove: function(what) { this.fireEvent('remove', what).bind(this); },
            disclose: function(what) { this.fireEvent('disclose', what).bind(this); }
        });
        item.setSelection(this.selection);
        item.owner = this;
        this.list.add(item, position);
        this.setDirty(true);
        this.update(true);
        return this;
    },
    /**
     * APIMethod: remove
     * remove an item from the tree
     *
     * Parameters:
     * item - {<Jx.TreeItem>} the tree item to remove
     *
     * Returns:
     * {<Jx.Tree>} a reference to this object for chaining calls
     */
    remove: function(item) {
        item.removeEvents('add');
        item.removeEvents('remove');
        item.removeEvents('disclose');
        item.owner = null;
        this.list.remove(item);
        item.setSelection(null);
        this.setDirty(true);
        this.update(true);
        return this;
    },
    /**
     * APIMethod: replace
     * replaces one item with another
     *
     * Parameters:
     * item - {<Jx.TreeItem>} the tree item to remove
     * withItem - {<Jx.TreeItem>} the tree item to insert
     *
     * Returns:
     * {<Jx.Tree>} a reference to this object for chaining calls
     */
    replace: function(item, withItem) {
        item.owner = null;
        withItem.owner = this;
        this.list.replace(item, withItem);
        withItem.setSelection(this.selection);
        item.setSelection(null);
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
        if (this.selection && this.ownsSelection) {
            this.selection.removeEvents({
                select: this.bound.select,
                unselect: this.bound.unselect
            });
            this.selection.destroy();
            this.selection = null;
        }
        this.list.removeEvents({
          remove: this.bound.onRemove,
          add: this.bound.onAdd
        });
        this.list.destroy();
        this.list = null;
        this.bound.select = null;
        this.bound.unselect = null;
        this.bound.onRemove = null;
        this.bound.onAdd = null;
        this.parent();
    },
    
    /**
     * Method: update
     * Update the CSS of the Tree's DOM element in case it has changed
     * position
     *
     * Parameters:
     * shouldDescend - {Boolean} propagate changes to child nodes?
     */
    update: function(shouldDescend, isLast) {
        // since the memory leak cleanup, it seems that update gets called
        // from the bound onRemove event after the list has been cleaned
        // up.  I suspect that there is a delayed function call for IE in
        // event handling (or some such thing) PS
        if (!this.list) return;
        if (this.frozen) return;
        
        if ($defined(isLast)) {
            if (isLast) {
                this.domObj.removeClass('jxTreeNest');
            } else {
                this.domObj.addClass('jxTreeNest');
            }
        }
        var last = this.list.count() - 1;
        this.list.each(function(item, idx){
            var lastItem = idx == last;
            if (item.retrieve('jxTreeFolder')) {
                item.retrieve('jxTreeFolder').update(shouldDescend, lastItem);
            }
            if (item.retrieve('jxTreeItem')) {
                item.retrieve('jxTreeItem').update(lastItem);
            }
        });
        this.setDirty(false);
    },

    /**
     * APIMethod: items
     * return an array of tree item instances contained in this tree.
     * Does not descend into folders but does return a reference to the
     * folders
     */
    items: function() {
        return this.list.items().map(function(item) {
            return item.retrieve('jxTreeItem');
        });
    },
    /**
     * APIMethod: empty
     * recursively empty this tree and any folders in it
     */
    empty: function() {
        this.list.items().each(function(item){
          var f = item.retrieve('jxTreeItem');
          if (f && f instanceof Jx.TreeFolder) {
            f.empty();
          }
          if (f && f instanceof Jx.TreeItem) {
            this.remove(f);
            f.destroy();
          }
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
        if (path.length == 0) {
            return false;
        }
        //path has more than one thing in it, find a folder and descend into it
        var name = path[0];
        var result = false;
        this.list.items().some(function(item) {
            var treeItem = item.retrieve('jxTreeItem');
            if (treeItem && treeItem.getLabel() == name) {
                if (path.length > 0) {
                    var folder = item.retrieve('jxTreeFolder');
                    if (folder && path.length > 1) {
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
        this.list.setSelection(selection);
        this.list.each(function(item) {
            item.retrieve('jxTreeItem').setSelection(selection);
        });
        return this;
    }
});

