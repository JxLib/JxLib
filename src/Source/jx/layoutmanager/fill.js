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
define("jx/layoutmanager/fill", function(require, exports, module){
    
    var base = require("../../base"),
        LayoutManager = require("../layoutmanager");
        
    var Fill = module.exports = new Class({
        Extends: LayoutManager,
        Family: 'Jx.LayoutManager.Fill',
        
        item: null,
        resizing: false,
        
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
            if (!this.resizing) {
                this.resizing = true;
                this.size(this.item);
                this.container.resize();
                this.resizing = false;
            }
        }
    });
    
    if (base.global) {
        base.global.LayoutManager.Fill = module.exports;
    }
    
});