// $Id: $
/**
 * Class: Jx.Store 
 * 
 * Extends: <Jx.Object>
 * 
 * This class is the base store. It keeps track of data. It
 * allows adding, deleting, iterating, sorting etc...
 * 
 * Events: onLoadFinished(store) - fired when the store finishes loading the
 * data onLoadError(store,data) - fired when there is an error loading the data
 * 
 * Example:
 * (code)
 * (end)
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */

Jx.Store = new Class({

    Extends : Jx.Object,

    Family : "Jx.Store",

    options : {
        /**
         * Option: id
         * the identifier for this store
         */
        id : null,
        /**
         * Option: columns
         * an array listing the columns of the store in order of their 
         * appearance in the data object formatted as an object 
         *      {name: 'column name', type: 'column type'} 
         * where type can be one of alphanumeric, numeric, date, boolean, 
         * or currency.
         */
        columns : [], 
        /**
         * Option: defaultSort
         * The default sorting type, currently set to merge but can be any of the
         * sorters available
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
        sortCols : [], 
        /**
         * Event: onLoadFinished(store)
         * event for a completed, successful data load
         */
        onLoadFinished : $empty,
        /**
         * Event: onLoadError(store,data)
         * event for an unsuccessful load
         */
        onLoadError : $empty, 
        /**
         * Event: onColumnChanged
         * event fired for changes to a column
         */
        onColumnChanged : $empty
   
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
     * Property: data
     * Holds the data for this store
     */
    data : null,
    /**
     * Property: index
     * Holds the current position of the store relative to the data.
     * Zero-based index.
     */
    index : 0,
    /**
     * Property: dirty
     * Tells us if the store is dirty
     */
    dirty : false,
    /**
     * Property: id
     * The id of this store.
     */
    id : null,

    /**
     * Constructor: Jx.Store 
     * Initializes this class
     * 
     * Parameters: 
     * options - <Jx.Store.Options>
     */
    initialize : function (options) {
        this.parent(options);
    },

    /**
     * APIMethod: load 
     * Loads data into the store.
     * 
     * Parameters: 
     * data - the data to load
     */
    load : function (data) {
        if ($defined(data)) {
            this.processData(data);
        }
    },

    /**
     * APIMethod: hasNext 
     * Determines if there are more records past the current
     * one.
     * 
     * Returns: true | false (Null if there's a problem)
     */
    hasNext : function () {
        if ($defined(this.data)) {
            if (this.index < this.data.length - 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return null;
        }
    },

    /**
     * APIMethod: hasPrevious 
     * Determines if there are records before the current
     * one.
     * 
     * Returns: true | false
     */
    hasPrevious : function () {
        if ($defined(this.data)) {
            if (this.index > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return null;
        }
    },

    /**
     * APIMethod: valid 
     * Tells us if the current index has any data (i.e. that the
     * index is valid).
     * 
     * Returns: true | false
     */
    valid : function () {
        return ($defined(this.data[this.index]));
    },

    /**
     * APIMethod: next 
     * Moves the store to the next record
     * 
     * Returns: nothing | null if error
     */
    next : function () {
        if ($defined(this.data)) {
            this.index++;
            if (this.index === this.data.length) {
                this.index = this.data.length - 1;
            }
            this.fireEvent('storeMove', this);
        } else {
            return null;
        }
    },

    /**
     * APIMethod: previous 
     * moves the store to the previous record
     * 
     * Returns: nothing | null if error
     * 
     */
    previous : function () {
        if ($defined(this.data)) {
            this.index--;
            if (this.index === -1) {
                this.index = 0;
            }
            this.fireEvent('storeMove', this);
        } else {
            return null;
        }
    },

    /**
     * APIMethod: first 
     * Moves the store to the first record
     * 
     * Returns: nothing | null if error
     * 
     */
    first : function () {
        if ($defined(this.data)) {
            this.index = 0;
            this.fireEvent('storeMove', this);
        } else {
            return null;
        }
    },

    /**
     * APIMethod: last 
     * Moves to the last record in the store
     * 
     * Returns: nothing | null if error
     */
    last : function () {
        if ($defined(this.data)) {
            this.index = this.data.length - 1;
            this.fireEvent('storeMove', this);
        } else {
            return null;
        }
    },

    /**
     * APIMethod: count 
     * Returns the number of records in the store
     * 
     * Returns: an integer indicating the number of records in the store or null
     * if there's an error
     */
    count : function () {
        if ($defined(this.data)) {
            return this.data.length;
        } else {
            return null;
        }
    },

    /**
     * APIMethod: getPosition 
     * Tells us where we are in the store
     * 
     * Returns: an integer indicating the position in the store or null if
     * there's an error
     */
    getPosition : function () {
        if ($defined(this.data)) {
            return this.index;
        } else {
            return null;
        }
    },

    /**
     * APIMethod: moveTo 
     * Moves the index to a specific record in the store
     * 
     * Parameters: 
     * index - the record to move to
     * 
     * Returns: true - if successful false - if not successful null - on error
     */
    moveTo : function (index) {
        if ($defined(this.data) && index >= 0 && index < this.data.length) {
            this.index = index;
            this.fireEvent('storeMove', this);
            return true;
        } else if (!$defined(this.data)) {
            return null;
        } else {
            return false;
        }
    },

    /**
     * APIMethod: get 
     * Retrieves the data for a specific column of the current
     * record
     * 
     * Parameters: 
     * col - the column to get (either an integer or a string)
     * 
     * Returns: the data in the column or null if the column doesn't exist
     */
    get : function (col) {
        if ($defined(this.data)) {
            col = this.resolveCol(col);
            var h = this.data[this.index];
            if (h.has(col.name)) {
                return h.get(col.name);
            } else {
                return null;
            }
        } else {
            return null;
        }
    },

    /**
     * APIMethod: set 
     * Puts a value into a specific column of the current record and
     * sets the dirty flag.
     * 
     * Parameters: 
     * column - the column to put the value in value - the data to put
     * into the column
     * 
     * returns: nothing | null if an error
     */
    set : function (column, value) {
        if ($defined(this.data)) {
            // set the column to the value and set the dirty flag
            if ($type(column) === 'number') {
                column = this.resolveCol(column);
            }
            var oldValue = this.data[this.index].get(column.name);
            this.data[this.index].set(column.name, value);
            this.data[this.index].set('dirty', true);
            this.fireEvent('columnChanged', [ this.index, column, oldValue, value ]);
        } else {
            return null;
        }
    },
    
    /**
     * APIMethod: refresh 
     * Sets new data into the store
     * 
     * Parameters: 
     * data - the data to set 
     * reset - flag as to whether to reset the index to 0
     * 
     * Returns: nothing or null if no data is passed
     */
    refresh : function (data, reset) {
        if ($defined(data)) {
            this.processData(data);
            if (reset) {
                this.index = 0;
            }
        } else {
            return null;
        }
    },
    
    /**
     * APIMethod: isDirty 
     * Tells us if the store is dirty and needs to be saved
     * 
     * Returns: true | false | null on error
     */
    isDirty : function () {
        if ($defined(this.data)) {
            var dirty = false;
            this.data.each(function (row) {
                if (this.isRowDirty(row)) {
                    dirty = true;
                    return;
                }
            }, this);
            return dirty;
        } else {
            return null;
        }
    },
    
    /**
     * APIMethod: newRow 
     * Adds a new row to the store. It can either be empty or made
     * from an array of data
     * 
     * Parameters: 
     * data - data to use in the new row (optional)
     */
    newRow : function (data) {
        // check if array is not defined
        if (!$defined(this.data)) {
            // if not, then create a new array
            this.data = [];
        }
        
        var d;
        
        if (!$defined(data)) {
            d = new Hash();
        } else {
            var t = $type(data);
            switch (t) {
            case 'object':
                d = new Hash(data);
                break;
            case 'hash':
                d = data;
                break;
            }
        }
        d.set('dirty', true);
        this.data[this.data.length] = d;
        this.index = this.data.length - 1;
        this.fireEvent('newrow', this);
    },
    
    /**
     * APIMethod: sort 
     * Runs the sorting and grouping
     * 
     * Parameters: 
     * cols - Optional. An array of columns to sort/group by 
     * sort - the sort type (quick,heap,merge,native),defaults to options.defaultSort
     * dir - the direction to sort. Set to "desc" for descending,
     * anything else implies ascending (even null). 
     */
    sort : function (cols, sort, dir) {
        this.fireEvent('sortStart', this);
        
        var c;
        if ($defined(cols) && $type(cols) === 'Array') {
            c = this.options.sortCols = cols;
        } else if ($defined(cols) && $type(cols) === 'string') {
            this.options.sortCols = [];
            this.options.sortCols.push(cols);
            c = this.options.sortCols;
        } else if ($defined(this.options.sortCols)) {
            c = this.options.sortCols;
        } else {
            return null;
        }
        
        this.sort = sort;
        // first sort on the first array item
        this.doSort(c[0], sort);
    
        c.each(function (item, index, array) {
            if (index !== 0) {
                this.subSort(this.data, array[index - 1], item);
            }
        }, this);
    
        if ($defined(dir) && dir === 'desc') {
            this.data.reverse();
        }
    
        this.fireEvent('sortFinished', this);
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
    subSort : function (data, groupByCol, sortCol) {
        /**
         *  loop through the data array and create another array with just the
         *  items for each group. Sort that sub-array and then concat it 
         *  to the result.
         */
        var result = [];
        var sub = [];
    
        var group = data[0].get(groupByCol);
        this.sorter.setColumn(sortCol);
        for (var i = 0; i < data.length; i++) {
            if (group === (data[i]).get(groupByCol)) {
                sub.push(data[i]);
            } else {
                // sort
    
                if (sub.length > 1) {
                    result = result.concat(this.doSort(sortCol, this.sort, sub, true));
                } else {
                    result = result.concat(sub);
                }
            
                // change group
                group = (data[i]).get(groupByCol);
                // clear sub
                sub.empty();
                // add to sub
                sub.push(data[i]);
            }
        }
        
        if (sub.length > 1) {
            this.sorter.setData(sub);
            result = result.concat(this.doSort(sortCol, this.sort, sub, true));
        } else {
            result = result.concat(sub);
        }
        
        this.data = result;
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
     * Method: isRowDirty 
     * Helps determine if a row is dirty
     * 
     * Parameters: 
     * row - the row to check
     * 
     * Returns: true | false
     */
    isRowDirty : function (row) {
        if (row.has('dirty')) {
            return row.get('dirty');
        } else {
            return false;
        }
    },
    
    /**
     * Method: resolveCol 
     * Determines which array index this column refers to
     * 
     * Parameters: 
     * col - a number referencing a column in the store
     * 
     * Returns: the name of the column
     */
    resolveCol : function (col) {
        var t = $type(col);
        if (t === 'number') {
            col = this.options.columns[col];
        } else if (t === 'string') {
            this.options.columns.each(function (column) {
                if (column.name === col) {
                    col = column;
                }
            }, this);
        }
        return col;
    },
    
    /**
     * Method: processData 
     * Processes the data passed into the function into the store.
     * 
     * Parameters: 
     * data - the data to put into the store
     */
    processData : function (data) {
        this.fireEvent('preload', [ this, data ]);
    
        if (!$defined(this.data)) {
            this.data = [];
        }
        if ($defined(data)) {
            this.data.empty();
            var type = $type(data);
            // is this an array?
            if (type === 'array') {
                data.each(function (item, index) {
                    this.data.include(new Hash(item));
                }, this);
            } else if (type === 'object') {
                // is this an object?
                this.data.include(new Hash(data));
            } else if (type === 'string') {
                // is this a string?
                try {
                    this.data.include(new Hash(JSON.decode(data)));
                } catch (e) {
                    this.fireEvent('loadError', [ this, data ]);
                }
            }
            this.fireEvent('loadFinished', this);
        } else {
            this.fireEvent('loadError', [ this, data ]);
        }
    }
});
