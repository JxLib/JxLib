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
Jx.Plugin.Editor.Redo = new Class({
    
    Family: 'Jx.Plugin.Editor.Redo',
    
    Extends: Jx.Plugin.Editor.Button,
    
    name: 'redo',
    
    options: {
        image: Jx.aPixel.src,
        imageClass: 'Redo',
        toggle: false,
        shortcut: 'y',
        title: 'Redo'
    },
    
    
    action: 'redo'
    
});