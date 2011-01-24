/*
---

name: Jx.TreeFolder

description: A Jx.TreeFolder is an item in a tree that can contain other items. It is expandable and collapsible.

license: MIT-style license.

requires:
 - Jx.TreeItem
 - Jx.Tree

provides: [Jx.TreeFolder]

...
 */
// $Id$
/**
 * Class: Jx.TreeFolder
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

        this.bound.toggle = this.toggle.bind(this);

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

    },
    cleanup: function() {
      this.domObj.eliminate('jxTreeFolder');
      this.removeEvents({
        click: this.bound.toggle,
        dblclick: this.bound.toggle
      });
      if (this.domImg) {
        this.domImg.removeEvent('click', this.bound.toggle);
      }
      this.bound.toggle = null;
      this.tree.destroy();
      this.tree = null;
      this.parent();
    },
    /**
     * APIMethod: add
     * add one or more items to the folder at a particular position in the
     * folder
     *
     * Parameters:
     * item - {<Jx.TreeItem>} or an array of items to be added
     * position - {mixed} optional location to add the items.  By default,
     * this is 'bottom' meaning the items are added at the end of the list.
     * See <Jx.List::add> for options
     *
     * Returns:
     * {<Jx.TreeFolder>} a reference to this object for chaining calls
     */
    add: function(item, position) {
        this.tree.add(item, position);
        return this;
    },
    /**
     * APIMethod: remove
     * remove an item from the folder
     *
     * Parameters:
     * item - {<Jx.TreeItem>} the folder item to remove
     *
     * Returns:
     * {<Jx.Tree>} a reference to this object for chaining calls
     */
    remove: function(item) {
        this.tree.remove(item);
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
    /**
     * APIMethod: empty
     * recursively empty this folder and any folders in it
     */
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
     *
     * Returns:
     * {<Jx.TreeFolder>} a reference to this for chaining
     */
    update: function(shouldDescend,isLast) {
        /* avoid update if not attached to tree yet */
        if (!this.domObj.parentNode) return;
        
        if (this.tree.dirty || (this.owner && this.owner.dirty)) {
          if (!$defined(isLast)) {
              isLast = this.domObj.hasClass('jxTreeBranchLastOpen') ||
                       this.domObj.hasClass('jxTreeBranchLastClosed');
          }

          ['jxTreeBranchOpen','jxTreeBranchLastOpen','jxTreeBranchClosed',
          'jxTreeBranchLastClosed'].each(function(c){
              this.removeClass(c);
          }, this.domObj);

          var c = 'jxTreeBranch';
          c += isLast ? 'Last' : '';
          c += this.options.open ? 'Open' : 'Closed';
          this.domObj.addClass(c);
        }

        this.tree.update(shouldDescend, isLast);
    },
    /**
     * APIMethod: toggle
     * toggle the state of the folder between open and closed
     *
     * Returns:
     * {<Jx.TreeFolder>} a reference to this for chaining
     */
    toggle: function() {
        if (this.options.enabled) {
            if (this.options.open) {
                this.collapse();
            } else {
                this.expand();
            }
        }
        return this;
    },
    /**
     * APIMethod: expand
     * Expands the folder
     *
     * Returns:
     * {<Jx.TreeFolder>} a reference to this for chaining
     */
    expand : function() {
        this.options.open = true;
        document.id(this.tree).setStyle('display', 'block');
        this.setDirty(true);
        this.update(true);
        this.fireEvent('disclosed', this);
        return this;
    },
    /**
     * APIMethod: collapse
     * Collapses the folder
     *
     * Returns:
     * {<Jx.TreeFolder>} a reference to this for chaining
     */
    collapse : function() {
        this.options.open = false;
        document.id(this.tree).setStyle('display', 'none');
        this.setDirty(true);
        this.update(true);
        this.fireEvent('disclosed', this);
        return this;
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
            return this;
        } else {
            return this.tree.findChild(path);
        }
    },
    /**
     * Method: setSelection
     * sets the <Jx.Selection> object to be used by this folder.  Used
     * to propogate a single selection object throughout a tree.
     *
     * Parameters:
     * selection - {<Jx.Selection>} the new selection object to use
     *
     * Returns:
     * {<Jx.TreeFolder>} a reference to this for chaining
     */
    setSelection: function(selection) {
        this.tree.setSelection(selection);
        return this;
    },
    
    setDirty: function(state) {
      this.parent(state);
      if (this.tree) {
        this.tree.setDirty(true);
      }
    },
    
});