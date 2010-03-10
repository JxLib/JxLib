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
        'true': MooTools.lang.get('Jx','formatter.boolean')['true'],
        /**
         * Option: false
         * The text to display for false values
         */
        'false': MooTools.lang.get('Jx','formatter.boolean')['false']
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
        var t = Jx.type(value);
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
    	this.options['true'] = MooTools.lang.get('Jx','formatter.boolean')['true'];
        this.options['false'] = MooTools.lang.get('Jx','formatter.boolean')['false'];
    }

});