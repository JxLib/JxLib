// $Id: $
/**
 * Class: Jx.Sort Base class for all of the sorting algorithm classes.
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

    Family : 'Jx.Sort',

    Extends : Jx.Object,

    options : {
        /**
         * Option: timeIt
         * whether to time the sort
         */
        timeIt : false,
        /**
         * Event: onStart
         */
        onStart : $empty,
        /**
         * Event: onEnd
         */
        onEnd : $empty
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
    comparator : $empty,
    /**
     * Property: col
     * The column to sort by
     */
    col : null,

    /**
     * Constructor: Jx.Sort Initializes the class
     * 
     * Parameters: 
     * arr - the array to sort 
     * fn - the function to use in sorting
     * col - the column to sort by 
     * options - <Jx.Sort.Options> 
     */
    initialize : function (arr, fn, col, options) {
        this.parent(options);
        if (this.options.timeIt) {
            this.addEvent('start', this.startTimer.bind(this));
            this.addEvent('stop', this.stopTimer.bind(this));
        }
        this.data = arr;
        this.comparator = fn;
        this.col = col;
    },

    /**
     * APIMethod: sort 
     * Actually does the sorting. Must be overridden by subclasses.
     */
    sort : $empty,

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
        if ($defined(data)) {
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
        if ($defined(col)) {
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
