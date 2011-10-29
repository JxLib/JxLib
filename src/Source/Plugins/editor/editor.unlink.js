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
Jx.Plugin.Editor.Unlink = new Class({
    
    Family: 'Jx.Plugin.Editor.Unlink',
    
    Extends: Jx.Plugin.Editor.Button,
    
    name: 'unlink',
    
    options: {
        image: Jx.aPixel.src,
        imageClass: 'Unlink',
        toggle: false,
        title: 'Remove Hyperlink'
    },
    
    action: 'unlink'
    
});