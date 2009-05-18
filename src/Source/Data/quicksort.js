/**
 * Class: Jx.Sort.Quicksort
 * Implementation of a quicksort algorithm designed to work on <Jx.Store> data.
 */
Jx.Sort.Quicksort = new Class({
	
    Extends: Jx.Sort,
	
    name: 'quicksort',
	
    /**
     * Method: sort
     * Actually runs the sort on the data
     * 
     * returns:
     * the sorted data
     */
    sort: function(left,right){
	    this.fireEvent('start');
		
	    if (!$defined(left)){
	        left = 0;
	    }
	    if (!$defined(right)){
	        right = this._data.length - 1;
	    }
		
	    this._quicksort(left, right);
		
	    this.fireEvent('stop');
		
	    return this._data;
		
    },
	
    /** 
     * Method: _quicksort
     * Private function. Initiates the sorting. Is called recursively
     * 
     * Parameters:
     * left - the left hand, or lower, bound of the sort
     * right - the right hand, or upper, bound of the sort
     */
    _quicksort: function(left, right){
        if (left >= right) { return; }
		
        var index = this._partition(left, right);
        this._quicksort(left, index - 1);
        this._quicksort(index + 1, right);
    },
	
    /**
     * Method: _partition
     * Private function.
     * 
     * Parameters:
     * left - the left hand, or lower, bound of the sort
     * right - the right hand, or upper, bound of the sort
     */
    _partition: function(left, right){
        this._findMedianOfMedians(left, right);
        var pivotIndex = left;
        var pivotValue = (this._data[pivotIndex]).get(this._col);
        var index = left;
        var i;
		
        this._swap(pivotIndex, right)
        for (i = left; i < right; i++) {
            if (this._comparator((this._data[i]).get(this._col), pivotValue) < 0) {
                this._swap(i, index);
                index = index + 1;
            }
        }
        this._swap(right, index);
		
        return index;
		
    },
	
    /**
     * Method: _findMedianOfMedians
     * Private function.
     * 
     * Parameters:
     * left - the left hand, or lower, bound of the sort
     * right - the right hand, or upper, bound of the sort
     */
    _findMedianOfMedians: function(left, right){
        if (left == right) {return this._data[left];}
		
        var i; var shift = 1;
        while (shift <= (right - left)){
            for (i=left; i <= right; i+=shift*5){
                var endIndex = (i + shift*5 - 1 < right)? i + shift*5 - 1 : right;
                var medianIndex = this._findMedianIndex(i, endIndex, shift);
				
                this._swap(i, medianIndex);
            }
            shift *= 5;
        }
	
        return this._data[left];
    },
	
    /**
     * Method: _findMedianIndex
     * Private function.
     * 
     * Parameters:
     * left - the left hand, or lower, bound of the sort
     * right - the right hand, or upper, bound of the sort
     */
    _findMedianIndex: function(left, right, shift){
        var groups = Math.round((right - left)/shift + 1);
        var k = Math.round(left + groups/2*shift);
        if (k > this._data.length-1) {
            k = this._data.length-1;
        }
        for (var i=left; i < k; i+=shift){
            var minIndex = i;
            var v = this._data[minIndex];
            var minValue = v.get(this._col);
			
            for (var j = i; j <= right; j+=shift){
                if (this._comparator((this._data[j]).get(this._col),minValue) < 0){
                    minIndex = j;
                    minValue = (this._data[minIndex]).get(this._col);
                }
            }
            this._swap(i, minIndex);
        }
		
        return k;
    }
});
