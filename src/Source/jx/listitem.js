/*
---

name: Jx.ListItem

description: Represents a single item in a listview.

license: MIT-style license.

requires:
 - Jx.Widget

provides: [Jx.ListItem]

...
 */
// $Id$
/**
 * Class: Jx.ListItem
 *
 * Extends: <Jx.Widget>
 *
 * Events:
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group.
 *
 * This file is licensed under an MIT style license
 */
define("jx/listitem", function(require, exports, module){
    
    var base = require("../base"),
        Widget = require("./widget");
        
    var listItem = module.exports = new Class({
        Extends: Widget,
        Family: 'Jx.ListItem',
    
        options: {
            enabled: true,
            template: '<li class="jxListItemContainer jxListItem"></li>'
        },
    
        classes: {
            domObj: 'jxListItemContainer',
            domContent: 'jxListItem'
        },
    
        /**
         * APIMethod: render
         */
        render: function () {
            this.parent();
            this.domContent.store('jxListItem', this);
            this.domObj.store('jxListTarget', this.domContent);
            this.loadContent(this.domContent);
        },
    
        enable: function(state) {
    
        }
    });
    
    if (base.global) {
        base.global.ListItem = module.exports;
    }
});