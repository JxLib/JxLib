/*
---

name: Jx.Adaptor.Tree.Mptt

description: Fills a Jx.Tree instance from a remote table that represents an MPTT (Modified Preorder Table Traversal) data source.

license: MIT-style license.

requires:
 - Jx.Adaptor.Tree

provides: [Jx.Adaptor.Tree.Mptt]

...
 */
/**
 * Class: Jx.Adaptor.Tree.Mptt
 * This class adapts a table adhering to the MPTT-style "tree table".
 *
 * This class requires an MPTT (Modified Preorder Tree Traversal) table. The MPTT
 * has a 'left' and a 'right' column that indicates the order of nesting. For
 * more details see the sitepoint.com article at
 * http://articles.sitepoint.com/article/hierarchical-data-database
 *
 * Copyright 2010 by Jonathan Bomgardner
 * License: mit-style
 */

define("jx/adaptor/tree/mptt", ['../../../base','../tree'],
       function(base, treeAdaptor){
    
    var mptt = new Class({
    
        Extends: treeAdaptor,
        Family: 'Jx.Adaptor.Tree.Mptt',
    
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
            var l = this.store.get(this.options.left, index).toInt(),
                r = this.store.get(this.options.right, index).toInt();
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
            var i = this.getParentIndex(index),
                result = false;
            if (i !== undefined && i !== null) {
                result = true;
            }
            return result;
        },
    
        /**
         * APIMethod: getParentIndex
         *
         * Parameters:
         * index - {integer} the array index of the row in the store (not the
         *          primary key).
         */
        getParentIndex: function (index) {
            var store = this.store,
                options = this.options,
                l,
                r,
                i,
                pl,
                pr;
            l = store.get(options.left, index).toInt();
            r = store.get(options.right, index).toInt();
            for (i = index-1; i >= 0; i--) {
                pl = store.get(options.left, i).toInt();
                pr = store.get(options.right, i).toInt();
                if (pl < l && pr > r) {
                    return i;
                }
            }
            return null;
        }
    });
    
    if (base.global) {
        base.global.Adaptor.Tree.Mptt = mptt;
    }
    
    return mptt;
    
});