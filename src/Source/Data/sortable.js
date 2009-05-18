/**
 * Class: Jx.Store.Sortable
 * Mixin for creating stores that are sortable by any column. 
 * This Class requires <Jx.Compare> to do it's work.
 * 
 * Options:
 * colTypes - an object listing the types of the columns {col1:'type'}, 
 * they can be alphanumeric, numeric, currency, or date
 * defaultSort - the default sort type. Can be quick, merge, or heap
 * separator - the separator to use in the compare class
 */
Jx.Store.Sortable = new Class({
	
    options: {
	    colTypes: {}, //alphanumeric, numeric, currency, date : setup as {'col':'type'} 
	    defaultSort: 'quick',
	    separator: '.'		//passed to an instance of Jx.Data.Compare
    },

    /**
     * Method: sort
     * Called to change the sorting of the data
     * 
     * Parameters:
     * col - the column to sort by
     * sort - the kind of sort to use (see list above)
     * data - the data to sort (leave blank or pass null to sort data existing in the store)
     * ret - flag that tells the function whether to pass back the sorted data or store it in the store
     * 
     * returns:
     * nothing or the data depending on the value of ret parameter.
     */
    sort: function(col, sort, data, ret){
        if (!$defined(sort)){
            sort = this.options.defaultSort;
        }
		
        if (!$defined(data)){
            data = this._data;
        }
		
        if (!$defined(ret)) {
            ret = false;
        }
		
        if (!$defined(this._comparator)) {
            this._comparator = new Jx.Compare({
                separator: this.options.separator
            });
        }
		
        this._col = col = this._resolveCol(col);
		
        var fn = this._determineComparator();
        this._sorter = this._determineSorter(data, sort, col, fn);
        var d = this._sorter.sort();
		
        if (ret){
            return d;
        } else {
            this._data = d;
        }
    },
	
    /**
     * Method: _determineComparator
     * Private function. Determines which comparator to use from <Jx.Compare>
     * 
     * Returns:
     * function to use in sorting based on column type
     */
    _determineComparator: function(){
        //determine which comparison function to use
        switch (this.options.colTypes[this._col]){
		    case 'alphanumeric':
		        return this._comparator.alphanumeric.bind(this._comparator);
		        break;
			case 'numeric':
			    return this._comparator.numeric.bind(this._comparator);
			    break;
			case 'currency':
			    return this._comparator.currency.bind(this._comparator);
			    break;
			case 'date':
			    return this._comparator.date.bind(this._comparator);
			    break;
			default:
			    return this._comparator.alphanumeric.bind(this._comparator);
        }
		
    },
	
    /**
     * Method: _determineSorter
     * Private function. Used to determine which sorting method to use
     * 
     * Parameters:
     * data - the data to sort
     * sort - string telling the function which sorter to use
     * col - the column to sort by
     * fn - the comparison function to use in the sort
     */
    _determineSorter: function(data, sort, col, fn){
        switch (sort) {
		    case 'quick':
		        return new Jx.Sort.Quicksort(data, fn, col);
		        break;
		    case 'merge':
		        return new Jx.Sort.Mergesort(data, fn, col);
		        break;
		    case 'heap':
		        return new Jx.Sort.Heapsort(data, fn, col);
		        break;
        }
    }
	
});
