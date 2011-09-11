/*
---

name: Jx.Container

description: Provides a container that a layout manager can be applied to to manage other widgets

license: MIT-style license.

requires:
 - Jx.Widget
 - Jx.Layout
 - Jx.LayoutManager.Fill

provides: [Jx.Container]

...
*/
// $Id$
/**
* Class: Jx.Container
*
* Provides a container that a layout manager can be applied to to manage 
* other widgets. The container can be responsible for widget creation using
* the class property option or you can pass in pre-instantiated widgets.
* The rest of the options will be used as options for the widget as needed. 
* The property option layoutOpts of each item is used as options for the layout 
* of the item and is used by the layout manager assigned to this container. The
* default manager is Jx.LayoutManager.Fill which takes a single DOM object and 
* makes it fill the container. All containers will fill the object they are 
* inside of or they can be managed by a layout manager themselves.
* 
* One of the interesting things with this setup is that we can nest containers
* within other containers which will allow for us to create a complete interface
* based solely from the object(s) passed in the items array. (See example page)
* 
*
* Example:
* (code)
* 	new Jx.Container({
*		manager: new Jx.LayoutManager.Anchored(),
*       parent: 'body',
*       resizeWithWindow: true,
*       items: [
*			{
*				class: Jx.Panel,
*				label: 'example1',
*				layoutOpts: {
*					top: 30
*				}
*			},
* 			{
*				class: Jx.Tree,
*				layoutOpts: {
*					left: 400
*				}
*			}
*		]
*	})
* (end)
*
* Extends:
* <Jx.Widget>
*
* Author: Ing. Axel Mendoza Pupo.
*
* License:
* Copyright (c) 2011, Ing. Axel Mendoza Pupo.
* Additional changes (c) 2011 by Jonathan Bomgardner 
*
* This file is licensed under an MIT style license
*/

Jx.Container = new Class({
    Extends: Jx.Widget,
    Family: 'Jx.Container',
    
    options: {
        /* Option: layoutManager
         * A string, Jx.LayoutManager instance, or null. Will be used to determine
         * which layout manager to use in this container. If null, then 
         * Jx.LayoutManager.Fill will be used and only one object can be added.
         */
        layoutManager: null,
        /* Option: items
         * An array of objects or Jx.Widget instances to be added to this 
         * container. If an object is passed then it needs to be in the form:
         * (code)
         * {
         *   class: Jx.Widget,    //the name of the class to create. Do NOT use quotes around it.
         *   id: 'some-id',       //a string id of an existing DOM object to use (mutually exclusive with class)
         *   options: {}          //an object with the options needed to construct the class. If id is used then the only thing we look for is layoutOpts.
         *   layoutOpts: {}       //an object with the appropriate layout options as required by the chosen manager.
         * }
         * (end)
         */
        items: null,
        /* Option: resizeWithWindow
         * boolean, automatically resize this container when the window size
         * changes, even if the element is not a direct descendant of the
         * BODY.  False by default.
         */
        resizeWithWindow: false,
        /* Option: parent
         * Indicates the parent DOM object that this container is to be added to.
         * If null, then we don't add it to anything assuming it already has been.
         * If set to 'body' then we will add this as a child of the BODY tag. 
         * Defaults to null.
         */
        parent: null,
        /* Option: topLevel
         * Indicates to the container that this is a top level container (not
         * contained within another container) and thus shoudl fill all of the
         * space it is given by the DOM object that it is inside of. Defaults to
         * false.
         */
        topLevel: false
    },

    layoutManager: null,

    items: null,

    bound: null,

    init: function(){
        this.bound = {
            resize: this.resize.bind(this)
        };
        this.items = [];
        this.parent();
    },

    render: function () {
        this.parent();

        if (this.options.layoutManager === null || 
            this.options.layoutManager === undefined) {
            this.layoutManager = new Jx.LayoutManager.Fill();
        } else if (typeOf(this.options.layoutManager) == 'string') {
            this.layoutManager = new Jx.LayoutManager[this.options.layoutManager.capitalize()]();
        } else {
            this.layoutManger = this.options.layoutManager;
        }
        this.layoutManager.setContainer(this);
        
        //if we have a parent inject it, otherwise assume we're already in 
        //a container of some kind.
        if (this.options.parent !== null && this.options.parent !== undefined) {
            if (this.options.parent.toLowerCase() == 'body') {
                this.domObj.inject(document.body);
            } else {
                this.domObj.inject(document.id(this.options.parent));
            }
        }
        //The container fills the DOM object that it's contained in.
        if (this.options.topLevel) {
            new Jx.Layout(this.domObj).resize();
        }

        
        this.add(this.options.items);
        
        if (this.options.resizeWithWindow || document.body == this.domObj.parentNode) {
            window.addEvent('resize', this.bound.resize);
            window.addEvent('load', this.bound.resize);
        }
    },
    
    add: function(items){
        Array.from(items).each(function(item) {
            if ((item['class'] !== null && item['class'] !== undefined) ||
                (item.id !== null && item.id !== undefined)) {
                var itemObj,
                layoutOpts = (item.layoutOpts)?item.layoutOpts:{};
                //create a DOM element that will contain the item
                var domObj = new Element('div', {
                    'class': 'jxContainerContent'
                });
                this.layoutManager.add(domObj,layoutOpts);
                
                item.options = (item.options)?item.options:{};
                
                if (item['class'] !== null && item['class'] !== undefined) {
                    item.options.parent = domObj;
                    itemObj = new item['class'](item.options);
                } else if (item.id !== null && item.id !== undefined) {
                    itemObj = document.id(item.id);
                    document.id(itemObj).inject(domObj);
                } 
                
                this.items.push(itemObj);
            }
        }, this);
    },

    resize: function(){
        this.layoutManager.resize();
        //loop through items and if it's a container, or it has a resize() method,
        //call it's resize method
        this.items.each(function(widget){
            if (widget instanceof Jx.Container || widget.resize) {
                widget.resize();
            }
        },this);
    }
});