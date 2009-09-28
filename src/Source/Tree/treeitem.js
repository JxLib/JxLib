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
        /* Option: data
         * {Object} any arbitrary data to be associated with the TreeItem
         */
        data: null,
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
        template: '<li class="jxTreeContainer jxTreeLeaf"><img class="jxTreeImage" src="'+Jx.aPixel.src+'" alt="" title=""><a class="jxTreeItem" href="javascript:void(0);"><img class="jxTreeIcon" src="'+Jx.aPixel.src+'" alt="" title=""><span class="jxTreeLabel"></span></a></li>'
    },
    classes: ['jxTreeContainer', 'jxTreeImage', 'jxTreeIcon','jxTreeLabel'],
    
    /**
     * APIMethod: render
     * Create a new instance of Jx.TreeItem with the associated options
     */
    render : function() {
        this.parent();
        this.elements = this.processTemplate(this.options.template, this.classes);

        this.domObj = this.elements.get('jxTreeContainer');
        var domA = this.elements.get('jxTreeItem');
        var domImg = this.elements.get('jxTreeIcon');
        var domLabel = this.elements.get('jxTreeLabel');

        if (this.domObj) {
            if (this.options.id) {
                this.domObj.id = this.options.id;
            }
            this.domObj.store('jxTreeItem', this);
            if (!this.options.enabled) {
                this.domObj.addClass('jxDisabled');
            }
        }

        if (this.options.image && domImg) {
            domImg.setStyle('backgroundImage', 'url('+this.options.image+')');
            if (this.options.imageClass) {
                domImg.addClass(this.options.imageClass);
            }
            
        }

        if (this.options.label && domLabel) {
            domLabel.set('html',this.options.label);
        }

        if (domA) {
            var hasFocus;
            var mouseDown;
            domA.addEvents({
                click: this.selected.bind(this),
                dblclick: this.selected.bind(this),
                drag: function(e) { e.stop(); },
                contextmenu: function(e) { e.stop(); },
                mousedown: (function(e) {
                   domA.addClass('jxTreeItemPressed');
                   hasFocus = true;
                   mouseDown = true;
                   domA.focus();
                   if (e.rightClick && this.options.contextMenu) {
                       this.options.contextMenu.show(e);
                   }
                }).bind(this),
                mouseup: function(e) {
                    domA.removeClass('jxTreeItemPressed');
                    mouseDown = false;
                },
                mouseleave: function(e) {
                    domA.removeClass('jxTreeItemPressed');
                },
                mouseenter: function(e) {
                    if (hasFocus && mouseDown) {
                        domA.addClass('jxTreeItemPressed');
                    }
                },
                keydown: function(e) {
                    if (e.key == 'enter') {
                        domA.addClass('jxTreeItemPressed');
                    }
                },
                keyup: function(e) {
                    if (e.key == 'enter') {
                        domA.removeClass('jxTreeItemPressed');
                    }
                },
                blur: function() { hasFocus = false; }
            });
            domA.appendChild(domImg);
            if (typeof Drag != 'undefined') {
                new Drag(domA, {
                    onStart: function() {this.stop();}
                });
            }
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
     * Method: clone
     * Create a clone of the TreeItem
     *
     * Returns:
     * {<Jx.TreeItem>} a copy of the TreeItem
     */
    clone : function() {
        return new Jx.TreeItem(this.options);
    },
    /**
     * Method: update
     * Update the CSS of the TreeItem's DOM element in case it has changed
     * position
     *
     * Parameters:
     * shouldDescend - {Boolean} propagate changes to child nodes?
     */
    update : function(shouldDescend) {
        var isLast = (arguments.length > 1) ? arguments[1] :
                     (this.owner && this.owner.isLastNode(this));
        if (isLast) {
            this.domObj.addClass('jxTreeLeafLast');
        } else {
            this.domObj.removeClass('jxTreeLeafLast');
        }
    },
    /**
     * Method: selected
     * Called when the DOM element for the TreeItem is clicked, the
     * node is selected.
     *
     * Parameters:
     * e - {Event} the DOM event
     */
    selected : function(e) {
        this.fireEvent('click', this);
    },
    /**
     * Method: getName
     * Get the label associated with a TreeItem
     *
     * Returns:
     * {String} the name
     */
    getName : function() { return this.options.label; },
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
    }
});
