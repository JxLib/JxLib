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
	    d = this.mergeSort(this.data);
	    this.fireEvent('stop');
	    return d;
		
    },
	
    /**
     * Method: mergeSort
     * Private function. Does the physical sorting. Called recursively.
     * 
     * Parameters:
     * arr - the array to sort
     * 
     * returns:
     * the sorted array
     */
    mergeSort: function(arr){
        if (arr.length <= 1) { return arr; }
		
        var middle = (arr.length) / 2;
        var left = arr.slice(0,middle);
        var right = arr.slice(middle);
        left = this.mergeSort(left);
        right = this.mergeSort(right);
        var result = this.merge(left,right);
        return result;
    },
	
    /**
     * Method: merge
     * Private function. Does the work of merging to arrays in order.
     * 
     * parameters:
     * left - the left hand array
     * right - the right hand array
     * 
     * returns:
     * the merged array
     */
    merge: function(left, right){
        var result = [];
		
        while (left.length>0 && right.length>0){
            if (this.comparator((left[0]).get(this.col),(right[0]).get(this.col)) <= 0) {
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