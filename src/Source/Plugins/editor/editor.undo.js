/*
---

name: Jx.Plugin.Editor.Undo

description:

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Undo]

images:
 - edit-undo.png

...
 */
Jx.Plugin.Editor.Undo = new Class({
    
    Family: 'Jx.Plugin.Editor.Undo',
    
    Extends: Jx.Plugin.Editor.Button,
    
    name: 'undo',
    
    options: {
        image: Jx.aPixel.src,
        imageClass: 'Undo',
        toggle: false,
        shortcut: 'z',
        title: 'Undo'
    },
    
    
    action: 'undo'
    
});