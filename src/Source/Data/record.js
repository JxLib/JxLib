/*
---

name: Jx.Record

description: The basic record implementation. A store uses records to handle and manipulate data.

license: MIT-style license.

requires:
 - Jx.Object

provides: [Jx.Record]

...
 */
// $Id$
/**
 * Class: Jx.Record
 *
 * Extends: <Jx.Object>
 *
 * This class is used as a representation (or container) for a single row
 * of data in a <Jx.Store>. It is not usually directly instantiated by the
 * developer but rather by the store itself.
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Record = new Class({

    Extends: Jx.Object,
    Family: 'Jx.Record',

    options: {
        /**
         * Option: separator
         * The separator to pass to the comparator
         * constructor (<Jx.Compare>) - defaults to '.'
         */
        separator : '.',
        /**
         * Option: primaryKey
         * Indicates the column that acts as the primary key for this record.
         * Defaults to id.
         */
        primaryKey: 'id'
    },
    /**
     * Property: data
     * The data for this record
     */
    data: null,
    /**
     * Property: state
     * used to determine the state of this record. When not null (meaning no
     * changes were made) this should be one of
     *
     * - Jx.Record.UPDATE
     * - Jx.Record.DELETE
     * - Jx.Record.INSERT
     */
    state: null,
    /**
     * Property: columns
     * Holds a reference to the columns for this record. These are usually
     * passed to the record from the store. This should be an array of objects
     * where the objects represent the columns. The object should take the form:
     *
     * (code)
     * {
     *     name: <column name>,
     *     type: <column type>,
     *     ..additional options required by the record implementation...
     * }
     * (end)
     *
     * The type of the column should be one of alphanumeric, numeric, date,
     * boolean, or currency.
     */
    columns: null,
    /**
     * Property: virtuals
     * An object that holds all virtual "columns" in this record. You can add
     * virtuals by implementing them or subclassing Jx.Record.
     * 
     * Implement example:
     * (code)
     * Jx.Record.implement('virtuals',{
     *     key: {
     *       get: function(){},
     *       set: function(data){}
     *     }
     * });
     * (end)
     * 
     * or by subclassing:
     * (code)
     * var myRecord = new Class({
     *     Extends: Jx.Record,
     *     virtuals: {
     *       key: {
     *         get: function(){},
     *         set: function(data){}
     *       }
     *     }
     * });
     * (end)
     * 
     * You can then just get and set these columns as you would normal columns.
     */
    virtuals: {
        primaryKey: {
            type: 'alphanumeric',
            get: function(){
                column = this.resolveCol(this.options.primaryKey);
                return this.data[column.name];
            }
        }
    },

    parameters: ['store', 'columns', 'data', 'options'],

    init: function () {
        this.parent();
        if (this.options.columns !== undefined &&
            this.options.columns !== null) {
            this.columns = this.options.columns;
        }

        if (this.options.data !== undefined &&
            this.options.data !== null) {
            this.processData(this.options.data);
        } else {
            this.data = {};
        }

        if (this.options.store !== undefined &&
            this.options.store !== null) {
            this.store = this.options.store;
        }
        
        //bind the get/set methods of virtuals to the this
        for (var k in this.virtuals) {
            var originalGet, originalSet;
            if (this.virtuals[k].get !== undefined) {
                originalGet = this.virtuals[k].get;
                this.virtuals[k].get = originalGet.bind(this);
            }
            if (this.virtuals[k].set !== undefined) {
                originalSet = this.virtuals[k].set;
                this.virtuals[k].set = originalSet.bind(this);
            }
        }

    },
    /**
     * APIMethod: get
     * returns the value of the requestehd column. Can be programmed to handle
     * pseudo-columns (such as the primaryKey column implemented in this base
     * record).
     *
     * Parameters:
     * column - the string, index, or object of the requested column
     */
    get: function (column) {
        
        //first check for a virtual column
        if (Jx.type(column) == 'string' && this.virtuals[column] !== undefined && this.virtuals[column].get !== undefined) {
            return this.virtuals[column].get();
        }
        //if not virtual then it must be part of the data.
        column = this.resolveCol(column);
        if (column !== null && Object.keys(this.data).contains(column.name)) {
            return this.data[column.name];
        } else {
            return null;
        }
    },
    /**
     * APIMethod: set
     * Sets a given value into the requested column.
     *
     *  Parameters:
     *  column - the object, index, or string name of the target column
     *  data - the data to add to the column
     */
    set: function (column, data) {
        
        //check for virtual setter
        if (this.virtuals[column] !== undefined && this.virtuals[column].set !== undefined) {
            //the virtual column needs to set any flags and fire necessary events.
            return this.virtuals[column].set(data);
        }
        
        var type = Jx.type(column),
            oldValue;
        if (type !== 'object') {
            column = this.resolveCol(column);
        }
        
        if (column !== null) {
            if (this.data === undefined || this.data === null) {
                this.data = {};
            }
    
            oldValue = this.get(column);
            this.data[column.name] = data;
            this.state = Jx.Record.UPDATE;
            return [column.name, oldValue, data];
        } else {
            return null;
        }

    },
    /**
     * APIMethod: equals
     * Compares the value of a particular column with a given value
     *
     * Parameters:
     * column - the column to compare with (either column name, virtual name,
     *          or index)
     * value - the value to compare to.
     *
     * Returns:
     * True | False depending on the outcome of the comparison.
     */
    equals: function (column, value) {
        var col = this.resolveCol(column),
            currentValue = this.get(col.name);
        if (currentValue !== null){
            if (this.comparator === undefined || this.comparator === null) {
                this.comparator = new Jx.Compare({
                    separator : this.options.separator
                });
            }
            var fn = this.comparator[col.type].bind(this.comparator);
            return (fn(currentValue, value) === 0);
        } else {
            return false;
        }
    },
    /**
     * Method: processData
     * This method takes the data passed in and puts it into the form the
     * record needs it in. This default implementation does nothing but
     * assign the data to the data property but it can be overridden in
     * subclasses to massge the data in any way needed.
     *
     * Parameters:
     * data - the data to process
     */
    processData: function (data) {
        this.data = data;
    },

    /**
     * Method: resolveCol
     * Determines which column is being asked for and returns it.
     *
     * Parameters:
     * col - a number referencing a column in the store
     *
     * Returns:
     * the column object referred to
     */
    resolveCol: function (col) {
        var t = Jx.type(col),
            ret = null;
        if (t === 'number') {
            ret = this.columns[col];
        } else if (t === 'string') {
            //is it virtual?
            if (Object.keys(this.virtuals).contains(col)){
                ret = {
                    name: col,
                    type: this.virtuals[col].type
                };
            } else {
                //not virtual so check the actual columns.
                this.columns.each(function (column) {
                    if (column.name === col) {
                        ret = column;
                    }
                }, this);
            }
        }
        return ret;
    },
    /**
     * APIMethod: asObject
     * Returns the data for this record as a plain object
     */
    asObject: function() {
        return this.data;
    }
    
    
});

Jx.Record.UPDATE = 1;
Jx.Record.DELETE = 2;
Jx.Record.INSERT = 3;