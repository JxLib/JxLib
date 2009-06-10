/**
 * Class: Jx.Formatter
 * Base class used for specific implementations to coerce data into specific formats
 */
Jx.Formatter = new Class({
    
    Extends: Jx.Object,
    
    initialize: function(options){
        this.parent(options);
    },
    
    format: $empty
});