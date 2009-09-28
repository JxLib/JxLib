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
 * Extends: <Jx.TreeFolder>
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Tree = new Class({
    Family: 'Jx.Tree',
    Extends: Jx.TreeFolder,
    options: {
        template: '<ul class="jxTreeRoot"></ul>'
    },
    classes: ['jxTreeRoot'],
    /**
     * APIMethod: render
     * Create a new instance of Jx.Tree
     */
    render : function() {
        this.parent();
        this.subDomObj = this.elements.get('jxTreeRoot');
        
        this.nodes = [];
        this.isOpen = true;
        
        this.addable = this.subDomObj;
        
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
    },
    
    /**
     * Method: finalize
     * Clean up a Jx.Tree instance
     */
    finalize: function() { 
        this.clear(); 
        this.subDomObj.parentNode.removeChild(this.subDomObj); 
    },
    /**
     * Method: clear
     * Clear the tree of all child nodes
     */
    clear: function() {
        for (var i=this.nodes.length-1; i>=0; i--) {
            this.subDomObj.removeChild(this.nodes[i].domObj);
            this.nodes[i].finalize();
            this.nodes.pop();
        }
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
        if (this.subDomObj)
        {
            if (bLast) {
                this.subDomObj.removeClass('jxTreeNest');
            } else {
                this.subDomObj.addClass('jxTreeNest');
            }
        }
        if (this.nodes && shouldDescend) {
            this.nodes.each(function(n){n.update(false);});
        }
    },
    /**
     * Method: append
     * Append a node at the end of the sub-tree
     * 
     * Parameters:
     * node - {Object} the node to append.
     */
    append: function( node ) {
        node.owner = this;
        this.nodes.push(node);
        this.subDomObj.appendChild( node.domObj );
        this.update(true);
        return this;    
    }
});

