/**
 * Class: Jx.Store.Groupable
 * Extension of sortable store that allows grouping records by columns
 * 
 * Extends: 
 * <Jx.Store.Sortable>
 * 
 * Options:
 * In addition to the options in <Jx.Store.Sortable>, this store has
 * 
 * sortCols - an array of column names in the order that they are grouped by
 */
Jx.Store.Groupable = new Class({
	
    Extends: Jx.Store.Sortable,
	
    options: {
	    // an array of column names to sort by. each group determined by the sort
	    //is then successively sorted by the next column
	    sortCols: []  
    },
	
    /** 
     * Method: groupSort
     * Runs the sorting and grouping
     * 
     * Parameters:
     * sort - the sort type (quick,heap,merge)
     * cols - an array of columns to sort/group by
     */
    groupSort: function(sort, cols){
        var c;
        if ($defined(cols)) {
            c = this.options.sortCols = cols;
        } else if ($defined(this.options.sortCols)) {
            c = this.options.sortCols;
        } else {
            return null;
        }
		
        this._sort = sort;
        //first sort on the first array item
        this.sort(c[0], sort);
		
        c.each(function(item, index, array){
            if (index != 0) {
                this._subSort(this._data, array[index-1], item);
            }
        },this);
		
    },
	
    /**
     * Method: _subSort
     * Private function. Does the actual group sorting.
     * 
     * Parameters:
     * data - what to sort
     * groupByCol - the column that determines the groups
     * sortCol - the column to sort by
     * 
     * returns:
     * the result of the grouping/sorting
     */
    _subSort: function(data, groupByCol, sortCol){
        //loop through the data array and create another array with just the
        //items for each group. Sort that sub-array and then concat it 
        //to the result.
        var result = [];
        var sub = [];
		
        var group = data[0].get(groupByCol);
        this._sorter.setCol(sortCol);
        for (var i = 0; i < data.length; i++){
            if (group === (data[i]).get(groupByCol)) {
                sub.push(data[i]);
            } else {
                //sort
                if (sub.length > 1) {
                    result = result.concat(this.sort(sortCol, this._sort, sub, true));
                } else {
                    result = result.concat(sub);
                }
                //change group
                group = (data[i]).get(groupByCol);
                //clear sub
                sub.empty();
                //add to sub
                sub.push(data[i]);
            }
        }
		
        if (sub.length > 1) {
            this._sorter.setData(sub);
            result = result.concat(this.sort(sortCol, this._sort, sub, true));
        } else {
            result = result.concat(sub);
        }
			
		
        this._data = result;	
    }
	
	
});