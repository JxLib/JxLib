// $Id$
/**
 * Class: Jx.Tree
 *
 * Extends: Jx.TreeFolder
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
    selection: null,
    ownsSelection: false,
    isOpen: true,
    list: null,
    domObj: null,
    options: {
        /* APIProperty: select
         * {Boolean} are items in the tree selectable?  See <Jx.Selection>
         * for other options relating to selections that can be set here.
         */
        select: true,
        template: '<ul class="jxTreeRoot"></ul>'
    },
    classes: ['jxTreeRoot'],
    /**
     * APIMethod: render
     * Create a new instance of Jx.Tree
     */
    render: function() {
        this.parent();
        
        if (this.options.selection) {
            this.selection = this.options.selection;
        } else if (this.options.select) {
            this.selection = new Jx.Selection(this.options);
            this.ownsSelection = true;
        }
        
        this.bound = {
            select: function(item) {
                this.fireEvent('select', item.retrieve('jxTreeItem'));
            }.bind(this),
            unselect: function(item) {
                this.fireEvent('unselect', item.retrieve('jxTreeItem'));
            }.bind(this)
        }

        if (this.selection && this.ownsSelection) {
            this.selection.addEvents({
                select: this.bound.select,
                unselect: this.bound.unselect
            });
        }
        
        if ($defined(this.options.container) && 
            document.id(this.options.container)) {
            this.domObj = this.options.container;
        } else {
            this.elements = this.processTemplate(this.options.template, this.classes);
            this.domObj = this.elements.get('jxTreeRoot');
        }
        this.list = new Jx.List(this.domObj, {
                hover: true,
                press: true,
                select: true,
                onAdd: function(item) {this.update();}.bind(this),
                onRemove: function(item) {this.update();}.bind(this)
            }, this.selection);
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
    },
    
    add: function(item, position) {
        item.addEvents({
            add: function(what) { this.fireEvent('add', what).bind(this); },
            remove: function(what) { this.fireEvent('remove', what).bind(this); },
            disclose: function(what) { this.fireEvent('disclose', what).bind(this); }
        })
        item.setSelection(this.selection);
        item.owner = this;
        this.list.add(item, position);
        return this;
    },
    remove: function(item) {
        item.removeEvents('add');
        item.removeEvents('remove');
        item.removeEvents('disclose');
        item.owner = null;
        this.list.remove(item);
        item.setSelection(null);
        return this;
    },
    replace: function(item, withItem) {
        item.owner = null;
        withItem.owner = this;
        this.list.replace(item, withItem);
        withItem.setSelection(this.selection);
        item.setSelection(null);
        return this;
    },
    
    /**
     * Method: cleanup
     * Clean up a Jx.Tree instance
     */
    cleanup: function() {
        if (this.ownsSelection) {
            this.selection.destroy();
        }
        this.list.destroy();
        this.domObj.dispose();
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
     * APIMethod:
     * recursively empty this tree and any folders in it
     */
    empty: function() {
        this.list.items().each(function(item){
            if (item.retrieve('jxTreeFolder')) {
                item.retrieve('jxTreeFolder').empty();
            }
            if (item.retrieve('jxTreeItem')) {
                this.remove(item.retrieve('jxTreeItem'));
            }
        });
    },
    
    /**
     * Method: findChild
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
        var name = path.shift();
        var result = false;
        this.list.items().some(function(item) {
            var treeItem = item.retrieve('jxTreeItem');
            if (treeItem && treeItem.getLabel() == name) {
                if (path.length > 0) {
                    var folder = item.retrieve('jxTreeFolder');
                    if (folder) {
                        result = folder.findChild(path)
                    }
                } else {
                    result = treeItem;
                }
            }
            return result;
        });
        return result;
    },
    setSelection: function(selection) {
        if (this.selection && this.ownsSelection) {
            this.selection.removeEvents(this.bound);
            this.selection.destroy();
            this.ownsSelection = false;
        }
        this.selection = selection;
        this.list.setSelection(selection);
    }
});

