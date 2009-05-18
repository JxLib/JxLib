/**
 * Class: Jx.Sort.Heapsort
 * Implementation of a heapsort algorithm designed to work on <Jx.Store> data.
 * 
 */
Jx.Sort.Heapsort = new Class({
	
    Extends: Jx.Sort,
	
    name: 'heapsort',
	
    /**
     * Method: sort
     * Actually runs the sort on the data
     * 
     * Returns:
     * the sorted data
     */
    sort: function(){
	    this.fireEvent('start');
		
	    var count = this._data.length;
	
	    if (count == 1) return this._data;
		
	    if (count > 2) {
	        this._heapify(count);
		
	        var end = count - 1;
	        while (end > 1) {
	            this._swap(end, 0);
	            end = end - 1;
	            this._siftDown(0, end);
	        }
	    } else {
	        //check then order the two we have
	        if ((this._comparator((this._data[0]).get(this._col),(this._data[1]).get(this._col)) > 0)) {
	            this._swap(0,1);
	        }
	    }
		
	    this.fireEvent('stop');
	    return this._data;
    },
	
    /**
     * Method: _heapify
     * Private function. Puts the data in Max-heap order
     * 
     * Parameters:
     * count - the number of records we're sorting
     */
    _heapify: function(count){
        var start = Math.round((count - 2)/2);
		
        while (start >= 0) {
            this._siftDown(start,count-1);
            start = start - 1;
        }
    },
	
    /**
     * Method: _siftDown
     * Private function. 
     * 
     * Parameters:
     * start - the beginning of the sort range
     * end - the end of the sort range
     */
    _siftDown: function(start, end){
        var root = start;
		
        while (root*2 <= end) {
            var child = root *2;
            if ((child + 1 < end)&& (this._comparator((this._data[child]).get(this._col),(this._data[child+1]).get(this._col)) < 0)) {
                child = child + 1;
            }
            if ((this._comparator((this._data[root]).get(this._col),(this._data[child]).get(this._col)) < 0)){
                this._swap(root,child);
                root = child;
            } else {
                return;
            }
        }
    }
	
});