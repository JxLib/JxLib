/**
 * Class: Jx.Adaptor.Tree.Mptt
 * This class adapts a table adhering to the classic Parent-style "tree table".
 * 
 * This class requires an MPTT (Modified Preorder Tree Traversal) table. The MPTT
 * has a 'left' and a 'right' column that indicates the order of nesting. For 
 * more details see the sitepoint.com article at 
 * http://articles.sitepoint.com/article/hierarchical-data-database
 * 
 * if useAjax option is set to true then this adapter will send an Ajax request
 * to the server, through the store's strategy (should be Jx.Store.Strategy.Progressive)
 * to request additional nodes.
 *
 * Copyright 2010 by Jonathan Bomgardner
 * License: mit-style
 */
Jx.Adaptor.Tree.Mptt = new Class({
    

    Family: 'Jx.Adaptor.Tree.Mptt',
    Extends: Jx.Adaptor.Tree,
    
    name: 'tree.mptt',
    
    options: {
        left: 'left',
        right: 'right'
    },
        
    /**
     * APIMethod: hasChildren
     * 
     * Parameters: 
     * index - {integer} the array index of the row in the store (not the 
     *          primary key).
     */
    hasChildren: function (index) {
        var l = this.store.get(this.options.left, index).toInt();
        var r = this.store.get(this.options.right, index).toInt();
        return (l + 1 !== r);
    },
    
    /**
     * APIMethod: hasParent
     * 
     * Parameters: 
     * index - {integer} the array index of the row in the store (not the 
     *          primary key).
     */
    hasParent: function (index) {
        var i = this.getParentIndex(index);
        if ($defined(i)) {
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
        var l = this.store.get(this.options.left, index).toInt();
        var r = this.store.get(this.options.right, index).toInt();
        for (var i = index-1; i >= 0; i--) {
            var pl = this.store.get(this.options.left, i).toInt();
            var pr = this.store.get(this.options.right, i).toInt();
            if (pl < l && pr > r) {
                return i;
            }
        }
        return null;
    }
});