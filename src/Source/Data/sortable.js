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
	    separator: '.'		//passed to an instance of Jx.Compare
    },
    
    sorters: {
      quick: "Quicksort",
      merge: "Mergesort",
      heap: "Heapsort",
      native: "Nativesort"
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
    sort: function(col, sort, data, ret, options){
        options = {} || options;
        
        sort = (sort) ? this.sorters[sort] : this.sorters[this.options.defaultSort];
        data = data ? data : this._data;
		ret = ret ? true : false;
		
        if (!$defined(this._comparator)) {
            this._comparator = new Jx.Compare({
                separator: this.options.separator
            });
        }
		
        this._col = col = this._resolveCol(col);
		
        var fn = this._comparator[this.options.colTypes[col]].bind(this._comparator);
        this._sorter = new Jx.Sort[sort](data, fn, col, options);
        var d = this._sorter.sort();
		
        if (ret){
            return d;
        } else {
            this._data = d;
        }
    }
	
});
