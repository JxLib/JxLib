/*
---

name: Jx.Plugin.Editor.Outdent

description: Button to outdent lists.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Outdent]

images:
 - text_indent_remove.png

...
 */
Jx.Plugin.Editor.Outdent = new Class({
    
    Family: 'Jx.Plugin.Editor.Outdent',
    
    Extends: Jx.Plugin.Editor.Button,
    
    name: 'outdent',
    
    options: {
        image: Jx.aPixel.src,
        imageClass: 'Outdent',
        toggle: false,
        title: 'Outdent'
    },
    
    
    action: 'outdent'
    
});