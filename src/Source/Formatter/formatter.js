 // $Id: $
/**
 * Class: Jx.Formatter
 * 
 * Extends: <Jx.Object>
 * 
 * Base class used for specific implementations to coerce data into specific formats
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
Jx.Formatter = new Class({
    
    Extends: Jx.Object,
    
    /**
     * Constructor: Jx.Formatter
     * Initializes the formatter options. Can be overridden by 
     * child classes for more specific functionality
     * 
     * Parameters:
     * options - <Jx.Formatter.Options> and <Jx.Object.Options>
     */
    initialize: function (options) {
        this.parent(options);
    },
    /**
     * APIMethod: format
     * Empty method that must be overridden by subclasses to provide
     * the needed formatting functionality.
     */
    format: $empty
});