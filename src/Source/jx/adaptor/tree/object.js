/*
---

name: Jx.Adaptor.Tree.Object

description: Fills a Jx.Tree instance from an object based on the children property

license: MIT-style license.

requires:
 - Jx.Adaptor.Tree
 - Jx.Tree.Folder
 - Jx.Tree.Item

provides: [Jx.Adaptor.Tree.Object]


...
 */
/**
 * Class: Jx.Adapter.Tree.Object
 * This class adapts a table adhering to the classic Parent-style "tree table".
 *
 * This adaptor does not use a store. Instead, it depends on a basic object
 * where each entry has a "children" property that contains it's children.
 * The object would look like:
 *
 * (code)
 * [{
 *  label: <label>,
 *  icon: <image>,
 *  children: [{},{},{}]
 *  },...]
 * (end)
 *
 * In order to get the data, simply pass in a configured Jx.Store.Protocol subclass
 * that it can use to acces the data.
 * 
 * Copyright 2010 by Jonathan Bomgardner
 * License: mit-style
 */

define("jx/adaptor/tree/object", ['../../../base','../../tree/folder','../../tree/item','../../plugin'],
       function(base, Folder, Item, Plugin){
    
    var treeObject = new Class({
    
        Extends: Plugin,
        Family: 'Jx.Adaptor.Tree.Object',
        
        options: {
            /**
             * Option: protocol
             * A <Jx.Store.Protocol> subclass to use in accessing the data
             * for this adaptor
             */
            protocol: null,
            /**
             * Option: folderOptions
             * A Hash containing the options for <Jx.TreeFolder>. Defaults to null.
             */
            folderOptions: {
                open: false    
            },
            /**
             * Option: itemOptions
             * A Hash containing the options for <Jx.TreeItem>. Defaults to null.
             */
            itemOptions: {
                active : false
            },
            /*
             * Option: labelProperty
             *	configure the property of the label in the objects of the data. 
             * Defaults to 'label' for be backward compatible.
                */
            labelProperty: 'label'
        },
        
        init: function(){
            this.parent();
            
            this.bound.fill = this.fill.bind(this);
            
        },
        
        fill: function(resp){
            this.options.protocol.removeEvent('dataLoaded', this.bound.fill);
            if (resp.success()) {
                this.tree.empty();
                var items = resp.data;
                for (var j = 0; j < items.length; j++) {
                    this.makeItems(items[j], this.tree);
                }
            } 
        },
        
        makeItems: function(node, tree){
            if(node.children != undefined){
                var folder = new Folder(Object.merge({},this.options.folderOptions,{
                    label: node[this.options.labelProperty],
                    image: node.icon,
                    attributes: node.attributes
                }));
    
                tree.add(folder);
                
                for (var j = 0; j < node.children.length; j++) {
                    this.makeItems(node.children[j], folder);
                }
                            
            }else {
                var item = new Item(Object.merge({},this.options.itemOptions,{
                    label: node[this.options.labelProperty],
                    image: node.icon,
                    attributes: node.attributes
                }));
    
                tree.add(item);
            }
        },
        
        load: function(params){
            this.options.protocol.addEvent('dataLoaded', this.bound.fill);
            var opts = {};
            if (params !== undefined && params !== null) {
                opts.data = params;
            } else {
                opts.data = {};
            }
            opts.data.page = 0;
            opts.data.itemsPerPage = -1;
            this.options.protocol.read(opts);
        },
        
        attach: function(tree){
            this.tree = tree;
            this.parent(tree);
        },
        
        detach: function(){
            this.tree = null;
            this.parent();
        }
        
    });
    
    if (base.global) {
        base.global.Adaptor.Tree.Object = treeObject;
    }
    
    return treeObject;
    
});