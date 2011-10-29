/*
---

name: Jx.Tree.Folder

description: A Jx.Tree.Folder is an item in a tree that can contain other items. It is expandable and collapsible.

license: MIT-style license.

requires:
 - Jx.Widget.List
 - Jx.Tree

provides: [Jx.Tree.Folder]

...
 */
// $Id$
/**
 * Class: Jx.Tree.Folder
 *
 * A Jx.TreeFolder is an item in a tree that can contain other items.  It is
 * expandable and collapsible.
 *
 * Example:
 * (code)
 * (end)
 *
 * Extends:
 * <Jx.Widget.list>
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Tree.Folder = new Class({
    
    Extends: Jx.Widget.List,
    Family: 'Jx.Tree.Folder',
    
    options: {
        /* Option: label
         * {String} the label to display for the TreeItem
         */
        label: '',
        /* Option: contextMenu
         * {<Jx.ContextMenu>} the context menu to trigger if there
         * is a right click on the node
         */
        contextMenu: null,
        /* Option: enabled
         * {Boolean} the initial state of the TreeItem.  If the
         * TreeItem is not enabled, it cannot be clicked.
         */
        enabled: true,
        selectable: true,
        /* Option: image
         * {String} URL to an image to use as the icon next to the
         * label of this TreeItem
         */
        image: null,
        /* Option: imageClass
         * {String} CSS class to apply to the image, useful for using CSS
         * sprites
         */
        imageClass: '',
        /* Option: open
         * is the folder open?  false by default.
         */
        open: false,
        /* folders will share a selection with the tree they are in */
        select: false,
        
        trackEvents: false,
        
        template: '<li class="jxTreeContainer jxTreeBranch"><img class="jxTreeImage" src="'+Jx.aPixel.src+'" alt="" title=""><a class="jxTreeItem" href="javascript:void(0);"><img class="jxTreeIcon" src="'+Jx.aPixel.src+'" alt="" title=""><span class="jxTreeLabel"></span></a><ul class="jxTree jxListContainer"></ul></li>'
    },
    classes: {
        domObj: 'jxTreeContainer',
        domA: 'jxTreeItem',
        domImg: 'jxTreeImage',
        domIcon: 'jxTreeIcon',
        domLabel: 'jxTreeLabel',
        domTree: 'jxTree',
        container: 'jxListContainer'
    },
    
    dirty: false,
    
    /**
     * APIMethod: render
     * Create a new instance of Jx.Tree.Folder
     */
    render : function() {
        this.parent();
        this.domObj.store('jxTreeFolder', this);
        
        if (!this.options.selectable) {
            this.domObj.addClass('jxUnselectable');
        }

        if (this.options.id) {
            this.domObj.id = this.options.id;
        }
        if (!this.options.enabled) {
            this.domObj.addClass('jxDisabled');
        }

        if (this.options.image && this.domIcon) {
            this.domIcon.setStyle('backgroundImage', 'url('+this.options.image+')');
            if (this.options.imageClass) {
                this.domIcon.addClass(this.options.imageClass);
            }

        }

        if (this.options.label && this.domLabel) {
            this.setLabel(this.options.label);
        }

        if (this.domA) {
            this.domA.addEvents({
                //click: this.click.bind(this),
                //dblclick: this.dblclick.bind(this),
                drag: function(e) { e.stop(); }
            });
            //TODO: should we keep this in? Can it be overridden by a plugin?
            if (typeof Drag != 'undefined') {
                new Drag(this.domA, {
                    onStart: function() {this.stop();}
                });
            }
        }

        if (this.options.enabled !== undefined && this.options.enabled !== null) {
            this.enable(this.options.enabled, true);
        }
        
        if (this.options.open) {
            this.expand();
        } else {
            this.collapse();
        }

    },
    
    cleanup: function() {
      this.domObj.eliminate('jxTreeFolder');
      this.domObj.eliminate('jxTreeItem');
      this.domA.eliminate('jxTreeItem');
      this.domA.eliminate('jxContextMenu');
      this.domObj.eliminate('jxListTarget');
      this.domObj.eliminate('jxListTargetItem');
      this.parent();
    },
    
    /**
     * APIMethod: add
     * add one or more items to the tree at a particular position in the tree
     *
     * Parameters:
     * item - {<Jx.TreeItem>} or an array of items to be added
     * position - {mixed} optional location to add the items.  By default,
     * this is 'bottom' meaning the items are added at the end of the list.
     * See <Jx.Widget.List::add> for options
     *
     * Returns:
     * {<Jx.Tree>} a reference to this object for chaining calls
     */
    add: function(item, position) {
        if (Jx.type(item) == 'array') {
            item.each(function(what){ this.add(what, position); }.bind(this) );
            return;
        }
        if (item instanceof Jx.Tree.Folder) {
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
        if (this.owner) {
            this.owner.update(true);
        }
        return this;
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
     * {<Jx.Tree.Folder>} a reference to this for chaining
     */
    update: function(shouldDescend,isLast) {
        /* avoid update if not attached to tree yet */
        if (!this.domObj.parentNode) return;
        
        if (isLast !== undefined && isLast !== null) {
            if (isLast) {
                this.container.removeClass('jxTreeNest');
            } else {
                this.container.addClass('jxTreeNest');
            }
        }
        
        if (this.dirty || (this.owner && this.owner.dirty)) {
            if (isLast === undefined || isLast === null) {
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
            
            if (shouldDescend) {
                var last = this.count() - 1;
                this.items().each(function(item, idx){
                    var lastItem = idx == last,
                        jx = $jx(item);
                    if (jx instanceof Jx.Tree.Folder) {
                        jx.update(shouldDescend, lastItem);
                    } else if (jx instanceof Jx.Tree.Item) {
                        jx.update(lastItem);
                    }
                });
            }
        }

        
    },
   
    /**
     * APIMethod: expand
     * Expands the folder
     *
     * Returns:
     * {<Jx.Tree.Folder>} a reference to this for chaining
     */
    expand : function() {
        this.options.open = true;
        this.container.setStyle('display', 'block');
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
     * {<Jx.Tree.Folder>} a reference to this for chaining
     */
    collapse : function() {
        this.options.open = false;
        this.container.setStyle('display', 'none');
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
        if (path.length === 0) {
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
     * {<Jx.Tree.Folder>} a reference to this for chaining
     */
    setSelection: function(selection) {
        this.parent(selection);
        return this;
    },
    
    isEnabled: function(){
        return this.options.enabled;
    },
    
    isOpen: function(){
        return this.options.open;
    },
    
    setDirty: function(state) {
      this.dirty = state;
      if (this.owner && this.owner.setDirty) {
          this.owner.setDirty(state);
      }
    },
    
    /**
     * Method: getLabel
     * Get the label associated with a TreeItem
     *
     * Returns:
     * {String} the name
     */
    getLabel: function() {
        return this.options.label;
    },

    /**
     * Method: setLabel
     * set the label of a tree item
     */
    setLabel: function(label) {
        this.options.label = label;
        if (this.domLabel) {
            this.domLabel.set('html',this.getText(label));
            this.setDirty(true);
        }
    },

    setImage: function(url, imageClass) {
        if (this.domIcon && url !== undefined && url !== null ) {
            this.options.image = url;
            this.domIcon.setStyle('backgroundImage', 'url('+this.options.image+')');
            this.setDirty(true);
        }
        if (this.domIcon && imageClass !== undefined && imageClass !== null) {
            this.domIcon.removeClass(this.options.imageClass);
            this.options.imageClass = imageClass;
            this.domIcon.addClass(imageClass);
            this.setDirty(true);
        }
    },
    enable: function(state, force) {
        if (this.options.enabled != state || force) {
            this.options.enabled = state;
            if (this.options.enabled) {
                this.domObj.removeClass('jxDisabled');
                this.fireEvent('enabled', this);
            } else {
                this.domObj.addClass('jxDisabled');
                this.fireEvent('disabled', this);
                if (this.selection) {
                    this.selection.unselect(document.id(this));
                }
            }
        }
    },

    /**
     * Method: propertyChanged
     * A property of an object has changed, synchronize the state of the
     * TreeItem with the state of the object
     *
     * Parameters:
     * obj - {Object} the object whose state has changed
     */
    propertyChanged : function(obj) {
        this.options.enabled = obj.isEnabled();
        if (this.options.enabled) {
            this.domObj.removeClass('jxDisabled');
        } else {
            this.domObj.addClass('jxDisabled');
        }
    },
    
    /**
     * APIMethod: setBusy
     * set the busy state of the widget
     *
     * Parameters:
     * busy - {Boolean} true to set the widget as busy, false to set it as
     *    idle.
     */
    setBusy: function(state) {
      if (this.busy == state) {
        return;
      }
      this.busy = state;
      this.fireEvent('busy', this.busy);
      if (this.busy) {
        this.domImg.addClass(this.options.busyClass);
      } else {
        if (this.options.busyClass) {
          this.domImg.removeClass(this.options.busyClass);
        }
      }
    },
    
    changeText : function(lang) {
      this.parent();
      this.setLabel(this.options.label);
    }
    
});