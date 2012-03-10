/*
---

name: Jx.Plugin.Editor.Undo

description: Button to undo commands in the editor.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Undo]

images:
 - edit-undo.png

...
 */
define("jx/plugin/editor/undo", function(require, exports, module){
    
    var base = require("../../../base"),
        Button = require("./button");
        
    var undo = module.exports = new Class({
    
        Extends: Button,
        Family: 'Jx.Plugin.Editor.Undo',
        
        name: 'undo',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'Undo',
            toggle: false,
            shortcut: 'z',
            title: 'Undo'
        },
        
        
        action: 'undo'
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Undo = module.exports;
    }
});