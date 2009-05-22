/**
 * Class: Jx.Sort
 * Base class for all of the sorting algorithm classes.
 * 
 * Events:
 * onStart() - called when the sort starts
 * onEnd() - called when the sort stops 
 */
Jx.Sort = new Class({
	
    Family: 'Jx.Sort',
	
    Extends: Jx.Object,

    options: {
        timeIt: false,
        onStart: $empty,
        onEnd: $empty
    },
	
    timer: null,
    _data: null,
    _comparator: $empty,
    _col: null,
	
    /** 
     * Constructor: Jx.Sort
     * Initializes the class
     * 
     * Parameters:
     * arr - the array to sort
     * fn - the function to use in sorting
     * col - the column to sort by
     * options - class options as noted above
     * 
     * Options:
     * timeIt - whether to time the sort
     */
    initialize: function(arr,fn,col,options){
        this.parent(options);
        if (this.options.timeIt) {
            this.addEvent('start',this.startTimer.bind(this));
            this.addEvent('stop',this.stopTimer.bind(this));
        }
        this._data = arr;
        this._comparator = fn;
        this._col = col;
    },
	
    /**
     * Method: sort
     * Actually does the sorting. Must be overridden by subclasses.
     */
    sort: $empty,
	
    /**
     * Method: _swap
     * Swaps the two passed indexes in the array.
     * 
     * Parameters:
     * a - an integer indicating which element to swap
     * b - an integer indicating which element to swap
     */
    _swap: function(a,b){
        var temp;
        temp = this._data[a];
        this._data[a] = this._data[b];
        this._data[b] = temp;
    },
	
    /**
     * Method: startTimer
     * Saves the starting time of the sort
     */
    startTimer: function(){
        this.timer = new Date();
    },
	
    /**
     * Method: stopTimer
     * Determines the time the sort took.
     */
    stopTimer: function(){
        this.end = new Date();
        this.dif = this.timer.diff(this.end,'ms');
    },
	
    /**
     * Method: setData
     * sets the data to sort
     * 
     * Parameters:
     * data - the data to sort
     */
    setData: function(data){
        if ($defined(data)){
            this._data = data;
        }
    },
	
    /**
     * Method: setCol
     * Sets the column to sort by
     * 
     * Parameters:
     * col - the column to sort by
     */
    setColumn: function(col){
        if ($defined(col)){
            this._col = col;
        }
    }
});