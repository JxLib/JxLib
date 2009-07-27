// $Id: $
/**
 * Class: Jx.Grid.Plugin
 * 
 * Extend: <Jx.Object>
 * 
 * Base class for all plugins. In order for a plugin to be used it must 
 * extend from this class.
 * 
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Plugin = new Class({
    
    Extends: Jx.Object,
    
    Family: "Jx.Plugin",
    
    options: {},
    /**
     * Constructor: Jx.Plugin
     * Initializes the plugin.
     * 
     * Parameters:
     * options - <Jx.Plugin.Options> and <Jx.Object.Options>
     */
    initialize: function (options) {
        this.parent(options);
    },
    /**
     * APIMethod: init
     * Empty method that must be overridden by subclasses. It is 
     * called by the user of the plugin to setup the plugin for use.
     */
    init: $empty
    
});