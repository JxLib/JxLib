/*
---

name: Jx.Menu.Separator

description: Convenience class to create a visual separator in a menu.

license: MIT-style license.

requires:
 - Jx.Menu

provides: [Jx.Menu.Separator]

images:
 - toolbar_separator_v.png

...
 */
// $Id$
/**
 * Class: Jx.Menu.Separator
 *
 * Extends: <Jx.Object>
 *
 * A convenience class to create a visual separator in a menu.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
define('jx/menu/separator', function(require, exports, module){

    var base = require("../../base"),
        Widget = require("../widget");
        
    var separator = module.exports = new Class({
        Extends: Widget,
        Family: 'Jx.Menu.Separator',
        /**
         * Property: domObj
         * {HTMLElement} the HTML element that the separator is contained
         * within
         */
        domObj: null,
        /**
         * Property: owner
         * {<Jx.Menu>, <Jx.Menu.SubMenu>} the menu that the separator is in.
         */
        owner: null,
        options: {
            template: "<li class='jxMenuItemContainer jxMenuItem'><span class='jxMenuSeparator'>&nbsp;</span></li>"
        },
        classes: {
            domObj: 'jxMenuItem'
        },
        /**
         * APIMethod: render
         * Create a new instance of a menu separator
         */
        render: function() {
            this.parent();
            this.domObj.store('jxMenuItem', this);
        },
        cleanup: function() {
          this.domObj.eliminate('jxMenuItem');
          this.owner = null;
          this.parent();
        },
        /**
         * Method: setOwner
         * Set the ownder of this menu item
         *
         * Parameters:
         * obj - {Object} the new owner
         */
        setOwner: function(obj) {
            this.owner = obj;
        },
        /**
         * Method: hide
         * Hide the menu item.
         */
        hide: function(){},
        /**
         * Method: show
         * Show the menu item
         */
        show: function(){}
    });
    
    if (base.global) {
        base.global.Menu.Separator = separator;
    }

});