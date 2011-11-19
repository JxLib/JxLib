/*
---

name: Jx.Plugin.Editor.Unorderedlist

description: Button to create an unordered list.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Unorderedlist]

images:
 - text_list_bullets.png

...
 */
Jx.Plugin.Editor.Unorderedlist = new Class({
    
    Family: 'Jx.Plugin.Editor.Unoderedlist',
    
    Extends: Jx.Plugin.Editor.Button,
    
    name: 'unorderedlist',
    
    options: {
        image: Jx.aPixel.src,
        imageClass: 'UnorderedList',
        toggle: false,
        title: 'Unordered List'
    },
    
    tags: ['ul'],
    action: 'insertunorderedlist'
    
});