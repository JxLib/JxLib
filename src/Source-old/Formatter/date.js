/*
---

name: Jx.Formatter.Date

description: Formats dates using the mootools-more Date extensions

license: MIT-style license.

requires:
 - More/Date.Extras
 - Jx.Formatter

provides: [Jx.Formatter.Date]
...
 */
// $Id$
/**
 * Class: Jx.Formatter.Date
 *
 * Extends: <Jx.Formatter>
 *
 * This class formats dates using the mootools-more's
 * Date extensions. See the -more docs for details of
 * supported formats for parsing and formatting.
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
Jx.Formatter.Date = new Class({

    Extends: Jx.Formatter,
    Family: "Jx.Formatter.Date",

    options: {
        /**
         * Option: format
         * The format to use. See the mootools-more Date
         * extension documentation for details on supported
         * formats
         */
        format: '%B %d, %Y'
    },
    /**
     * APIMethod: format
     * Does the work of formatting dates
     *
     * Parameters:
     * value - the text to format
     */
    format: function (value) {
        var d = Date.parse(value);
        return d.format(this.options.format);
    }
});