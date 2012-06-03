/*
---

name: Jx.Plugin.Editor.Redo

description: Button to redo changes.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Redo]

images:
 - edit-redo.png

...
 */
define("jx/plugin/editor/redo", ['../../../base','./button'],
       function(base, Button){
     
    var redo = new Class({
    
        Extends: Button,
        Family: 'Jx.Plugin.Editor.Redo',
        
        name: 'redo',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'Redo',
            toggle: false,
            shortcut: 'y',
            title: 'Redo'
        },
        
        
        action: 'redo'
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Redo = redo;
    }
    
    return redo;
});