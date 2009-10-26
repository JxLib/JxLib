// $Id$
/**
 * Class: Jx.TreeFolder
 * 
 * Extends: <Jx.TreeItem>
 *
 * A Jx.TreeFolder is an item in a tree that can contain other items.  It is
 * expandable and collapsible.
 *
 * Example:
 * (code)
 * (end)
 *
 * Extends:
 * <Jx.TreeItem>
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.TreeFolder = new Class({
    Family: 'Jx.TreeFolder',
    Extends: Jx.TreeItem,
    /**
     * Property: tree
     * {<Jx.Tree>} a Jx.Tree instance for managing the folder contents
     */
    tree : null,

    options: {
        /* Option: open
         * is the folder open?  false by default.
         */
        open: false,
        template: '<li class="jxTreeContainer jxTreeBranch"><img class="jxTreeImage" src="'+Jx.aPixel.src+'" alt="" title=""><a class="jxTreeItem" href="javascript:void(0);"><img class="jxTreeIcon" src="'+Jx.aPixel.src+'" alt="" title=""><span class="jxTreeLabel"></span></a><ul class="jxTree"></ul></li>'
    },
    classes: ['jxTreeContainer','jxTreeImage','jxTreeItem','jxTreeIcon','jxTreeLabel','jxTree'],
    /**
     * APIMethod: render
     * Create a new instance of Jx.TreeFolder
     */
    render : function() {
        this.parent();
        this.domObj.store('jxTreeFolder', this);
        
        var node = this.elements.get('jxTreeImage');
        if (node) {
            document.id(node).addEvent('click', this.clicked.bindWithEvent(this));
            this.addEvent('click', this.clicked.bindWithEvent(this));
        }
                
        this.tree = new Jx.Tree({
            template: this.options.template,
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
        }, this.elements.get('jxTree'));
        if (this.options.open) {
            this.expand();
        } else {
            this.collapse();
        }
        
        this.addEvent('postDestroy',function() {
            this.tree.destroy();
        }.bind(this));
    },
    
    add: function(item, position) {
        this.tree.add(item, position);
    },
    remove: function(item) {
        this.tree.remove(item);
    },
    replace: function(item, withItem) {
        this.tree.replace(item, withItem);
    },

    /**
     * Method: clone
     * Create a clone of the TreeFolder
     * 
     * Returns: 
     * {<Jx.TreeFolder>} a copy of the TreeFolder
     */
    clone : function() { },
    /**
     * Method: update
     * Update the CSS of the TreeFolder's DOM element in case it has changed
     * position.
     *
     * Parameters:
     * shouldDescend - {Boolean} propagate changes to child nodes?
     * isLast - {Boolean} is this the last item in the list?
     */
    update : function(shouldDescend,isLast) {
        /* avoid update if not attached to tree yet */
        if (!this.domObj.parentNode) return;
        
        if (!$defined(isLast)) {
            isLast = this.domObj.hasClass('jxTreeBranchLastOpen') ||
                     this.domObj.hasClass('jxTreeBranchLastClosed');
        }

        ['jxTreeBranchOpen','jxTreeBranchLastOpen','jxTreeBranchClosed',
        'jxTreeBranchLastClosed'].each(function(c){
            this.removeClass(c);
        }.bind(this.domObj));
        var c = 'jxTreeBranch';
        c += isLast ? 'Last' : '';
        c += this.options.open ? 'Open' : 'Closed';
        this.domObj.addClass(c);

        if (shouldDescend) {
            this.tree.update(shouldDescend, isLast);
        }
    },
    /**
     * Method: clicked
     * handle the user clicking on this folder by expanding or
     * collapsing it.
     *
     * Parameters: 
     * e - {Event} the event object
     */
    clicked : function(e) {
        if (this.options.open) {
            this.collapse();
        } else {
            this.expand();
        }
    },
    /**
     * Method: expand
     * Expands the folder
     */
    expand : function() {
        this.options.open = true;
        document.id(this.tree).setStyle('display', 'block');
        this.update(true);
        this.fireEvent('disclosed', this);    
    },
    /**
     * Method: collapse
     * Collapses the folder
     */
    collapse : function() {
        this.options.open = false;
        document.id(this.tree).setStyle('display', 'none');
        this.update(true);
        this.fireEvent('disclosed', this);
    }
});