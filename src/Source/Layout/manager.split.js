/*
---

name: Jx.LayoutManager.Split

description: Layout manager based on Jx.Splitter

license: MIT-style license.

requires:
 - Jx.LayoutManager

provides: [Jx.LayoutManager.Split]

...
*/
// $Id$
/**
* Class: Jx.LayoutManager.Split
* 
*
* Extends:
* <Jx.LayoutManager>
*
* License:
* Copyright (c) 2011, Jonathan Bomgardner 
*
* This file is licensed under an MIT style license
*/
Jx.LayoutManager.Split = new Class({
    Extends: Jx.LayoutManager,
    Family: 'Jx.LayoutManager.Split',

    resizing: false,

    setContainer: function(domObj) {
        this.parent(domObj);
        
        //create the splitter
        this.splitter = new Jx.Splitter(this.domObj, this.options);
        this.splitter.addEvents({
            'drag': this.resize.bind(this),
            'complete': this.resize.bind(this)
        });
    },
    
    add: function(obj, options) {
        if (this.items === undefined || this.items === null) {
            this.items = [];
        }
        
        this.items.push($jx(obj) || obj);
        
        obj = document.id(obj);
        obj.inject(this.splitter.elements[options.split]);
        new Jx.Layout(obj,options);
        
        
    },

    resize: function(options) {
        if (!this.resizing) {
            this.resizing = true;
            this.domObj.resize();        
            this.splitter.resize();
            this.items.each(function(item){
                if (item.resize) {
                    item.resize();
                } else if ($jx(item).resize) {
                    $jx(item).resize();
                }
            },this);
            this.container.resize();
            this.resizing = false;
        }
        
    }
});