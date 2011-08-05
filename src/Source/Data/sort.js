/*
---

name: Jx.Sort

description: Base class for the sort algorithm implementations

license: MIT-style license.

requires:
 - Jx.Object
 - Jx.Compare

provides: [Jx.Sort]

...
 */
// $Id$
/**
 * Class: Jx.Sort
 * Base class for all of the sorting algorithm classes.
 *
 * Extends: <Jx.Object>
 *
 * Events:
 * onStart() - called when the sort starts
 * onEnd() - called when the sort stops
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
Jx.Sort = new Class({
    
    Extends : Jx.Object,
    Family : 'Jx.Sort',

    options : {
        /**
         * Option: timeIt
         * whether to time the sort
         */
        timeIt : false,
        /**
         * Event: onStart
         */
        onStart : function(){},
        /**
         * Event: onEnd
         */
        onEnd : function(){}
    },

    /**
     * Property: timer
     * holds the timer instance
     */
    timer : null,
    /**
     * Property: data
     * The data to sort
     */
    data : null,
    /**
     * Property: Comparator
     * The comparator to use in sorting
     */
    comparator : function(){},
    /**
     * Property: col
     * The column to sort by
     */
    col : null,

    parameters: ['data','fn','col','options'],

    /**
     * APIMethod: init
     */
    init : function () {
        this.parent();
        if (this.options.timeIt) {
            this.addEvent('start', this.startTimer.bind(this));
            this.addEvent('stop', this.stopTimer.bind(this));
        }
        this.data = this.options.data;
        this.comparator = this.options.fn;
        this.col = this.options.col;
    },

    /**
     * APIMethod: sort
     * Actually does the sorting. Must be overridden by subclasses.
     */
    sort : function(){},

    /**
     * Method: startTimer
     * Saves the starting time of the sort
     */
    startTimer : function () {
        this.timer = new Date();
    },

    /**
     * Method: stopTimer
     * Determines the time the sort took.
     */
    stopTimer : function () {
        this.end = new Date();
        this.dif = this.timer.diff(this.end, 'ms');
    },

    /**
     * APIMethod: setData
     * sets the data to sort
     *
     * Parameters:
     * data - the data to sort
     */
    setData : function (data) {
        if (data !== undefined && data !== null) {
            this.data = data;
        }
    },

    /**
     * APIMethod: setColumn
     * Sets the column to sort by
     *
     * Parameters:
     * col - the column to sort by
     */
    setColumn : function (col) {
        if (col !== undefined && col !== null) {
            this.col = col;
        }
    },

    /**
     * APIMethod: setComparator
     * Sets the comparator to use in sorting
     *
     * Parameters:
     * fn - the function to use as the comparator
     */
    setComparator : function (fn) {
        this.comparator = fn;
    }
});
