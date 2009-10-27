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
    isOpen: true,
    list: null,
    domObj: null,
    options: {
        template: '<ul class="jxTreeRoot"></ul>'
    },
    classes: ['jxTreeRoot'],
    /**
     * APIMethod: render
     * Create a new instance of Jx.Tree
     */
    render: function() {
        this.parent();
        if ($defined(this.options.selection)) {
            this.selection = this.options.selection;
        } else {
            this.selection = new Jx.Selection();
        }
        if ($defined(this.options.container) && 
            document.id(this.options.container)) {
            this.domObj = this.options.container;
        } else {
            this.elements = this.processTemplate(this.options.template, this.classes);
            this.domObj = this.elements.get('jxTreeRoot');
        }
        this.list = new Jx.List(this.domObj, {
            onAdd: function(item) {
                this.update();
                this.fireEvent('add', item);
            }.bind(this),
            onRemove: function(item) {
                this.update();
                this.fireEvent('remove', item);
            }.bind(this),
            onSelect: function(item) {
                this.fireEvent('select',item);
            }.bind(this)
        }, this.selection);
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
    },
    
    add: function(item, position) {
        this.list.add(item, position);
    },
    remove: function(item) {
        this.list.remove(item);
    },
    replace: function(item, withItem) {
        this.list.replace(item, withItem);
    },
    
    /**
     * Method: cleanup
     * Clean up a Jx.Tree instance
     */
    cleanup: function() {
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
            if (treeItem && treeItem.options.label == name) {
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
    }
});

