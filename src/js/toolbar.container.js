// $Id: $
/**
 * Class: Jx.Toolbar.Container
 * A toolbar container contains toolbars.  A single toolbar container fills the
 * available space horizontally.  Toolbars placed in a toolbar container do not
 * wrap when they exceed the available space.
 *
 * Events:
 * add - fired when one or more toolbars are added to a container
 * remove - fired when one or more toolbars are removed from a container
 *
 * Implements: 
 * Options
 * Events
 * {<Jx.Addable>}
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Toolbar.Container = new Class({
    Implements: [Options,Events, Jx.Addable],
    /**
     * Property: items
     * {Array} an array of the toolbars in the container.
     */
    toolbars : null,
    /**
     * Property: domObj
     * {HTMLElement} the HTML element that the container lives in
     */
    domObj : null,
    options: {
        parent: null,
        position: 'top'
    },
    /**
     * Constructor: Jx.Toolbar.Container
     * Create a new instance of Jx.Toolbar.Container
     *
     * Parameters:
     * options - an options object as documented below
     *
     * Options:
     * id - {String} the ID to give the main DIV element created by the 
     *     container
     * parent - {HTMLElement} object reference or id to place the toolbar in.
     */
    initialize : function(options) {
        this.setOptions(options);
        this.addEvent('addTo', this.update.bind(this));
        this.toolbars = [];
        
        var d = $(this.options.parent);
        this.domObj = d || new Element('div');
        this.domObj.addClass('jxBarContainer');
        
        this.scroller = new Element('div', {'class':'jxBarScroller'});
        this.domObj.adopt(this.scroller);

        this.domObj.store('jxBarContainer', this);
        
        if (['top','right','bottom','left'].contains(this.options.position)) {
            this.domObj.addClass('jxBar' +
                           this.options.position.capitalize());            
        } else {
            this.domObj.addClass('jxBarTop');
        }
        this.clearer = new Element('div', {'class':'jxClearer'});
        this.scroller.adopt(this.clearer);
        
        var scrollFx = new Fx.Tween(this.scroller);
        this.scrollLeft = new Jx.Button({
            label:'&lt;'
        }).addTo(this.domObj);

        this.scrollLeft.domObj.addClass('jxBarScrollLeft');
        this.scrollLeft.addEvents({
           click: (function(){
               var from = this.scroller.getStyle('left').toInt();
               var to = Math.min(from+100, 0);
               if (to >= 0) {
                   this.scrollLeft.domObj.setStyle('display', 'none');
               }
               this.scrollRight.domObj.setStyle('display', 'block');
               scrollFx.start('left', from, to);
           }).bind(this)
        });
        
        this.scrollRight = new Jx.Button({
            label:'&gt;'
        }).addTo(this.domObj);
        this.scrollRight.domObj.addClass('jxBarScrollRight');
        this.scrollRight.addEvents({
           click: (function(){
               var from = this.scroller.getStyle('left').toInt();
               var to = Math.max(from - 100, this.scrollWidth);
               if (to == this.scrollWidth) {
                   this.scrollRight.domObj.setStyle('display', 'none');
               }
               this.scrollLeft.domObj.setStyle('display', 'block');
               scrollFx.start('left', from, to);
           }).bind(this)
        });
        
        if (this.options.toolbars) {
            this.add(this.options.toolbars);
        } 
    },
    
    update: function() {
        this.scrollWidth = this.domObj.getSize().x;
        this.scroller.getChildren().each(function(child){
            this.scrollWidth -= child.getSize().x;
        }, this);
        console.log('scroll width: ' + this.scrollWidth);
        if (this.scrollWidth < 0) {
            var l = this.scroller.getStyle('left').toInt();
            if (l < 0) {
                this.scrollLeft.domObj.setStyle('display','block');
            } else {
                this.scrollLeft.domObj.setStyle('display','none');
            }
            if (l == this.scrollWidth) {
                this.scrollRight.domObj.setStyle('display', 'none');
            } else {
                this.scrollRight.domObj.setStyle('display', 'block');                
            }
        } else {
            this.scrollLeft.domObj.setStyle('display','none');
            this.scrollRight.domObj.setStyle('display','none');
        }
    },
    
    /**
     * Method: add
     * Add a toolbar to the container.
     *
     * Parameters:
     * toolbar - {Object} the toolbar to add.  More than one toolbar
     *    can be added by passing multiple arguments.
     */
    add: function( ) {
        $A(arguments).flatten().each(function(thing) {
            thing.addEvent('add', this.update.bind(this));
            thing.addEvent('remove', this.update.bind(this));
            thing.domObj.inject(this.clearer, 'before');
            this.toolbars.push(thing);
        }, this);
        this.update();
        if (arguments.length > 0) {
            this.fireEvent('add', this);
        }
        return this;
    },
    /**
     * Method: remove
     * remove an item from a toolbar.  If the item is not in this toolbar
     * nothing happens
     *
     * Parameters:
     * item - {Object} the object to remove
     *
     * Returns:
     * {Object} the item that was removed, or null if the item was not
     * removed.
     */
    remove: function(item) {
        
    }
});
