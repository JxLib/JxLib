/*
---

name: Jx.Plugin.Editor.Unorderedlist

description: Button to create an unordered list.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Unorderedlist]

images:
 - text_list_bullets.png

...
 */
define("jx/plugin/editor/unorderedlist", function(require, exports, module){
    
    var base = require("../../../base"),
        Button = require("./button");
        
    var unorderedlist = module.exports = new Class({

        Extends: Button,
        Family: 'Jx.Plugin.Editor.Unoderedlist',
        
        name: 'unorderedlist',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'UnorderedList',
            toggle: false,
            title: 'Unordered List'
        },
        
        tags: ['ul'],
        action: 'insertunorderedlist'
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Unorderedlist = module.exports;
    }
});