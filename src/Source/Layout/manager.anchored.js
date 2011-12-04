/*
---

name: Jx.LayoutManager.Anchored

description: Layout manager based on Jx.Layout

license: MIT-style license.

requires:
 - Jx.LayoutManager

provides: [Jx.LayoutManager.Anchored]

...
*/
// $Id$
/**
* Class: Jx.LayoutManager.Anchored
* 
*
* Extends:
* <Jx.Object>
*
* License:
* Copyright (c) 2011, Jonathan Bomgardner 
*
* This file is licensed under an MIT style license
*/
Jx.LayoutManager.Anchored = new Class({
    Extends: Jx.LayoutManager,
    Family: 'Jx.LayoutManager.Anchored',

    resizing: false,
    
    add: function(obj, options) {
        this.parent(obj);
        this.size(obj, options);
    },

    resize: function(options) {
        if (!this.resizing) {
            this.resizing = true;
            //grab each child and size it again
            Array.from(this.domObj.childNodes).each(function(child){
                if (child.getStyle('display') != 'none') {
                    this.size(child,options);
                }
            }, this);
            this.container.resize();
            this.resizing = false;
        }
    }
});