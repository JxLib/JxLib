// $Id$
/**
 * Class: Jx.Formatter.Currency
 *
 * Extends: <Jx.Formatter.Number>
 *
 * This class formats numbers as US currency. It actually
 * runs the value through Jx.Formatter.Number first and then
 * updates the returned value as currency.
 *
 * Example:
 * (code)
 * (end)
 * 
 * MooTools.lang Keys:
 * - 'formatter.currency'.sign
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter.Currency = new Class({

    Extends: Jx.Formatter.Number,

    options: {},
    /**
     * APIMethod: format
     * Takes a number and formats it as currency.
     *
     * Parameters:
     * value - the number to format
     */
    format: function (value) {

        this.options.precision = 2;

        value = this.parent(value);

        //check for negative
        var neg = false;
        if (value.contains('(') || value.contains('-')) {
            neg = true;
        }

        var ret;
        if (neg && !this.options.useParens) {
            ret = "-" + MooTools.lang.get('Jx','formatter.currency').sign + value.substring(1, value.length);
        } else {
            ret = MooTools.lang.get('Jx','formatter.currency').sign + value;
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