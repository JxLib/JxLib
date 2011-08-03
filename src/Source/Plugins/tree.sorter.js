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
            mousedown: this.mousedown.bind(this),
            mouseup: this.mouseup.bind(this),
            onLeave: this.onLeave.bind(this),
            onEnter: this.onEnter.bind(this),
            onDrop: this.onDrop.bind(this),
            add: this.onFolderAdd.bind(this)
        };
    },

    attach: function (tree) {
        if (tree === undefined || tree === null || !(tree instanceof Jx.Tree)) {
            return;
        }
        
        this.tree = tree;
        this.element = document.id(this.tree);
        
        this.tree.addEvents({
            //mousedown: this.bound.mousedown,
            //mouseup: this.bound.mouseup
            add: this.bound.add
        });
        
        this.tree.sortable = new Sortables(this.tree.container,{
            handle: 'a.jxTreeItem',
            onStart: this.onStartDrag.bind(this),
            onComplete: this.onComplete.bind(this)
        });  
        
        //document.addEvent('mouseup', this.bound.mouseup);
        this.parent(tree);
    },
    
    detach: function () {
        this.tree.removeEvent('mousedown', this.bound.mousedown);
        document.removeEvent('mouseup', this.bound.mouseup);
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
    
    mousedown: function(item, tree, event) {
        //wait .5 second to make sure this wasn't a click event.
        this.timer = function(item, tree, event) {
            //tell the tree to hold firing all events
            //this.tree.setHoldEvents(true);
    
    		this.current = item;
            /*
    		this.clone = document.id(item).clone().setStyles({
    			left: event.page.x + this.options.cloneOffset.x,
    			top: event.page.y + this.options.cloneOffset.y,
    			opacity: this.options.cloneOpacity
    		}).addClass('jxTreeDrag').inject(this.tree);
                        
    		document.id(item).makeDraggable({
    			droppables: this.element.getElements('li a'),
                container: document.id(this.tree),
                precalculate: this.options.precalculate,
    			onLeave: this.bound.onLeave,
    			onEnter: this.bound.onEnter,
    			onDrop: this.bound.onDrop
    		}).start(event);
            */
            
            //try just using mootools-more's sortable
            
        }.delay(500, this, [item,tree,event]);
    },
    
    onComplete: function(element){
        console.log('onComplete fired by sortable');
    },
    
    onStartDrag: function(element,clone) {
        console.log('onStart fired by sortable');
    },
    
    mouseup: function() {
        if (!this.activer) {
            clearTimeout(this.timer);
        }
        if (this.clone) this.clone.destroy();
    },
    
    onEnter: function(el, droppable){
        document.id($jx(droppable)).addClass('jxTreeDropActive');
        
        //wait a second and then open the branch if collapsed
        
	},

	onDrop: function(el, droppable, event){
		//get the jx.widget objects for el and droppable
        var moved = this.current,
            previous = $jx(droppable);
        //kill the clone
        this.clone.destroy();
        //move the original from it's current location to this one
        moved.owner.remove(moved);
        previous.owner.add(moved,previous);
        //fire the event [the element we moved, the new previous element (droppable), and the tree instance
		this.fireEvent('jxTreeSortDrop', [moved, previous, this.tree]);
	},
    
    onLeave: function(el, droppable) {
        document.id($jx(droppable)).removeClass('jxTreeDropActive');
    }
    
});