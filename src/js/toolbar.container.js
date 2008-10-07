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
     * Property: domObj
     * {HTMLElement} the HTML element that the container lives in
     */
    domObj : null,
    options: {
        parent: null,
        position: 'top',
        autoSize: false,
        scroll: true
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
        
        var d = $(this.options.parent);
        this.domObj = d || new Element('div');
        this.domObj.addClass('jxBarContainer');
        
        if (this.options.scroll) {
            this.scroller = new Element('div', {'class':'jxBarScroller'});
            this.domObj.adopt(this.scroller);
        }

        /* this allows toolbars to add themselves to this bar container
         * once it already exists without requiring an explicit reference
         * to the toolbar container
         */
        this.domObj.store('jxBarContainer', this);
        
        if (['top','right','bottom','left'].contains(this.options.position)) {
            this.domObj.addClass('jxBar' +
                           this.options.position.capitalize());            
        } else {
            this.domObj.addClass('jxBarTop');
        }
        
        this.clearer = new Element('div', {'class':'jxClearer'});
        
        if (this.options.scroll) {
            // make sure we update our size when we get added to the DOM
            this.addEvent('addTo', this.update.bind(this));
            
            this.scroller.adopt(this.clearer);
        
            var scrollFx = new Fx.Tween(this.scroller);
            this.scrollLeft = new Jx.Button({
                image: Jx.aPixel.src
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
                image: Jx.aPixel.src
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
        } else {
            this.domObj.adopt(this.clearer);
        }

        
        if (this.options.toolbars) {
            this.add(this.options.toolbars);
        } 
    },
    
    update: function() {
        if (this.options.autoSize) {
            /* delay the size update a very small amount so it happens
             * after the current thread of execution finishes.  If the
             * current thread is part of a window load event handler,
             * rendering hasn't quite finished yet and the sizes are
             * all wrong
             */
            (function(){
                var x = 0;
                this.scroller.getChildren().each(function(child){
                    x+= child.getSize().x;
                });
                this.domObj.setStyles({width:x});
                this.measure();
            }).delay(1,this);
        } else {
            this.measure();
        }
    },
    
    measure: function() {
        /* decide if we need to show the scroller buttons and
         * do some calculations that will make it faster
         */
        this.scrollWidth = this.domObj.getSize().x;
        this.scroller.getChildren().each(function(child){
            this.scrollWidth -= child.getSize().x;
        }, this);
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
            if (this.options.scroll) {
                /* we potentially need to show or hide scroller buttons
                 * when the toolbar contents change
                 */
                thing.addEvent('add', this.update.bind(this));
                thing.addEvent('remove', this.update.bind(this));                
            }
            thing.domObj.inject(this.clearer, 'before');
        }, this);
        if (this.options.scroll) {
            this.update();            
        }
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
