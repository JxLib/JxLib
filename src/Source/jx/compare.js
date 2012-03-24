/*
---

name: Jx.Compare

description: Class that provides functions for comparing various data types. Used by the Jx.Sort class and it's descendants

license: MIT-style license.

requires:
 - Jx.Object
 - More/Date.Extras

provides: [Jx.Compare]

...
 */
// $Id$
/**
 * Class: Jx.Compare
 *
 * Extends: <Jx.Object>
 *
 * Class that holds functions for doing comparison operations.
 * This class requires the mootools-more Date() extensions.
 *
 * notes:
 * Each function that does a comparison returns
 *
 * 0 - if equal.
 * 1 - if the first value is greater that the second.
 * -1 - if the first value is less than the second.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */

define("jx/compare", ['../base','./object'], function(base, jxObject){
    
    var compare = new Class({
        Extends: jxObject,
        Family: 'Jx.Compare',
    
        options: { separator: '.' },
    
        /**
         * APIMethod: alphanumeric
         * Compare alphanumeric variables. This is case sensitive
         *
         * Parameters:
         * a - a value
         * b - another value
         */
        alphanumeric: function (a, b) {
            return (a === b) ? 0 :(a < b) ? -1 : 1;
        },
    
        /**
         * APIMethod: numeric
         * Compares numbers
         *
         * Parameters:
         * a - a number
         * b - another number
         */
        numeric: function (a, b) {
            return this.alphanumeric(this.convert(a), this.convert(b));
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
        convert: function (val) {
            if (typeOf(val) === 'string') {
                var neg = false;
                if (val.substr(0,1) == '-') {
                    neg = true;
                }
                val = parseFloat(val.replace(/^[^\d\.]*([\d., ]+).*/g, "$1").replace(new RegExp("[^\\\d" + this.options.separator + "]", "g"), '').replace(/,/, '.')) || 0;
                if (neg) {
                    val = val * -1;
                }
            }
            return val || 0;
        },
    
        /**
         * APIMethod: ignorecase
         * Compares to alphanumeric strings without regard to case.
         *
         * Parameters:
         * a - a value
         * b - another value
         */
        ignorecase: function (a, b) {
            return this.alphanumeric(("" + a).toLowerCase(), ("" + b).toLowerCase());
        },
    
        /**
         * APIMethod: currency
         * Compares to currency values.
         *
         * Parameters:
         * a - a currency value without the $
         * b - another currency value without the $
         */
        currency: function (a, b) {
            return this.numeric(a, b);
        },
    
        /**
         * APIMethod: date
         * Compares 2 date values (either a string or an object)
         *
         * Parameters:
         * a - a date value
         * b - another date value
         */
        date: function (a, b) {
            var x = new Date().parse(a),
                y = new Date().parse(b);
            return (x < y) ? -1 : (x > y) ? 1 : 0;
        },
        /**
         * APIMethod: boolean
         * Compares 2 bolean values
         *
         * Parameters:
         * a - a boolean value
         * b - another boolean value
         */
        'boolean': function (a, b) {
            return (a === true && b === false) ? -1 : (a === b) ? 0 : 1;
        }
    
    });
    
    if (base.global) {
        base.global.Compare = compare;
    }
    
    return compare;
    
});