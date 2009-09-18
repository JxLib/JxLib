// $Id$
/**
 * Class: Jx.Toolbar.Item
 * 
 * Extends: Object
 *
 * Implements: Options
 *
 * A helper class to provide a container for something to go into 
 * a <Jx.Toolbar>.
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Toolbar.Item = new Class( {
    Family: 'Jx.Toolbar.Item',
    Extends: Jx.Object,
    options: {
        /* Option: active
         * is this item active or not?  Default is true.
         */
        active: true
    },
    /**
     * Property: domObj
     * {HTMLElement} an element to contain the thing to be placed in the
     * toolbar.
     */
    domObj: null,
    
    parameters: ['jxThing'],
    
    /**
     * APIMethod: init
     * Create a new instance of Jx.Toolbar.Item.
     */
    init : function() {
        this.al = [];
        this.domObj = new Element('li', {'class':'jxToolItem'});
        if (this.options.jxThing) {
            if (this.options.jxThing.domObj) {
                this.domObj.appendChild(this.options.jxThing.domObj);
                if (this.options.jxThing instanceof Jx.Button.Tab) {
                    this.domObj.addClass('jxTabItem');
                }
            } else {
                this.domObj.appendChild(this.options.jxThing);
                if (this.options.jxThing.hasClass('jxTab')) {
                    this.domObj.addClass('jxTabItem');
                }
            }
        }
    }
});