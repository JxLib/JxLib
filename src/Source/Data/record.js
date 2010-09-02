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

        primaryKey: null
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

    parameters: ['store', 'columns', 'data', 'options'],

    init: function () {
        this.parent();
        if ($defined(this.options.columns)) {
            this.columns = this.options.columns;
        }

        if ($defined(this.options.data)) {
            this.processData(this.options.data);
        } else {
            this.data = new Hash();
        }

        if ($defined(this.options.store)) {
            this.store = this.options.store;
        }

    },
    /**
     * APIMethod: get
     * returns the value of the requested column. Can be programmed to handle
     * pseudo-columns (such as the primaryKey column implemented in this base
     * record).
     *
     * Parameters:
     * column - the string, index, or object of the requested column
     */
    get: function (column) {
        var type = Jx.type(column);
        if (type !== 'object') {
            if (column === 'primaryKey') {
                column = this.resolveCol(this.options.primaryKey);
            } else {
                column = this.resolveCol(column);
            }
        }
        if (this.data.has(column.name)) {
            return this.data.get(column.name);
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
        var type = Jx.type(column),
            oldValue;
        if (type !== 'object') {
            column = this.resolveCol(column);
        }

        if (!$defined(this.data)) {
            this.data = new Hash();
        }

        oldValue = this.get(column);
        this.data.set(column.name, data);
        this.state = Jx.Record.UPDATE;
        return [column.name, oldValue, data];
        //this.store.fireEvent('storeColumnChanged', [this, column.name, oldValue, data]);

    },
    /**
     * APIMethod: equals
     * Compares the value of a particular column with a given value
     *
     * Parameters:
     * column - the column to compare with (either column name or index)
     * value - the value to compare to.
     *
     * Returns:
     * True | False depending on the outcome of the comparison.
     */
    equals: function (column, value) {
        if (column === 'primaryKey') {
            column = this.resolveCol(this.options.primaryKey);
        } else {
            column = this.resolveCol(column);
        }
        if (!this.data.has(column.name)) {
            return null;
        } else {
            if (!$defined(this.comparator)) {
                this.comparator = new Jx.Compare({
                    separator : this.options.separator
                });
            }
            var fn = this.comparator[column.type].bind(this.comparator);
            return (fn(this.get(column), value) === 0);
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
        this.data = $H(data);
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
    resolveCol : function (col) {
        var t = Jx.type(col);
        if (t === 'number') {
            col = this.columns[col];
        } else if (t === 'string') {
            this.columns.each(function (column) {
                if (column.name === col) {
                    col = column;
                }
            }, this);
        }
        return col;
    },
    /**
     * APIMethod: asHash
     * Returns the data for this record as a Hash
     */
    asHash: function() {
        return this.data;
    }
});

Jx.Record.UPDATE = 1;
Jx.Record.DELETE = 2;
Jx.Record.INSERT = 3;