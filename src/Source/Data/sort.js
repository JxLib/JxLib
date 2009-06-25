/**
 * Class: Jx.Sort Base class for all of the sorting algorithm classes.
 * 
 * Events: onStart() - called when the sort starts onEnd() - called when the
 * sort stops
 */
Jx.Sort = new Class({

    Family : 'Jx.Sort',

    Extends : Jx.Object,

    options : {
        timeIt : false,
        onStart : $empty,
        onEnd : $empty
    },

    timer : null,
    data : null,
    comparator : $empty,
    col : null,

    /**
     * Constructor: Jx.Sort Initializes the class
     * 
     * Parameters: arr - the array to sort fn - the function to use in sorting
     * col - the column to sort by options - class options as noted above
     * 
     * Options: timeIt - whether to time the sort
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
     * Method: sort Actually does the sorting. Must be overridden by subclasses.
     */
    sort : $empty,

    /**
     * Method: startTimer Saves the starting time of the sort
     */
    startTimer : function () {
        this.timer = new Date();
    },

    /**
     * Method: stopTimer Determines the time the sort took.
     */
    stopTimer : function () {
        this.end = new Date();
        this.dif = this.timer.diff(this.end, 'ms');
    },

    /**
     * Method: setData sets the data to sort
     * 
     * Parameters: data - the data to sort
     */
    setData : function (data) {
        if ($defined(data)) {
            this.data = data;
        }
    },

    /**
     * Method: setColumn Sets the column to sort by
     * 
     * Parameters: col - the column to sort by
     */
    setColumn : function (col) {
        if ($defined(col)) {
            this.col = col;
        }
    },

    setComparator : function (fn) {
        this.comparator = fn;
    }
});
