/*
---

name: Jx.Menu.Context

description: A Jx.Menu that has no button but can be opened at a specific browser location to implement context menus (for instance).

license: MIT-style license.

requires:
 - Jx.Menu

provides: [Jx.Menu.Context]

css:
 - menu

...
 */
// $Id$
/**
 * Class: Jx.Menu.Context
 *
 * Extends: Jx.Menu
 *
 * A <Jx.Menu> that has no button but can be opened at a specific
 * browser location to implement context menus (for instance).
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * TODO - add open/close events?
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
define('jx/menu/context', ['../../base','../menu'],
       function(base, Menu){
    
    var context = new Class({
        Extends: Menu,
        Family: 'Jx.Menu.Context',
    
        parameters: ['id','options'],
    
        /**
         * APIMethod: render
         * create a new context menu
         */
        render: function() {
            this.id = document.id(this.options.id);
            if (this.id) {
                this.id.addEvent('contextmenu', this.show.bind(this));
            }
            this.parent();
        },
        /**
         * Method: show
         * Show the context menu at the location of the mouse click
         *
         * Parameters:
         * e - {Event} the mouse event
         */
        show : function(e) {
            if (this.list.count() ==0) {
                return;
            }
            
            this.target = e.target;
    
            this.contentContainer.setStyle('visibility','hidden');
            this.contentContainer.setStyle('display','block');
            document.id(document.body).adopt(this.contentContainer);
            /* we have to size the container for IE to render the chrome correctly
             * but just in the menu/sub menu case - there is some horrible peekaboo
             * bug in IE related to ULs that we just couldn't figure out
             */
             this.contentContainer.setStyles({
               width: null,
               height: null
             });
            this.contentContainer.setContentBoxSize(this.subDomObj.getMarginBoxSize());
    
            this.position(this.contentContainer, document.body, {
                horizontal: [e.page.x + ' left'],
                vertical: [e.page.y + ' top', e.page.y + ' bottom'],
                offsets: this.chromeOffsets
            });
    
            this.contentContainer.setStyle('visibility','');
            this.showChrome(this.contentContainer);
    
            document.addEvent('mousedown', this.bound.hide);
            document.addEvent('keyup', this.bound.keypress);
    
            e.stop();
        }
    });
    
    if (base.global) {
        base.global.Menu.Context = context;
    }
    
    return context;

});