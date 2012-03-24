/*
---

name: Jx.Formatter.Phone

description: Formats phone numbers in US format including area code

license: MIT-style license.

requires:
 - Jx.Formatter


provides: [Jx.Formatter.Phone]

...
 */
// $Id$
/**
 * Class: Jx.Formatter.Phone
 *
 * Extends: <Jx.Formatter>
 *
 * Formats data as phone numbers. Currently only US-style phone numbers
 * are supported.
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
define("jx/formatter/phone", ['../../base','../formatter'],
       function(base, Formatter){
    
    var phone = new Class({

        Extends: Formatter,
        family: "Jx.Formatter.Phone",
    
        options: {
            /**
             * Option: useParens
             * Whether to use parenthesis () around the area code.
             * Defaults to true
             */
            useParens: true,
            /**
             * Option: separator
             * The character to use as a separator in the phone number.
             * Defaults to a dash '-'.
             */
            separator: "-"
        },
        /**
         * APIMethod: format
         * Format the input as a phone number. This will strip all non-numeric
         * characters and apply the current default formatting
         *
         * Parameters:
         * value - the text to format
         */
        format : function (value) {
            //first strip any non-numeric characters
            var sep = this.options.separator;
            var v = '' + value;
            v = v.replace(/[^0-9]/g, '');
    
            //now check the length. For right now, we only do US phone numbers
            var ret = '';
            if (v.length === 11) {
                //do everything including the leading 1
                ret = v.charAt(0);
                v = v.substring(1);
            }
            if (v.length === 10) {
                //do the area code
                if (this.options.useParens) {
                    ret = ret + "(" + v.substring(0, 3) + ")";
                } else {
                    ret = ret + sep + v.substring(0, 3) + sep;
                }
                v = v.substring(3);
            }
            //do the rest of the number
            ret = ret + v.substring(0, 3) + sep + v.substring(3);
            return ret;
        }
    });
    
    if (base.global) {
        base.global.Formatter.Phone = phone;
    }
    
    return phone;
    
});