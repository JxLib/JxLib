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
define("jx/plugin/editor/orderedlist", ['../../../base','./button'],
       function(base, Button){
    
    var orderedlist = new Class({
    
        Extends: Button,
        Family: 'Jx.Plugin.Editor.Orderedlist',
        
        name: 'orderedlist',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'OrderedList',
            toggle: false,
            title: 'Ordered List'
        },
        
        tags: ['ol'],
        action: 'insertorderedlist'
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Orderedlist = orderedlist;
    }
    
    return orderedlist;
});