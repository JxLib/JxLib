/**
 * Class: Jx.Field.Text
 * This class represents a text input field.
 */
Jx.Field.Text = new Class({
    
    Extends: Jx.Field,
    
    options: {
        overText: null,
        template: '<label class="jxInputLabel"></label><input class="jxInputText" type="text" /><span class="jxInputTag"></span>'
    },
    
    type: 'Text',
    
    /**
     * Constructor: Jx.Field.Text
     * Creates a text input field.
     * 
     * Params:
     * options - see below
     * form - Optional. The form this field is associated to
     * 
     * Options:
     * In addition to all options for Jx.Form.Field, there are
     * 
     * overText - an object holding options for mootools-more's OverText class. Leave it null to 
     *            not enable it, make it an object to enable.
     */
    initialize: function(options){
        this.parent(options);
        
        //create the overText instance if needed
        if ($defined(this.options.overText)){
            var opts = $extend({},this.options.overText);
            this.field.set('alt',this.options.tip);
            this.overText = new OverText(this.field,opts);
            this.overText.show();
        }
        
    }
    
});