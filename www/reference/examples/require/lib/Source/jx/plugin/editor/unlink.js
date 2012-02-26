/*
---

name: Jx.Plugin.Editor.Unlink

description: Button to unlink text.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Unlink]

images:
 - link_break.png

...
 */
define("jx/plugin/editor/unlink", function(require, exports, module){
    
    var base = require("../../../base"),
        Button = require("./button");
        
    var unlink = module.exports = new Class({
    
        Extends: Button,
        Family: 'Jx.Plugin.Editor.Unlink',
        
        name: 'unlink',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'Unlink',
            toggle: false,
            title: 'Remove Hyperlink'
        },
        
        action: 'unlink'
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Unlink = module.exports;
    }
});