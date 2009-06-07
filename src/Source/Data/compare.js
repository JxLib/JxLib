/**
 * Class: Jx.Compare
 * Class that holds functions for doing comparison operations.
 * This class requires the clientside Date() extensions (deps/date.js).
 * 
 * notes:
 * Each function that does a comparison returns
 * 
 * 0 - if equal.
 * 1 - if the first value is greater that the second.
 * -1 - if the first value is less than the second.
 */

Jx.Compare = new Class({
    Extends: Jx.Object,
	
    options: { separator: '.' },
	
    /**
     * Constructor: Jx.Compare
     * initializes this class
     * 
     * Parameters: 
     * options - class options as listed below
     * 
     * Options:
     * separator - the decimal character in numbers
     */
    initialize: function(options){
        this.parent(options);
    },
	
    /**
     * Method: alphanumeric
     * Compare alphanumeric variables. This is case sensitive
     * 
     * Parameters:
     * a - a value
     * b - another value
     */
    alphanumeric: function(a,b){
        return (a==b) ?0:(a<b)?-1:1;
    },
	
    /**
     * Method: numeric
     * Compares numbers
     *
     * Parameters:
     * a - a number
     * b - another number
     */
    numeric: function(a,b){
        return this.alphanumeric(this._convert(a),this._convert(b));
    },
	
    /**
     * Method: _convert
     * Normalizes numbers relative to the separator.
     * 
     * Parameters:
     * val - the number to normalize
     * 
     * Returns:
     * the normalized value
     */
    _convert: function(val){
        if ($type(val) == 'string') {
            val = parseFloat(val.replace(/^[^\d\.]*([\d., ]+).*/g,"$1").replace(new RegExp("[^\\\d"+this.options.separator+"]","g"),'').replace(/,/,'.')) || 0;
        }
        return val || 0;
    },
	
    /**
     * Method: ignorecase
     * Compares to alphanumeric strings without regard to case.
     * 
     * Parameters:
     * a - a value
     * b - another value
     */
    ignorecase: function(a,b){
        return this.alphanumeric((""+a).toLowerCase(), (""+b).toLowerCase());
    },
	
    /**
     * Method: currency
     * Compares to currency values.
     * 
     * Parameters:
     * a - a currency value without the $
     * b - another currency value without the $
     */
    currency: function(a,b){
        return this.numeric(a,b);
    },
	
    /**
     * Method: date
     * Compares 2 date values (either a string or an object)
     * 
     * Parameters:
     * a - a date value 
     * b - another date value
     */
    date: function(a,b){
        x = new Date().parse(a);
        y = new Date().parse(b);
        return (x < y)?-1:(x>y)?1:0
    }
	
});