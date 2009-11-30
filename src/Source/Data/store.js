// $Id$
/**
 * Class: Jx.Store 
 * 
 * Extends: <Jx.Object>
 * 
 * This class is the  store. It keeps track of data. It
 * allows adding, deleting, iterating, sorting etc...
 * 
 * For the most part the store is pretty "dumb" meaning it 
 * starts with very limited functionality. Actually, it can't
 * even load data by itself. Instead, it needs to have protocols,
 * strategies, and a record class passed to it that it knows how to use
 * and can use it.  
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
    
    Family: 'Jx.Store',
    Extends: Jx.Object,
    
    options: {
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
         * Option: protocol
         * The protocol to use for communication in this store. The store 
         * itself doesn't actually use it but it is accessed by the strategies
         * to do their work. This option is required and the store won't work without it.
         */
        protocol: null,
        /**
         * Option: strategies
         * This is an array of instantiated strategy objects that will work
         * on this store. They provide many services such as loading data,
         * paging data, saving, and sorting (and anything else you may need 
         * can be written). If none are passed in it will use the default 
         * Jx.Store.Strategy.Full
         */
        strategies: null,
        /**
         * Option: record
         * This is a Jx.Store.Record instance or one of its subclasses. This is the 
         * class that will be used to hold each individual record in the store.
         * Don't pass in a instance of the class but rather the class name 
         * itself. If none is passed in it will default to Jx.Store.Record
         */
        record: null,
        /**
         * Option: recordOptions
         * Options to pass to each record as it's created.
         */
        recordOptions: {
            primaryKey: null
        }
    },
    
    /**
     * Property: data
     * Holds the data for this store
     */
    data : null,
    /**
     * Property: index
     * Holds the current position of the store relative to the data and the pageIndex.
     * Zero-based index.
     */
    index : 0,
    /**
     * Property: id
     * The id of this store.
     */
    id : null,
    /**
     * Property: loaded
     * Tells whether the store has been loaded or not
     */
    loaded: false,
    /**
     * Property: ready
     * Used to determine if the store is completely initialized.
     */
    ready: false,
    
    init: function () {
        this.parent();
        
        if ($defined(this.options.id)) {
            this.id = this.options.id;
        } 
        
        if (!$defined(this.options.protocol)) {
            this.ready = false;
            return;
        } else {
            this.protocol = this.options.protocol;
        }
        
        this.strategies = new Hash();
        
        if ($defined(this.options.strategies)) {
            this.options.strategies.each(function(strategy){
                this.addStrategy(strategy);
            },this);
        } else {
            var strategy = new Jx.Store.Strategy.Full();
            this.addStrategy(strategy);
        }
        
        if ($defined(this.options.record)) {
            this.record = this.options.record;
        } else {
            this.record = Jx.Record;
        }
        
        
    },
    
    cleanup: function () {
        this.strategies.each(function(strategy){
            strategy.destroy();
        },this);
        this.strategies = null;
        this.protocol.destroy();
        this.protocol = null;
        this.record = null;
    },
    /**
     * APIMethod: getStrategy
     * returns the named strategy if it is present, null otherwise.
     * 
     * Parameters:
     * name - the name of the strategy we're looking for
     */
    getStrategy: function (name) {
        if (this.strategies.has(name)) {
            return this.strategies.get(name);
        }
        return null;
    },
    /**
     * APIMethod: addStrategy
     * Allows the addition of strategies after store initialization. Handy to 
     * have if some other class needs a strategy that is not present.
     * 
     * Parameters:
     * strategy - the strategy to add to the store
     */
    addStrategy: function (strategy) {
        this.strategies.set(strategy.name, strategy);
        strategy.setStore(this);
        strategy.activate();
    },
    /**
     * APIMethod: load
     * used to load the store. It simply fires an event that the strategies are
     * listening for.
     * 
     * Parameters:
     * params - a hash of parameters passed to the strategy for determining what records
     *          to load.
     */
    load: function (params) {
        this.fireEvent('storeLoad', params);
    },
    /**
     * APIMethod: empty
     * Clears the store of data
     */
    empty: function () {
        if ($defined(this.data)) {
            this.data.empty();
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
            return true;
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
            if (this.index < 0) {
                this.index = 0;
            }
            this.fireEvent('storeMove', this);
            return true;
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
            return true;
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
            return true;
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
     * APIMethod: each
     * allows iteration through the store's records.
     * 
     * Parameters:
     * fn - the function to execute for each record
     * bind - the scope of the function
     * ignoreDeleted - flag that tells the function whether to ignore records
     *                  marked as deleted.
     */
    each: function (fn, bind, ignoreDeleted) {
        var data;
        if (ignoreDeleted) {
            data = this.data.filter(function (record) {
                return record.state !== Jx.Record.DELETE;
            }, this);
        } else {
            data = this.data;
        }
        for (var i = 0, l = data.length; i < l; i++) {
            fn.call(bind, data[i], i, data);
        }
    },
    /**
     * APIMethod: get
     * gets the data for the specified column
     * 
     * Parameters:
     * column - indicator of the column to set. Either a string (the name of 
     *          the column) or an integer (the index of the column in the 
     *          record).
     * index - the index of the record in the internal array. Optional.
     *          defaults to the current index.
     */
    get: function (column, index) {
        if (!$defined(index)) {
            index = this.index;
        }
        return this.data[index].get(column);
    },
    /**
     * APIMethod: set
     * Sets the passed data for a particular column on the indicated record.
     * 
     * Parameters:
     * column - indicator of the column to set. Either a string (the name of 
     *          the column) or an integer (the index of the column in the 
     *          record).
     * data - the data to set in the column of the record
     * index - the index of the record in the internal array. Optional.
     *          defaults to the current index.
     */
    set: function (column, data, index) {
        if (!$defined(index)) {
            index = this.index;
        }
        return this.data[index].set(column, data);
    },
    /**
     * APIMethod: refresh
     * Simply fires the storeRefresh event for strategies to listen for.
     */
    refresh: function () {
        this.fireEvent('storeRefresh', this);
    },
    /**
     * APIMethod: addRecord
     * Adds given data to the end of the current store.
     * 
     * Parameters:
     * data - The data to use in creating a record. This should be in whatever
     *        form Jx.Store.Record, or the current subclass, needs it in.
     * insert - flag whether this is an "insert"
     */
    addRecord: function (data, insert) {
        if (!$defined(this.data)) {
            this.data = [];
        }
        var record;
        if (data instanceof Jx.Record) {
            record = data;
        } else {
            record = new (this.record)(this, this.options.columns, data, this.options.recordOptions);
        }
        if (insert) {
            record.state = Jx.Record.INSERT;
        }
        this.data.push(record);
        this.fireEvent('storeRecordAdded', [record, this]);
    },
    /**
     * APIMethod: addRecords
     * Used to add multiple records to the store at one time.
     * 
     * Parameters:
     * data - an array of data to add.
     */
    addRecords: function (data) {
        var def = $defined(data);
        var type = Jx.type(data);
        if (def && type === 'array') {
            this.fireEvent('storeBeginAddRecords', this);
            data.each(function(d){
                this.addRecord(d);
            },this);
            this.fireEvent('storeEndAddRecords', this);
            return true;
        }
        return false;
    },
    
    /**
     * APIMethod: getRecord
     * Returns the record at the given index or the current store index
     * 
     * Parameters:
     * index - the index from which to return the record. Optional. Defaults to
     *          the current store index
     */
    getRecord: function (index) {
        if (!$defined(index)) {
            index = this.index;
        }
        
        if (Jx.type(index) === 'number') {        
            if ($defined(this.data) && $defined(this.data[index])) {
                return this.data[index];
            }
        } else {
            var r;
            this.data.each(function(record){
                if (record === index) {
                    r = record;
                }
            },this);
            return r;
        }
        return null;
    },
    /**
     * APIMethod: replaceRecord
     * Replaces the record at an existing index with a new record containing
     * the passed in data.
     * 
     * Parameters:
     * data - the data to use in creating the new record
     * index - the index at which to place the new record. Optional. 
     *          defaults to the current store index.
     */
    replace: function(data, index) {
        if ($defined(data)) {
            if (!$defined(index)) {
                index = this.index;
            }
            var record = new this.record(this.options.columns,data);
            var oldRecord = this.data[index];
            this.data[index] = record;
            this.fireEvent('storeRecordReplaced', [oldRecord, record]);
            return true;
        } 
        return false;
    },
    /**
     * APIMethod: deleteRecord
     * Marks a record for deletion and removes it from the regular array of
     * records. It adds it to a special holding array so it can be disposed 
     * of later.
     * 
     * Parameters:
     * index - the index at which to place the new record. Optional. 
     *          defaults to the current store index.
     */
    deleteRecord: function(index) {
        if (!$defined(index)) {
            index = this.index;
        }
        var record = this.data[index];
        record.state = Jx.Record.DELETE;
        // Set to Null or slice it out and compact the array???
        this.data[index] = null;
        if (!$defined(this.deleted)) {
            this.deleted = [];
        }
        this.deleted.push(record);
        this.fireEvent('storeRecordDeleted', [record, this]);
    },
    /**
     * APIMethod: insertRecord
     * Shortcut to addRecord which facilitates marking a record as inserted.
     * 
     * Paremeters:
     * data - the data to use in creating this inserted record. Should be in
     *          whatever form the current implementation of Jx.Record needs
     */
    insertRecord: function (data) {
        this.addRecord(data, true);
    },
    
    /**
     * APIMethod: getColumns
     * Allows retrieving the columns array
     */
    getColumns: function () {
        return this.options.columns;
    },
    
    /**
     * APIMethod: findByColumn
     * Used to find a specific record by the value in a specific column. This
     * is particularly useful for finding records by a unique id column. The search
     * will stop on the first instance of the value
     * 
     * Parameters:
     * column - the name (or index) of the column to search by
     * value - the value to look for
     */
    findByColumn: function (column, value) {
        if (typeof StopIteration === "undefined") {
            StopIteration = new Error("StopIteration");
        }

        var index;
        try {
            this.data.each(function(record, idx){
                if (record.equals(column, value)) {
                    index = idx;
                    throw StopIteration;
                }
            },this);
        } catch (error) {
            if (error !== StopIteration) {
                throw error;
            }
            return index;
        }
        return null;
    }
});