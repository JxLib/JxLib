/*
---

name: Jx.Plugin.Editor.Outdent

description: Button to outdent lists.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Outdent]

images:
 - text_indent_remove.png

...
 */
define("jx/plugin/editor/outdent", function(require, exports, module){
    
    var base = require("../../../base"),
        Button = require("./button");

    var outdent = module.exports = new Class({
    
        Extends: Button,
        Family: 'Jx.Plugin.Editor.Outdent',
        
        name: 'outdent',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'Outdent',
            toggle: false,
            title: 'Outdent'
        },
        
        
        action: 'outdent'
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Outdent = module.exports;
    }
    
});