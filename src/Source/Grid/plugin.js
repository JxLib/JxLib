/**
 * Class: Jx.Grid.Plugin
 * Base class for all grid plugins. In order for a plugin to be used it must 
 * extend from this class
 * 
 * copyright 2009 by Jonathan Bomgardner
 * MIT style license
 */
Jx.Plugin = new Class({
    
    Extends: Jx.Object,
    
    options: {},
    
    initialize: function (options) {
        this.parent(options);
    },
    
    init: $empty
    
});