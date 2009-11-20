// $Id$
/**
 * Class: Jx.TreeItem
 *
 * Extends: <Jx.Widget>
 *
 * An item in a tree.  An item is a leaf node that has no children.
 *
 * Jx.TreeItem supports selection via the click event.  The application
 * is responsible for changing the style of the selected item in the tree
 * and for tracking selection if that is important.
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * click - triggered when the tree item is clicked
 *
 * Implements:
 * Events - MooTools Class.Extras
 * Options - MooTools Class.Extras
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.TreeItem = new Class ({
    Family: 'Jx.TreeItem',
    Extends: Jx.Widget,
    selection: null,
    /**
     * Property: domObj
     * {HTMLElement} a reference to the HTML element that is the TreeItem
     * in the DOM
     */
    domObj : null,
    /**
     * Property: owner
     * {Object} the folder or tree that this item belongs to
     */
    owner: null,
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
        lastLeafClass: 'jxTreeLeafLast',
        template: '<li class="jxTreeContainer jxTreeLeaf"><img class="jxTreeImage" src="'+Jx.aPixel.src+'" alt="" title=""><a class="jxTreeItem" href="javascript:void(0);"><img class="jxTreeIcon" src="'+Jx.aPixel.src+'" alt="" title=""><span class="jxTreeLabel"></span></a></li>'
    },
    classes: new Hash({
        domObj: 'jxTreeContainer',
        domA: 'jxTreeItem',
        domImg: 'jxTreeImage',
        domIcon: 'jxTreeIcon',
        domLabel: 'jxTreeLabel'
    }),

    /**
     * APIMethod: render
     * Create a new instance of Jx.TreeItem with the associated options
     */
    render : function() {
        this.parent();

        this.domObj = this.elements.get('jxTreeContainer');
        this.domObj.store('jxTreeItem', this);
        this.domA.store('jxTreeItem', this);

        /* the target for jxPressed, jxSelected, jxHover classes */
        this.domObj.store('jxListTarget', this.domA);

        if (!this.options.selectable) {
            this.domObj.addClass('jxUnselectable');
        }

        if (this.domObj) {
            if (this.options.id) {
                this.domObj.id = this.options.id;
            }
            this.domObj.store('jxTreeItem', this);
            if (!this.options.enabled) {
                this.domObj.addClass('jxDisabled');
            }
        }

        if (this.options.image && this.domIcon) {
            this.domIcon.setStyle('backgroundImage', 'url('+this.options.image+')');
            if (this.options.imageClass) {
                this.domIcon.addClass(this.options.imageClass);
            }

        }

        if (this.options.label && this.domLabel) {
            this.domLabel.set('html',this.options.label);
        }

        if (this.domA) {
            this.domA.addEvents({
                click: this.click.bind(this),
                dblclick: this.dblclick.bind(this),
                drag: function(e) { e.stop(); },
                contextmenu: function(e) { e.stop(); }
            });
            if (typeof Drag != 'undefined') {
                new Drag(this.domA, {
                    onStart: function() {this.stop();}
                });
            }
        }

        if ($defined(this.options.enabled)) {
            this.enable(this.options.enabled, true);
        }
    },
    /**
     * Method: finalize
     * Clean up the TreeItem and remove all DOM references
     */
    finalize: function() { this.finalizeItem(); },
    /**
     * Method: finalizeItem
     * Clean up the TreeItem and remove all DOM references
     */
    finalizeItem: function() {
        if (!this.domObj) {
            return;
        }
        this.options = null;
        this.domObj.dispose();
        this.domObj = null;
        this.owner = null;
    },
    /**
     * Method: update
     * Update the CSS of the TreeItem's DOM element in case it has changed
     * position
     *
     * Parameters:
     * isLast - {Boolean} is the item the last one or not?
     */
    update : function(isLast) {
        if (isLast) {
            this.domObj.addClass(this.options.lastLeafClass);
        } else {
            this.domObj.removeClass(this.options.lastLeafClass);
        }
    },
    click: function() {
        if (this.options.enabled) {
            this.fireEvent('click', this);
        }
    },
    dblclick: function() {
        if (this.options.enabled) {
            this.fireEvent('dblclick', this);
        }
    },
    /**
     * Method: select
     * Select a tree node.
     */
    select: function() {
        if (this.selection && this.options.enabled) {
            this.selection.select(document.id(this));
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
            this.domLabel.set('html',label);
        }
    },

    setImage: function(url, imageClass) {
        if (this.domIcon && $defined(url)) {
            this.options.image = url;
            this.domIcon.setStyle('backgroundImage', 'url('+this.options.image+')');
        }
        if (this.domIcon && $defined(imageClass)) {
            this.domIcon.removeClass(this.options.imageClass);
            this.options.imageClass = imageClass;
            this.domIcon.addClass(imageClass);
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
    setSelection: function(selection){
        this.selection = selection;
    }
});
