/**
 * Class: Jx.Store
 * This class is the base store. It keeps track of data. It allows
 * adding, deleting, iterating, etc...
 * 
 * Events:
 * onLoadFinished(store) - fired when the store finishes loading the data
 * onLoadError(store,data) - fired when there is an error loading the data
 */

Jx.Store = new Class({
    
    Extends: Jx.Object,
	
    Family: "Jx.Store",
	
    options: {
        id: null,
        cols: [],
		
        //events
        onLoadFinished: $empty,		//event for a completed, successful data load: onLoadFinished(store)
        onLoadError: $empty			//event for an unsuccessful load: onLoadError(store, data)
		
    },
	
    _data: null,
    _index: 0,
    _dirty: false,
    id: null,
	
    /**
     * Constructor: Jx.Store
     * Initializes this class
     * 
     * parameters:
     * options - an object containing the class options listed above
     * 
     * options:
     * id - the identifier for this store
     * cols - an array listing the names of columns of the store in order of their return from the server
     * 
     */
    initialize: function(options){
        this.parent(options);
    },
	
    /** 
     * method: load
     * Loads data into the store.
     * 
     * Parameters:
     * data - the data to load
     */
    load: function(data){
        if ($defined(data)){
            this._processData(data);
        }
    },
	
    /**
     * Method: hasNext
     * Determines if there are more records past the current one.
     * 
     * Returns:
     * true | false (Null if there's a problem)
     */
    hasNext: function(){
        if ($defined(this._data)) {
            if (this._index < this._data.length - 1) {
                return true;
            } else {
                return false;
            }
        } else {
            return null;
        }
    },
	
    /**
     * Method: hasPrevious
     * Determines if there are records before the current one.
     * 
     * Returns:
     * true | false
     */
    hasPrevious: function(){
        if ($defined(this._data)) {
            if (this._index > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return null;
        }
    },
	
    /**
     * Method: valid
     * Tells us if the current index has any data (i.e. that the index is
     * valid).
     * 
     * Returns:
     * true | false
     */
    valid: function(){
        return ($defined(this._data[this._index]));
    },
	
    /**
     * Method: next
     * Moves the store to the next record
     * 
     * Returns:
     * nothing | null if error
     */
    next: function(){
        if ($defined(this._data)) {
            this._index++;
            if (this._index === this._data.length){
                this._index = this._data.length - 1;
            }
        } else {
            return null;
        }
    },
	
    /**
     * Method: prev
     * moves the store to the previous record
     * 
     * Returns:
     * nothing | null if error
     * 
     */
    prev: function(){
        if ($defined(this._data)) {
            this._index--;
            if (this._index === -1) {
                this._index = 0;
            }
        } else {
            return null;
        }
    },
	
    /**
     * Method: first
     * Moves the store to the first record
     * 
     * Returns:
     * nothing | null if error
     * 
     */
    first: function(){
        if ($defined(this._data)) {
            this._index = 0;
        } else {
            return null;
        }
    },
	
    /**
     * Method: last
     * Moves to the last record in the store
     * 
     * Returns:
     * nothing | null if error
     */
    last: function(){
        if ($defined(this._data)) {
            this._index = this._data.length - 1;
        } else {
            return null;
        }
    },
	
    /**
     * Method: count
     * Returns the number of records in the store
     * 
     * Returns:
     * an integer indicating the number of records in the store or 
     * null if there's an error
     */
    count: function(){
        if ($defined(this._data)) {
            return this._data.length;
        } else {
            return null;
        }
    },
	
    /**
     * Method: getPos
     * Tells us where we are in the store
     * 
     * Returns:
     * an integer indicating the position in the store or null
     * if there's an error
     */
    getPos: function(){
        if ($defined(this._data)) {
            return this._index;
        } else {
            return null;
        }
    },
	
    /**
     * Method: moveTo
     * Moves the index to a specific record in the store
     * 
     * Parameters:
     * index - the record to move to
     * 
     * Returns:
     * true - if successful
     * false - if not successful
     * null - on error
     */
    moveTo: function(index){
        if ($defined(this._data) && index >= 0 && index < this._data.length) {
            this._index = index;
            return true;
        } else if (!$defined(this._data)){
            return null;
        } else {
            return false;
        }
    },

	/**
	 * Method: get
	 * Retrieves the data for a specific column of the current record
	 * 
	 * Parameters:
	 * col - the column to get (either an integer or a string)
	 * 
	 * Returns:
	 * the data in the column or null if the column doesn't exist
	 */
    get: function(col){
        if ($defined(this._data)) {
            col = this._resolveCol(col);
            h = this._data[this._index];
            if (h.has(col)) {
                return h.get(col);
            } else {
                return null;
            }
        } else {
            return null;
        }
    },
	
    /**
     * Method: set
     * Puts a value into a specific column of the current record and sets the dirty flag.
     * 
     * Parameters:
     * col - the column to put the value in
     * value - the data to put into the column
     * 
     * returns:
     * nothing | null if an error
     */
    set: function(col, value){
        if ($defined(this._data)) {
            //set the column to the value and set the dirty flag
            if ($type(col) == 'number'){
                col = this.options.cols[col];
            }
            this._data[this._index].set(col, value);
            this._data[this._index].set('dirty', true);
        } else {
            return null;
        }
    },
	
    /**
     * Method: refresh
     * Sets new data into the store
     * 
     * Parameters:
     * data - the data to set 
     * reset - flag as to whether to reset the index to 0
     * 
     * Returns:
     * nothing or null if no data is passed
     */
    refresh: function(data, reset){
        if ($defined(data)) {
            this._processData(data);
            if (reset) {
                this._index = 0;
            }
        } else {
            return null;
        }
    },
	
    /**
     * Method: isDirty
     * Tells us if the store is dirty and needs to be saved
     * 
     * Returns:
     * true | false | null on error
     */
    isDirty: function(){
        if ($defined(this._data)) {
            var dirty = false;
            this._data.each(function(row){
                if (this._isRowDirty(row)){
                    dirty = true;
                    return;
                }
            },this);
            return dirty;
        } else {
            return null;
        }
    },
	
    /**
     * Method: newRow
     * Adds a new row to the store. It can either be empty or made from an array of data
     * 
     * Parameters:
     * data - data to use in the new row (optional)
     */
    newRow: function(data){
        //check if array is not defined
        if (!$defined(this._data)){
            //if not, then create a new array
            this._data = new Array();
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
        d.set('dirty',true);
        this._data[this._data.length] = d;
        this._index = this._data.length - 1;
        this.fireEvent('newrow');
    },
	
    /**
     * Method: _isRowDirty
     * Private function. Helps determine if a row is dirty
     * 
     * Parameters:
     * row - the row to check
     * 
     * Returns:
     * true | false
     */
    _isRowDirty: function(row) {
        if (row.has('dirty')) {
            return row.get('dirty');
        } else {
            return false;
        }
    },
	
    /**
     * Method: _resolveCol
     * Private function. Determines which array index this column refers to
     * 
     * Parameters:
     * col -  a number referencing a column in the store
     * 
     * Returns:
     * the name of the column
     */
	_resolveCol: function(col){
        if ($type(col) == 'number') {
            col = this.options.cols[col];
        }
        return col;
    },
	
    /**
     * Method: _processData
     * Private function. Processes the data passed into the function into the store.
     * 
     * Parameters:
     * data - the data to put into the store
     */
    _processData: function(data){
        if (!$defined(this._data)){
            this._data = new Array();
        }
        if ($defined(data)) {
            this._data.empty();
            var type = $type(data);
            //is this an array?
            if (type == 'array') {
                data.each(function(item, index){
                    this._data.include(new Hash(item));
                },this);
            } else if (type == 'object') {
                //is this an object?
                this._data.include(new Hash(data));
            } else if (type == 'string') {
                //is this a string?
                try {
                    this._data.include(new Hash(JSON.decode(data)));
                } catch (e) {
                    this.fireEvent('loadError',[this,data]);
                }
            }
            this.fireEvent('loadFinished', this);
        } else {
            this.fireEvent('loadError', [this,data]);
        }
    }
	
});