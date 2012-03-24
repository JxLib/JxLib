/*
---

name: Jx.Store

description: An implementation of a basic data store.

license: MIT-style license.

requires:
 - Jx.Object
 - Jx.Record

provides: [Jx.Store]

...
 */
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
 * strategies, and a record class passed to it that it can use.
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

define("jx/store", ['../base','./object','./record','./store/strategy/full'],
       function(base, jxObject, Record, Full){
    
    var store = new Class({

        Extends: jxObject,
        Family: 'Jx.Store',
    
        options: {
            /**
             * Option: id
             * the identifier for this store
             */
            id : null,
            /**
             * Option: fields
             * an array listing the fields of the store in order of their
             * appearance in the data object formatted as an object
             *      {name: 'column name', type: 'column type'}
             * where type can be one of alphanumeric, numeric, date, boolean,
             * or currency.
             */
            fields : [],
            /**
             * Option: protocol
             * The protocol to use for communication in this store. The store
             * itself doesn't actually use it but it is accessed by the strategies
             * to do their work. This option is required and the store won't work
             * without it.
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
             * This is a Jx.Store.Record instance or one of its subclasses. This is
             * the class that will be used to hold each individual record in the
             * store. Don't pass in a instance of the class but rather the class
             * name itself. If none is passed in it will default to Jx.Record
             */
            record: null,
            /**
             * Option: recordOptions
             * Options to pass to each record as it's created.
             */
            recordOptions: {}
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
         * APIProperty: id
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
    
        /**
         * Property: deleted
         * track deleted records before they are purged
         */
        deleted: null,
    
        /**
         * Method: init
         * initialize the store, should be called by sub-classes
         */
        init: function () {
            this.parent();
    
            this.deleted = [];
    
            if (this.options.id !== undefined && this.options.id !== null) {
                this.id = this.options.id;
            }
    
            if (this.options.protocol === undefined || this.options.protocol === null) {
                this.ready = false;
                return;
            } else {
                this.protocol = this.options.protocol;
            }
    
            this.strategies = {};
    
            if (this.options.strategies !== undefined && this.options.strategies !== null) {
                this.options.strategies.each(function(strategy){
                    this.addStrategy(strategy);
                },this);
            } else {
                var strategy = new Full();
                this.addStrategy(strategy);
            }
    
            if (this.options.record !== undefined && this.options.record !== null) {
                this.record = this.options.record;
            } else {
                this.record = Record;
            }
    
    
        },
    
        /**
         * Method: cleanup
         * avoid memory leaks when a store is destroyed, should be called
         * by sub-classes if overridden
         */
        cleanup: function () {
            Object.each(this.strategies, function(strategy){
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
            if (Object.keys(this.strategies).contains(name)) {
                return this.strategies[name];
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
            this.strategies[strategy.name] = strategy;
            strategy.setStore(this);
            strategy.activate();
        },
        /**
         * APIMethod: load
         * used to load the store. It simply fires an event that the strategies
         * are listening for.
         *
         * Parameters:
         * params - a hash of parameters passed to the strategy for determining
         *     what records to load.
         */
        load: function (params) {
            this.fireEvent('storeLoad', params);
        },
        /**
         * APIMethod: empty
         * Clears the store of data
         */
        empty: function () {
            if (this.data !== undefined && this.data !== null) {
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
            if (this.data !== undefined && this.data !== null) {
                return this.index < this.data.length - 1;
            }
            return null;
        },
    
        /**
         * APIMethod: hasPrevious
         * Determines if there are records before the current
         * one.
         *
         * Returns: true | false
         */
        hasPrevious : function () {
            if (this.data !== undefined && this.data !== null) {
                return this.index > 0;
            }
            return null;
        },
    
        /**
         * APIMethod: valid
         * Tells us if the current index has any data (i.e. that the
         * index is valid).
         *
         * Returns: true | false
         */
        valid : function () {
            return (this.data !== undefined  && this.data !== null && this.data[this.index] !== undefined);
        },
    
        /**
         * APIMethod: next
         * Moves the store to the next record
         *
         * Returns: nothing | null if error
         */
        next : function () {
            if (this.data !== undefined && this.data !== null) {
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
            if (this.data !== undefined && this.data !== null) {
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
            if (this.data !== undefined && this.data !== null) {
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
            if (this.data !== undefined && this.data !== null) {
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
            if (this.data !== undefined && this.data !== null) {
                return this.data.length;
            }
            return null;
        },
    
        /**
         * APIMethod: getPosition
         * Tells us where we are in the store
         *
         * Returns: an integer indicating the position in the store or null if
         * there's an error
         */
        getPosition : function () {
            if (this.data !== undefined && this.data !== null) {
                return this.index;
            }
            return null;
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
            if (this.data !== undefined && this.data !== null && index >= 0 && index < this.data.length) {
                this.index = index;
                this.fireEvent('storeMove', this);
                return true;
            } else if (this.data === undefined && this.data === null) {
                return null;
            } else {
                return false;
            }
        },
        /**
         * APIMethod: each
         * allows iteration through the store's records.
         * NOTE: this function is untested
         *
         * Parameters:
         * fn - the function to execute for each record
         * bind - the scope of the function
         * ignoreDeleted - flag that tells the function whether to ignore records
         *                  marked as deleted.
         */
        each: function (fn, bind, ignoreDeleted) {
            if (this.data !== undefined && this.data !== null) {
              var data;
              if (ignoreDeleted) {
                  data = this.data.filter(function (record) {
                      return record.state !== Record.DELETE;
                  }, this);
              } else {
                  data = this.data;
              }
              data.each(fn, bind);
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
            if (index === undefined || index === null) {
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
            if (index === undefined && index !== null) {
                index = this.index;
            }
            var ret = this.data[index].set(column, data);
            ret.reverse();
            ret.push(index);
            ret.reverse();
            //fire event with array [index, column, oldvalue, newValue]
            this.fireEvent('storeColumnChanged', ret);
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
         * position - whether the record is added to the 'top' or 'bottom' of the
         *      store.
         * insert - flag whether this is an "insert"
         */
        addRecord: function (data, position, insert) {
            if (this.data === undefined && this.data !== null) {
                this.data = [];
            }
    
            position = (position !== undefined && position !== null) ? position : 'bottom';
    
            var record = data;
            if (!(data instanceof Record)) {
                record = new (this.record)(this, this.options.fields, data, this.options.recordOptions);
            }
            if (insert) {
                record.state = Record.INSERT;
            }
            if (position === 'top') {
                //some literature claims that .shift() and .unshift() don't work reliably in IE
                //so we do it this way.
                this.data.reverse();
                this.data.push(record);
                this.data.reverse();
            } else {
                this.data.push(record);
            }
            this.fireEvent('storeRecordAdded', [this, record, position]);
        },
        /**
         * APIMethod: addRecords
         * Used to add multiple records to the store at one time.
         *
         * Parameters:
         * data - an array of data to add.
         * position - 'top' or 'bottom'. Indicates whether to add at the top or
         * the bottom of the store
         */
        addRecords: function (data, position) {
            var def = (data !== undefined  && data !== null) ,
                type = typeOf(data);
            if (this.data === undefined || this.data === null) {
                this.data = [];
            }
            if (def && type === 'array') {
                this.fireEvent('storeBeginAddRecords', this);
                //if position is top, reverse the array or we'll add them in the
                // wrong order.
                if (position === 'top') {
                    data.reverse();
                }
                data.each(function(d){
                    this.addRecord(d, position);
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
         * index - the index from which to return the record. Optional. Defaults
         * to the current store index
         */
        getRecord: function (index) {
            if (index === undefined && index !== null) {
                index = this.index;
            }
    
            if (index instanceof Record) {
                return index;
            }
    
            if (typeOf(index) === 'number') {
                if (this.data !== undefined && this.data !== null && this.data[index] !== undefined) {
                    return this.data[index];
                }
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
            if (data !== undefined  && this.data !== null) {
                if (index === undefined  && index !== null) {
                    index = this.index;
                }
                var record = new this.record(this, this.options.fields, data),
                oldRecord = this.data[index];
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
            if (index === undefined && index !== null) {
                index = this.index;
            }
            var record = this.data[index];
            record.state = Record.DELETE;
            // Set to Null or slice it out and compact the array???
            //this.data[index] = null;
            this.data.splice(index,1);
            // TODO: I moved this to a property that is always an array so I don't
            // get an error in the save strategy.
            // if (this.deleted  == undefined) {
            //     this.deleted = [];
            // }
            this.deleted.push(record);
            this.fireEvent('storeRecordDeleted', [this, record]);
        },
        /**
         * APIMethod: insertRecord
         * Shortcut to addRecord which facilitates marking a record as inserted.
         *
         * Parameters:
         * data - the data to use in creating this inserted record. Should be in
         *          whatever form the current implementation of Jx.Record needs
         * position - where to place the record. Should be either 'top' or
         *    'bottom'.
         */
        insertRecord: function (data, position) {
            this.addRecord(data, position, true);
        },
    
        /**
         * APIMethod: getFields
         * Allows retrieving the fields array
         */
        getFields: function () {
            return this.options.fields;
        },
    
        /**
         * APIMethod: findByColumn
         * Used to find a specific record by the value in a specific column. This
         * is particularly useful for finding records by a unique id column. The
         * search will stop on the first instance of the value
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
        },
        /**
         * APIMethod: removeRecord
         * removes (but does not mark for deletion) a record at the given index
         * or the current store index if none is passed in.
         *
         * Parameters:
         * index - Optional. The store index of the record to remove.
         */
        removeRecord: function (index) {
            if (index === undefined && index !== null) {
                index = this.index;
            }
            this.data.splice(index,1);
            this.fireEvent('storeRecordRemoved', [this, index]);
        },
        /**
         * APIMethod: removeRecords
         * Used to remove multiple contiguous records from a store.
         *
         * Parameters:
         * first - where to start removing records (zero-based)
         * last - where to stop removing records (zero-based, inclusive)
         */
        removeRecords: function (first, last) {
            for (var i = first; i <= last; i++) {
                this.removeRecord(first);
            }
            this.fireEvent('storeMultipleRecordsRemoved', [this, first, last]);
        },
    
        /**
         * APIMethod: parseTemplate
         * parses the provided template to determine which store fields are
         * required to complete it.
         *
         * Parameters:
         * template - the template to parse
         */
        parseTemplate: function (template) {
            //we parse the template based on fields in the data store looking
            //for the pattern {column-name}. If it's in there we add it to the
            //array of ones to look for
            var arr = [],
                s;
            this.options.fields.each(function (col) {
                s = '{' + col.name + '}';
                if (template.contains(s)) {
                    arr.push(col.name);
                }
            }, this);
            return arr;
        },
    
        /**
         * APIMethod: fillTemplate
         * Actually does the work of getting the data from the store
         * and creating a single item based on the provided template
         *
         * Parameters:
         * index - the index of the data in the store to use in populating the
         *          template or a Jx.Record instance.
         * template - the template to fill
         * columnsNeeded - the array of fields needed by this template. should be
         *      obtained by calling parseTemplate().
         * obj - an object with some prefilled keys to use in substituting.
         *      Ones that are also in the store will be overwritten.
         */
        fillTemplate: function (index, template, columnsNeeded, obj) {
            var record = null,
                itemObj;
            if (index !== undefined  && index !== null) {
                if (index instanceof Record) {
                    record = index;
                } else {
                    record = this.getRecord(index);
                }
              } else {
                  record = this.getRecord(this.index);
              }
    
            //create the item
            itemObj = (obj !== undefined  && obj !== null) ? obj : {};
            columnsNeeded.each(function (col) {
                itemObj[col] = record.get(col);
            }, this);
            return template.substitute(itemObj);
        },
    
        /**
         * APIMethod: equals
         * Compares to records to see if they are equivalent. Basically compares the
         * data objects.
         *
         * Parameters:
         * record - the first record to use in the comparison. Can either be a Jx.Record
         *          instance, oor an index to pull from the store.
         * compareTo - the second record to use in the comparison. Same as record.
         */
        equals: function(record,compareTo) {
            record = this.getRecord(record);
            compareTo = this.getRecord(compareTo);
    
            return record.data == compareTo.data;
        }
    
    });
    
    if (base.global) {
        base.global.Store = store;
    }
    
    return store;
    
});