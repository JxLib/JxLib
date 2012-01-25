/*
---

name: Jx.Plugin.Tree.Sorter

description: A plugin that will enable drag and drop sorting in a Jx.Tree

license: MIT-style license.

requires:
 - Jx.Tree
 - Jx.Plugin.Tree
 - More/Drag.Move
 - More/Sortable


provides: [Jx.Plugin.Tree.Sorter]

css:
 - tree.sorter

...
 */
/**
 * Class: Jx.Plugin.Tree.Sorter
 * Plugin to allow trees to be reorder using drag and drop.
 * 
 * Much of this code has been adapted from 
 * https://raw.github.com/cpojer/mootools-tree/master/Source/Tree.js
 * which is under an MIT-style license
 */
Jx.Plugin.Tree.Sorter = new Class({

    Extends: Jx.Plugin,
    Family: 'Jx.Plugin.Tree.Sorter',
    
    options: {
        indicatorOffset: 0,
        cloneOffset: {x: 16, y: 16},
		cloneOpacity: 0.8,
        precalculate: false
    },
    
    tree: null,
    active: false,
    
    init: function () {
        this.bound = {
            add: this.onFolderAdd.bind(this),
            startDrag: this.onStartDrag.bind(this),
            complete: this.onComplete.bind(this)
        };
    },

    attach: function (tree) {
        if (tree === undefined || tree === null || !(tree instanceof Jx.Tree)) {
            return;
        }
        
        this.tree = tree;
        
        this.tree.addEvents({
            add: this.bound.add
        });
        
        this.tree.sortable = new Sortables(this.tree.container,{
            handle: 'a.jxTreeItem',
            onStart: this.bound.startDrag,
            onComplete: this.bound.complete
        });  
        
        this.parent(tree);
    },
    
    detach: function () {
        this.parent();
    },
    
    onFolderAdd: function(item){
        if (item instanceof Jx.Tree.Folder) {
            //allow sorting of the folder's items
            item.sortable = new Sortables(item.container,{
                handle: 'a.jxTreeItem',
                onStart: this.onStartDrag.bind(this),
                onComplete: this.onComplete.bind(this)
            });  
        }
        //add the item to the sortable instance above it
        item.owner.sortable.addItems(document.id(item));
    },
    
    onComplete: function(element){
        console.log('onComplete fired by sortable');
        //only run this if we were actually sorting (start event fired)
        if (this.active) {
            //get the item just above us...
            var previous = $jx(element.getPrevious('li'));
            element = $jx(element);
            //fire an event
            this.tree.fireEvent('jxTreeSortDone', [element, previous]);
            //wait a split second then enable the tree events again
            var fn = function(){
                this.tree.setHoldEvents(false);
            }.delay(250,this);
        }
    },
    
    onStartDrag: function(element,clone) {
        console.log('onStart fired by sortable');
        //stop events on the tree
        this.tree.setHoldEvents(true);
        this.active = true;
        element.removeClass('jxHover');
    }
    
});