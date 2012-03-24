/*
---

name: Jx.Plugin.Editor.Underline

description: Button to underline text in editor.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Underline]

images:
 - text_underline.png

...
 */
define("jx/plugin/editor/underline", ['../../../base','./button'],
       function(base, Button){
    
    var underline = new Class({
    
        Extends: Button,
        Family: 'Jx.Plugin.Editor.Underline',
        
        name: 'underline',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'Underline',
            toggle: true,
            shortcut: 'u',
            title: 'Underline'
        },
        
        tags: ['u'],
        css: {'text-decoration': 'underline'},
        action: 'underline'
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Underline = underline;
    }
    
    return underline;
});