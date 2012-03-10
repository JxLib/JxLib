/*
---

name: Jx.Plugin.Editor.Strikethrough

description: Strikethrough button for editor

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Strikethrough]

images:
 - text_strikethrough.png

...
 */
define("jx/plugin/editor/strikethrough", function(require, exports, module){
    
    var base = require("../../../base"),
        Button = require("./button");
        
    var strikethrough = module.exports = new Class({
    
        Extends: Button,
        Family: 'Jx.Plugin.Editor.Strikethrough',
        
        name: 'strikethrough',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'Strikethrough',
            toggle: true,
            title: 'Strike Through',
            shortcut: 's'
        },
        
        tags: ['s','strike'],
        css: { 'text-decoration': 'line-through' },
        action: 'strikethrough'
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Strikethrough = module.exports;
    }
});