/*
---

name: Jx.Formatter.Boolean

description: Formats boolean input

license: MIT-style license.

requires:
 - Jx.Formatter

provides: [Jx.Formatter.Boolean]
...
 */
// $Id$
/**
 * Class: Jx.Formatter.Boolean
 *
 * Extends: <Jx.Formatter>
 *
 * This class formats boolean values. You supply the
 * text values for true and false in the options.
 *
 * Example:
 * (code)
 * (end)
 *
 * Locale Keys:
 * - 'formatter.boolean'.true
 * - 'formatter.boolean'.false
 * 
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
define("jx/formatter/boolean", ['../../base','../formatter'],
       function(base, Formatter){

    var Boolean = new Class({

        Extends: Formatter,
        Family: "Jx.Formatter.Boolean",
    
        options: {},
        /**
         * APIMethod: format
         * Takes a value, determines boolean equivalent and
         * displays the appropriate text value.
         *
         * Parameters:
         * value - the text to format
         */
        format : function (value) {
            var b = false;
            var t = typeOf(value);
            switch (t) {
            case 'string':
                if (value === 'true') {
                    b = true;
                }
                break;
            case 'number':
                if (value !== 0) {
                    b = true;
                }
                break;
            case 'boolean':
                b = value;
                break;
            default:
                b = true;
            }
            return b ? this.getText({set:'Jx',key:'formatter.boolean',value:'true'}) : this.getText({set:'Jx',key:'formatter.boolean',value:'false'});
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
    
    if (base.global) {
        base.global.Formatter.Boolean = Boolean;
    }
    
    return Boolean;
});