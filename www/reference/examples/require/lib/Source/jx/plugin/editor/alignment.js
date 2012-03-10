/*
---

name: Jx.Plugin.Editor.Alignment

description: Plugin for doing alignment in Jx.Editor

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.ButtonSet

provides: [Jx.Plugin.Editor.Alignment]

images:
 - text_align_left.png
 - text_align_center.png
 - text_align_right.png
 - text_align_justify.png

...
 */
define("jx/plugin/editor/alignment", function(require, exports, module){
    
    var base = require("../../../base"),
        ButtonSet = require("./buttonset");
        
    var alignment = module.exports = new Class({
     
        Extends: ButtonSet,
        Family: 'Jx.Plugin.Editor.Aligmment',
        
        name: 'alignment',
        
        options: {
            buttons: {
                justifyleft: {
                    image: Jx.aPixel.src,
                    imageClass: 'JustifyLeft',
                    title: 'Align Left',
                    css: {'text-align': 'left'}
                },
                justifyright: {
                    image: Jx.aPixel.src,
                    imageClass: 'JustifyRight',
                    title: 'Align Right',
                    css: {'text-align': 'right'}
                },
                justifycenter: {
                    image: Jx.aPixel.src,
                    imageClass: 'JustifyCenter',
                    title: 'Align Center',
                    css: {'text-align': 'center'},
                    tags: ['center']
                },
                justifyfull: {
                    image: Jx.aPixel.src,
                    imageClass: 'JustifyFull',
                    title: 'Align Full',
                    css: {'text-align': 'justify'}
                }
            }
        }
            
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Alignment = module.exports;
    }
});