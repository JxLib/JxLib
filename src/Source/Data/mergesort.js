/**
 * class: Jx.Sort.Mergesort
 * Implementation of a mergesort algorithm designed to work on <Jx.Store> data.
 * 
 */
Jx.Sort.Mergesort = new Class({
	
    Extends: Jx.Sort,
	
    name: 'mergesort',
	
    /**
     * Method: sort
     * Actually runs the sort on the data
     * 
     * returns:
     * the sorted data
     */
    sort: function(){
	    this.fireEvent('start');
	    d = this._mergeSort(this._data);
	    this.fireEvent('stop');
	    return d;
		
    },
	
    /**
     * Method: _mergeSort
     * Private function. Does the physical sorting. Called recursively.
     * 
     * Parameters:
     * arr - the array to sort
     * 
     * returns:
     * the sorted array
     */
    _mergeSort: function(arr){
        if (arr.length <= 1) { return arr; }
		
        var middle = (arr.length) / 2;
        var left = arr.slice(0,middle);
        var right = arr.slice(middle);
        left = this._mergeSort(left);
        right = this._mergeSort(right);
        var result = this._merge(left,right);
        return result;
    },
	
    /**
     * Method: _merge
     * Private function. Does the work of merging to arrays in order.
     * 
     * parameters:
     * left - the left hand array
     * right - the right hand array
     * 
     * returns:
     * the merged array
     */
    _merge: function(left, right){
        var result = [];
		
        while (left.length>0 && right.length>0){
            if (this._comparator((left[0]).get(this._col),(right[0]).get(this._col)) <= 0) {
                result.push(left[0]);
                left = left.slice(1);
            } else {
                result.push(right[0]);
                right = right.slice(1);
            }
        }
        while (left.length > 0) {
            result.push(left[0]);
            left = left.slice(1);
        }
        while (right.length > 0) {
            result.push(right[0]);
            right = right.slice(1);
        }
        return result;
    }
	
});