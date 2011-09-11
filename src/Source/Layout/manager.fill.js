/*
---

name: Jx.LayoutManager.Fill

description: Layout manager to make 1 widget fill the given container.

license: MIT-style license.

requires:
 - Jx.LayoutManager

provides: [Jx.LayoutManager.Fill]

...
*/
// $Id$
/**
* Class: Jx.LayoutManager.Fill
* This subclass of Jx.LayoutManager makes a single widget or DOM object fill
* the container.
*
* Extends:
* <Jx.LayoutManager>
*
* License:
* Copyright (c) 2011, Jonathan Bomgardner 
*
* This file is licensed under an MIT style license
*/
Jx.LayoutManager.Fill = new Class({
    Extends: Jx.LayoutManager,
    Family: 'Jx.LayoutManager.Fill',
    
    item: null,
    
    add: function(obj){
        //only allow a single item in this manager because it
        //will fill the domObj it is in.
        if (this.item === null) {
            this.parent(obj);
            this.size(obj);
            this.item = obj;
        }
    },
    
    resize: function(options){
        this.size(this.item);
    }
});