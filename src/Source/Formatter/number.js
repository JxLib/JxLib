/*
---

name: Jx.Formatter.Number

description: Formats numbers including negative and floats

license: MIT-style license.

requires:
 - Jx.Formatter

provides: [Jx.Formatter.Number]

...
 */
// $Id$
/**
 * Class: Jx.Formatter.Number
 *
 * Extends: <Jx.Formatter>
 *
 * This class formats numbers. You can have it do the following
 *
 * o replace the decimal separator
 * o use/add a thousands separator
 * o change the precision (number of decimal places)
 * o format negative numbers with parenthesis
 *
 * Example:
 * (code)
 * (end)
 * 
 * Locale Keys:
 * - 'formatter.number'.decimalSeparator
 * - 'formatter.number'.thousandsSeparator
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter.Number = new Class({

    Extends: Jx.Formatter,
    Family: "Jx.Formatter.Number",

    options: {
        /**
         * Option: precision
         * The number of decimal places to round to
         */
        precision: 2,
        /**
         * Option: useParens
         * Whether negative numbers should be done with parenthesis
         */
        useParens: true,
        /**
         * Option: useThousands
         * Whether to use the thousands separator
         */
        useThousands: true
    },
    /**
     * APIMethod: format
     * Formats the provided number
     *
     * Parameters:
     * value - the raw number to format
     */
    format : function (value) {
            //first set the decimal
        if (Jx.type(value) === 'string') {
                //remove commas from the string
            var p = value.split(',');
            value = p.join('');
            value = value.toFloat();
        }
        value = value.toFixed(this.options.precision);

        //split on the decimalSeparator
        var parts = value.split('.');
        var dec = true;
        if (parts.length === 1) {
            dec = false;
        }
        //check for negative
        var neg = false;
        var main;
        var ret = '';
        if (parts[0].contains('-')) {
            neg = true;
            main = parts[0].substring(1, parts[0].length);
        } else {
            main = parts[0];
        }

        if (this.options.useThousands) {
            var l = main.length,
                left = l % 3,
                j = 0,
                ts = this.getText({set:'Jx',key:'formatter.number',value:'thousandsSeparator'});
            for (var i = 0; i < l; i++) {
                ret = ret + main.charAt(i);
                if (i === left - 1 && i !== l - 1) {
                    ret = ret + ts;
                } else if (i >= left) {
                    j++;
                    if (j === 3 && i !== l - 1) {
                        ret = ret + ts;
                        j = 0;
                    }
                }

            }
        } else {
            ret = parts[0];
        }

        if (dec) {
            ret = ret + this.getText({set:'Jx',key:'formatter.number',value:'decimalSeparator'}) + parts[1];
        }
        if (neg && this.options.useParens) {
            ret = "(" + ret + ")";
        } else if (neg && !this.options.useParens) {
            ret = "-" + ret;
        }

        return ret;
    },
    
    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     * 
     * Parameters:
     * lang - the language being changed to or that had it's data set of 
     * 		translations changed.
     */
    changeText: function (lang) {
        this.parent();
    }
});