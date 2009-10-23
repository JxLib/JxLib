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
        this.elements = this.processTemplate(this.options.template, this.classes);
        this.domObj = this.elements.get('jxTreeRoot');
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
        });
        this.add = this.list.add;
        this.remove = this.list.remove;
        this.replace = this.list.replace;
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
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
    update: function(shouldDescend) {
        var bLast = true;
        if (this.domObj) {
            if (bLast) {
                this.domObj.removeClass('jxTreeNest');
            } else {
                this.domObj.addClass('jxTreeNest');
            }
        }
        if (this.nodes && shouldDescend) {
            this.nodes.each(function(n){n.update(false);});
        }
    },
    
    isLastNode: function(node) {
        return this.list.indexOf(node)+1 == this.list.count();
    }
});

