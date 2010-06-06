/*
---

name: Jx.Store.Strategy.Sort

description: Strategy used for sorting results in a store after they are loaded.

license: MIT-style license.

requires:
 - Jx.Store.Strategy
 - Jx.Sort.Mergesort
 - Jx.Compare

provides: [Jx.Store.Strategy.Sort]
...
 */
// $Id$
/**
 * Class: Jx.Store.Strategy.Sort
 * 
 * Extends: <Jx.Store.Strategy>
 * 
 * Strategy used for sorting stores. It can either be called manually or it
 * can listen for specific events from the store.
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Store.Strategy.Sort = new Class({
    
    Extends: Jx.Store.Strategy,
    
    name: 'sort',
    
    options: {
        /**
         * Option: sortOnStoreEvents
         * an array of events this strategy should listen for on the store and
         * sort when it sees them.
         */
        sortOnStoreEvents: ['storeColumnChanged','storeDataLoaded'],
        /**
         * Option: defaultSort
         * The default sorting type, currently set to merge but can be any of
         * the sorters available
         */
        defaultSort : 'merge',
        /**
         * Option: separator
         * The separator to pass to the comparator
         * constructor (<Jx.Compare>) - defaults to '.'
         */
        separator : '.',
        /**
         * Option: sortCols
         * An array of columns to sort by arranged in the order you want 
         * them sorted.
         */
        sortCols : []
    },
    
    /**
     * Property: sorters
     * an object listing the different sorters available
     */
    sorters : {
        quick : "Quicksort",
        merge : "Mergesort",
        heap : "Heapsort",
        'native' : "Nativesort"
    },
    
    /**
     * Method: init
     * initialize this strategy
     */
    init: function () {
        this.parent();
        this.bound.sort = this.sort.bind(this);
    },
    
    /**
     * APIMethod: activate
     * activates the strategy if it isn't already active.
     */
    activate: function () {
        if ($defined(this.options.sortOnStoreEvents)) {
            this.options.sortOnStoreEvents.each(function (ev) {
                this.store.addEvent(ev, this.bound.sort);
            },this);
        }
    },
    
    /**
     * APIMethod: deactivate
     * deactivates the strategy if it is already active.
     */
    deactivate: function () {
        if ($defined(this.options.sortOnStoreEvents)) {
            this.options.sortOnStoreEvents.each(function (ev) {
                this.store.removeEvent(ev, this.bound.sort);
            },this);
        }
    },
    
    /**
     * APIMethod: sort 
     * Runs the sorting and grouping
     * 
     * Parameters: 
     * cols - Optional. An array of columns to sort/group by 
     * sort - the sort type (quick,heap,merge,native),defaults to
     *     options.defaultSort
     * dir - the direction to sort. Set to "desc" for descending,
     * anything else implies ascending (even null). 
     */
    sort : function (cols, sort, dir) {
        if (this.store.count()) {
            this.store.fireEvent('sortStart', this);
            var c;
            if ($defined(cols) && Jx.type(cols) === 'array') {
                c = this.options.sortCols = cols;
            } else if ($defined(cols) && Jx.type(cols) === 'string') {
                this.options.sortCols = [];
                this.options.sortCols.push(cols);
                c = this.options.sortCols;
            } else if ($defined(this.options.sortCols)) {
                c = this.options.sortCols;
            } else {
                return null;
            }
            
            this.sortType = sort;
            // first sort on the first array item
            this.store.data = this.doSort(c[0], sort, this.store.data, true);
        
            if (c.length > 1) {
                this.store.data = this.subSort(this.store.data, 0, 1);
            }
        
            if ($defined(dir) && dir === 'desc') {
                this.store.data.reverse();
            }
        
            this.store.fireEvent('storeSortFinished', this);
        }
    },
    
    /**
     * Method: subSort 
     * Does the actual group sorting.
     * 
     * Parameters: 
     * data - what to sort 
     * groupByCol - the column that determines the groups 
     * sortCol - the column to sort by
     * 
     * returns: the result of the grouping/sorting
     */
    subSort : function (data, groupByCol, sortByCol) {
        
        if (sortByCol >= this.options.sortCols.length) {
            return data;
        }
        /**
         *  loop through the data array and create another array with just the
         *  items for each group. Sort that sub-array and then concat it 
         *  to the result.
         */
        var result = [];
        var sub = [];
        
        var groupCol = this.options.sortCols[groupByCol];
        var sortCol = this.options.sortCols[sortByCol];
    
        var group = data[0].get(groupCol);
        this.sorter.setColumn(sortCol);
        for (var i = 0; i < data.length; i++) {
            if (group === (data[i]).get(groupCol)) {
                sub.push(data[i]);
            } else {
                // sort
    
                if (sub.length > 1) {
                    result = result.concat(this.subSort(this.doSort(sortCol, this.sortType, sub, true), groupByCol + 1, sortByCol + 1));
                } else {
                    result = result.concat(sub);
                }
            
                // change group
                group = (data[i]).get(groupCol);
                // clear sub
                sub.empty();
                // add to sub
                sub.push(data[i]);
            }
        }
        
        if (sub.length > 1) {
            this.sorter.setData(sub);
            result = result.concat(this.subSort(this.doSort(sortCol, this.sortType, sub, true), groupByCol + 1, sortByCol + 1));
        } else {
            result = result.concat(sub);
        }
        
        //this.data = result;
        
        return result;
    },
    
    /**
     * Method: doSort 
     * Called to change the sorting of the data
     * 
     * Parameters: 
     * col - the column to sort by 
     * sort - the kind of sort to use (see list above) 
     * data - the data to sort (leave blank or pass null to sort data
     * existing in the store) 
     * ret - flag that tells the function whether to pass
     * back the sorted data or store it in the store 
     * options - any options needed to pass to the sorter upon creation
     * 
     * returns: nothing or the data depending on the value of ret parameter.
     */
    doSort : function (col, sort, data, ret, options) {
        options = {} || options;
        
        sort = (sort) ? this.sorters[sort] : this.sorters[this.options.defaultSort];
        data = data ? data : this.data;
        ret = ret ? true : false;
        
        if (!$defined(this.comparator)) {
            this.comparator = new Jx.Compare({
                separator : this.options.separator
            });
        }
        
        this.col = col = this.resolveCol(col);
        
        var fn = this.comparator[col.type].bind(this.comparator);
        if (!$defined(this.sorter)) {
            this.sorter = new Jx.Sort[sort](data, fn, col.name, options);
        } else {
            this.sorter.setComparator(fn);
            this.sorter.setColumn(col.name);
            this.sorter.setData(data);
        }
        var d = this.sorter.sort();
        
        if (ret) {
            return d;
        } else {
            this.data = d;
        }
    },
    /**
     * Method: resolveCol
     * resolves the given column identifier and resolves it to the 
     * actual column object in the store.
     * 
     * Parameters:
     * col - the name or index of the required column.
     */
    resolveCol: function (col) {
        var t = Jx.type(col);
        if (t === 'number') {
            col = this.store.options.columns[col];
        } else if (t === 'string') {
            this.store.options.columns.each(function (column) {
                if (column.name === col) {
                    col = column;
                }
            }, this);
        }
        return col;   
    }
});