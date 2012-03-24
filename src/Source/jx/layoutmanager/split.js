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
define("jx/layoutmanager/split", ['../../base','../layoutmanager','../splitter','../layout'],
       function(base, LayoutManager, Splitter, Layout){
    
    var split = new Class({
        Extends: LayoutManager,
        Family: 'Jx.LayoutManager.Split',
    
        resizing: false,
    
        setContainer: function(domObj) {
            this.parent(domObj);
            
            //create the splitter
            this.splitter = new Splitter(this.domObj, this.options);
            this.splitter.addEvents({
                //'drag': this.resize.bind(this),
                'complete': this.resize.bind(this)
            });
        },
        
        add: function(obj, options) {
            if (this.items === undefined || this.items === null) {
                this.items = [];
            }
            
            this.items.push(base.getWidget(obj) || obj);
            
            obj = document.id(obj);
            obj.inject(this.splitter.elements[options.split]);
            new Layout(obj,options);
            
            
        },
    
        resize: function(options) {
            if (!this.resizing) {
                this.resizing = true;
                this.domObj.resize();        
                this.splitter.resize();
                this.items.each(function(item){
                    if (item.resize) {
                        item.resize();
                    } else if (base.getWidget(item).resize) {
                        base.getWidget(item).resize();
                    }
                },this);
                this.container.resize();
                this.resizing = false;
            }
            
        }
    });
    
    if (base.global) {
        base.global.LayoutManager.Split = split;
    }
    
    return split;
    
});