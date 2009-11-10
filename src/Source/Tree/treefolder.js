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
        /* folders will share a selection with the tree they are in */
        select: false, 
        template: '<li class="jxTreeContainer jxTreeBranch"><img class="jxTreeImage" src="'+Jx.aPixel.src+'" alt="" title=""><a class="jxTreeItem" href="javascript:void(0);"><img class="jxTreeIcon" src="'+Jx.aPixel.src+'" alt="" title=""><span class="jxTreeLabel"></span></a><ul class="jxTree"></ul></li>'
    },
    classes: new Hash({
        domObj: 'jxTreeContainer', 
        domA: 'jxTreeItem', 
        domImg: 'jxTreeImage', 
        domIcon: 'jxTreeIcon',
        domLabel: 'jxTreeLabel',
        domTree: 'jxTree'
    }),
    /**
     * APIMethod: render
     * Create a new instance of Jx.TreeFolder
     */
    render : function() {
        this.parent();
        this.domObj.store('jxTreeFolder', this);
        
        this.bound = {
            toggle: this.toggle.bind(this)
        };
        
        this.addEvents({
            click: this.bound.toggle,
            dblclick: this.bound.toggle
        });
        
        if (this.domImg) {
            this.domImg.addEvent('click', this.bound.toggle);
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
            }.bind(this)
        }, this.domTree);
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
        return this;
    },
    remove: function(item) {
        this.tree.remove(item);
        return this;
    },
    replace: function(item, withItem) {
        this.tree.replace(item, withItem);
        return this;
    },
    /**
     * APIMethod: items
     * return an array of tree item instances contained in this tree.
     * Does not descend into folders but does return a reference to the
     * folders
     */
    items: function() {
        return this.tree.items();
    },
    empty: function() {
        this.tree.empty();
    },
    /**
     * Method: update
     * Update the CSS of the TreeFolder's DOM element in case it has changed
     * position.
     *
     * Parameters:
     * shouldDescend - {Boolean} propagate changes to child nodes?
     * isLast - {Boolean} is this the last item in the list?
     */
    update: function(shouldDescend,isLast) {
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

        this.tree.update(shouldDescend, isLast);
    },
    toggle: function() {
        if (this.options.enabled) {
            if (this.options.open) {
                this.collapse();
            } else {
                this.expand();
            }
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
    },
    findChild : function(path) {
        //path is empty - we are asking for this node
        if (path.length == 0) {
            return this;
        } else {
            return this.tree.findChild(path);
        }
    },
    setSelection: function(selection) {
        this.tree.setSelection(selection);
    }
});