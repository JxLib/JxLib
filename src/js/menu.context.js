// $Id: menu.context.js 933 2008-09-16 15:29:20Z pspencer $
/**
 * Class: Jx.Menu.Context
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
 * Extends:
 * <Jx.Menu>
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Menu.Context = new Class({
    Extends: Jx.Menu,
    /**
     * Constructor: Jx.ContextMenu
     * create a new context menu
     *
     * Parameters:
     * id - {HTMLElement} element or id to make this the context menu
     * for.  The menu hooks the oncontextmenu event of the element
     * and shows itself at the mouse position where the right-click
     * happened.
     */
    initialize : function(id) {
        this.parent();
        if ($(id)) {
            $(id).addEvent('contextmenu', this.show.bindWithEvent(this));
        }
    },
    /**
     * Method: show
     * Show the context menu at the location of the mouse click
     *
     * Parameters:
     * e - {Event} the mouse event
     */
    show : function(e) {
        if (this.items.length ==0) {
            return;
        }
        
        this.contentContainer.setStyle('visibility','hidden');
        $(document.body).adopt(this.contentContainer);            
        /* we have to size the container for IE to render the chrome correctly
         * but just in the menu/sub menu case - there is some horrible peekaboo
         * bug in IE related to ULs that we just couldn't figure out
         */
        this.contentContainer.setContentBoxSize(this.subDomObj.getMarginBoxSize());
        
        this.position(this.contentContainer, document.body, {
            horizontal: [e.page.x + ' left'],
            vertical: [e.page.y + ' top', e.page.y + ' bottom'],
            offsets: this.chromeOffsets
        });

        this.contentContainer.setStyle('visibility','');
        this.showChrome(this.contentContainer);
                
        document.addEvent('mousedown', this.hideWatcher);
        document.addEvent('keyup', this.keypressWatcher);

        e.stop();
    }    
});