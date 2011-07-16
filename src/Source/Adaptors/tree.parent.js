/*
---

name: Jx.Adaptor.Tree.Parent

description: Fills a Jx.Tree instance from a standard parent/child/folder style data table.

license: MIT-style license.

requires:
 - Jx.Adaptor.Tree

provides: [Jx.Adaptor.Tree.Parent]


...
 */
/**
 * Class: Jx.Adapter.Tree.Parent
 * This class adapts a table adhering to the classic Parent-style "tree table".
 * 
 * Basically, the store needs to have a column that will indicate the
 * parent of each row. The root(s) of the tree should be indicated by a "-1" 
 * in this column. The name of the "parent" column is configurable in the 
 * options.
 * 
 * if the monitorFolders option is set to true then this adapter will send
 * an Ajax request to the server, through the store's strategy (should be
 * Jx.Store.Strategy.Progressive) to request additional nodes. Also, a column
 * indicating whether this is a folder needs to be set as there is no way to
 * tell if a node has children without it.
 *
 * Copyright 2010 by Jonathan Bomgardner
 * License: mit-style
 */
Jx.Adaptor.Tree.Parent = new Class({
    

    Extends: Jx.Adaptor.Tree,
    Family: 'Jx.Adaptor.Tree.Parent',
    
    options: {
        parentColumn: 'parent',
        folderColumn: 'folder' 
    },
        
    /**
     * APIMethod: hasChildren
     * 
     * Parameters: 
     * index - {integer} the array index of the row in the store (not the 
     *          primary key).
     */
    hasChildren: function (index) {
        return this.store.get(this.options.folderColumn, index);
    },
    
    /**
     * APIMethod: hasParent
     * 
     * Parameters: 
     * index - {integer} the array index of the row in the store (not the 
     *          primary key).
     */
    hasParent: function (index) {
        if (this.store.get(this.options.parentColumn, index).toInt() !== -1) {
            return true;
        } 
        return false;
    },
    
    /**
     * APIMethod: getParentIndex
     * 
     * Parameters: 
     * index - {integer} the array index of the row in the store (not the 
     *          primary key).
     */
    getParentIndex: function (index) {
        //get the parent based on the index
        var pk = this.store.get(this.options.parentColumn, index);
        return this.store.findByColumn('primaryKey', pk);
    }
});