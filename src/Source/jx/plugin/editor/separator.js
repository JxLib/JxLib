/*
---

name: Jx.Plugin.Editor.Separator

description: Separator for toolbar in editor 

license: MIT-style license.

requires:
 - Jx.Toolbar.Separator
 - Jx.Plugin.Editor

provides: [Jx.Plugin.Editor.Separator]

...
 */
define("jx/plugin/editor/separator", function(require, exports, module){
    
    var base = require("../../../base"),
        Plugin = require("../../plugin"),
        Separator = require("../../toolbar/separator");
        
    var separator = module.exports = new Class({
    
        Extends: Plugin,
        Family: 'Jx.Plugin.Editor.Separator',
        
        name: 'separator',
        
        attach: function (editor) {
            this.button = new Separator();
            editor.toolbar.add(this.button);
        }
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Separator = module.exports;
    }
});