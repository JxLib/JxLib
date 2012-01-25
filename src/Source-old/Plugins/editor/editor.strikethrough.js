/*
---

name: Jx.Plugin.Editor.Strikethrough

description: Strikethrough button for editor

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Strikethrough]

images:
 - text_strikethrough.png

...
 */
Jx.Plugin.Editor.Strikethrough = new Class({
    
    Family: 'Jx.Plugin.Editor.Strikethrough',
    
    Extends: Jx.Plugin.Editor.Button,
    
    name: 'strikethrough',
    
    options: {
        image: Jx.aPixel.src,
        imageClass: 'Strikethrough',
        toggle: true,
        title: 'Strike Through',
        shortcut: 's'
    },
    
    tags: ['s','strike'],
    css: { 'text-decoration': 'line-through' },
    action: 'strikethrough'
    
});