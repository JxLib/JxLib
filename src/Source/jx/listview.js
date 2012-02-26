/*
---

name: Jx.ListView

description: A widget that displays items in a list format.

license: MIT-style license.

requires:
 - Jx.Widget.List

provides: [Jx.ListView]

css:
 - list

images:
 - listitem.png
...
 */
// $Id$
/**
 * Class: Jx.ListView
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
define("jx/listview", function(require, exports, module){
    
    var base = require("../base"),
        WidgetList = require("./widget/list");
        
    var listView = module.exports = new Class({
        Extends: WidgetList,
        Family: 'Jx.ListView',
    
        pluginNamespace: 'ListView',
    
        options: {
            template: '<ul class="jxListView jxListContainer"></ul>',
        },
    
        classes: {
            domObj: 'jxListView',
            container: 'jxListContainer'
        }
    });
    
    if (base.global) {
        base.global.ListView = module.exports;
    }
});