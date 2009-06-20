
/**
 * Class: Jx.Field.Hidden
 * This class represents a radio input field. 
 */
Jx.Field.Hidden = new Class({
    
    Extends: Jx.Field,
    
    options: {
        template: '<input class="jxInputHidden" type="hidden" />',
        checked: false
    },
    
    type: 'Hidden',
    
    /**
     * Constructor: Jx.Field.Hidden
     * Creates a hidden input field.
     * 
     * Params:
     * options - see below
     * 
     * Options:
     * Same as <Jx.Form.Field>
     */
    initialize: function(options){
        this.parent(options);
        
    }
    
});




