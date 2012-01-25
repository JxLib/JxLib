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
Jx.Plugin.Editor.Underline = new Class({
    
    Family: 'Jx.Plugin.Editor.Underline',
    
    Extends: Jx.Plugin.Editor.Button,
    
    name: 'underline',
    
    options: {
        image: Jx.aPixel.src,
        imageClass: 'Underline',
        toggle: true,
        shortcut: 'u',
        title: 'Underline'
    },
    
    tags: ['u'],
    css: {'text-decoration': 'underline'},
    action: 'underline'
    
});