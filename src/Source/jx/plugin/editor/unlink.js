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
define("jx/plugin/editor/unlink", ['../../../base','./button'],
       function(base, Button){
    
    var unlink = new Class({
    
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
        base.global.Plugin.Editor.Unlink = unlink;
    }
    
    return unlink;
});