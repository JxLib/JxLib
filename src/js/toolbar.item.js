// $Id: toolbar.item.js 711 2008-08-13 20:38:33Z pspencer $
/**
 * Class: Jx.Toolbar.Item
 * A helper class to provide a container for something to go into 
 * a <Jx.Toolbar>.
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Toolbar.Item = new Class( {
    /**
     * Property: domObj
     * {HTMLElement} an element to contain the thing to be placed in the
     * toolbar.
     */
    domObj: null,
    /**
     * Constructor: Jx.Toolbar.Item
     * Create a new instance of Jx.Toolbar.Item.
     *
     * Parameters:
     * jxThing - {Object} the thing to be contained.
     */
    initialize : function( jxThing ) {
        this.al = [];
        this.domObj = new Element('li', {'class':'jxToolItem'});
        if (jxThing) {
            if (jxThing.domObj) {
                this.domObj.appendChild(jxThing.domObj);
                if (jxThing instanceof Jx.Tab) {
                    this.domObj.addClass('jxTabItem');
                }
            } else {
                this.domObj.appendChild(jxThing);
                if (jxThing.hasClass('jxTab')) {
                    this.domObj.addClass('jxTabItem');
                }
            }
        }
    }
});