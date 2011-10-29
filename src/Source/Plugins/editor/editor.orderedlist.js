/*
---

name: Jx.Plugin.Editor.Orderedlist

description: Button to create an ordered list.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Orderedlist]

images:
 - text_list_numbers.png

...
 */
Jx.Plugin.Editor.Orderedlist = new Class({
    
    Family: 'Jx.Plugin.Editor.Orderedlist',
    
    Extends: Jx.Plugin.Editor.Button,
    
    name: 'orderedlist',
    
    options: {
        image: Jx.aPixel.src,
        imageClass: 'OrderedList',
        toggle: false,
        title: 'Ordered List'
    },
    
    tags: ['ol'],
    action: 'insertorderedlist'
    
});