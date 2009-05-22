/**
 * Class: Jx.Sort.Heapsort
 * Implementation of a heapsort algorithm designed to work on <Jx.Store> data.
 * 
 */
Jx.Sort.Nativesort = new Class({
    
    Extends: Jx.Sort,
    
    name: 'nativesort',
    
    /**
     * Method: sort
     * Actually runs the sort on the data
     * 
     * Returns:
     * the sorted data
     */
    sort: function(){
        this.fireEvent('start');
        
        var compare = function(a,b){
            return this._comparator((this._data[a]).get(this._col),(this._data[b]).get(this._col));
        };
        
        this._data.sort(compare);
        this.fireEvent('stop');
        return this._data;
    },

    
});