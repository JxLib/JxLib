// $Id: $
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
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Formatter.Boolean = new Class({
    
    Extends: Jx.Formatter,
    
    options: {
        /**
         * Option: true
         * The text to display for true values
         */
        'true': 'Yes',
        /**
         * Option: false
         * The text to display for false values
         */
        'false': 'No'
    },
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
        var t = $type(value);
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
        return b ? this.options['true'] : this.options['false'];
    }
    
});