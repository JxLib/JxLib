
/**
 * Class: Jx.Field.Check
 * This class represents a radio input field. 
 */
Jx.Field.Checkbox = new Class({
    
    Extends: Jx.Field,
    
    options: {
        template: '<input class="jxInputCheck" type="checkbox"/><label class="jxInputLabel"></label><span class="jxInputTag"></span>',
        checked: false
    },
    
    type: 'Check',
    
    /**
     * Constructor: Jx.Field.Check
     * Creates a radiobutton input field.
     * 
     * Params:
     * options - see below
     * 
     * Options:
     * In addition to all options for Jx.Form.Field, there are
     * 
     *  checked - {true|false} whether this radio is selected (checked) or not.
     */
    initialize: function(options,form){
        this.parent(options,form);
        
        if ($defined(this.options.checked)){
            this.field.set("checked","checked");
        }
        
    },
    

    /**
     * Method: setValue
     * Sets the value property of the field
     * 
     * Parameters:
     * v - The value to set the field to, "checked" if a checkbox
     *      or radiobutton should be checked.
     */
    setValue: function(v){
        if (v === 'checked') {
            this.field.set('checked', "checked");
        } else {
            this.field.erase('checked');
        } 
    },
    
    /**
     * Method: getValue
     * Returns the current value of the field. If the field is a checkbox or 
     * radiobutton then the field must be "checked" in order to return a value.
     * Otherwise it returns null.
     */
    getValue: function(){
        if (this.field.get("checked")) {
            return this.field.get("value");
        } else {
            return null;
        }
    },
    
    /**
     * Method: reset
     * Sets the field back to the value passed in the original
     * options
     */
    reset: function(){
        if (this.options.checked) {
            this.field.set('checked', "checked");
        } else {
            this.field.erase('checked');
        }
    }
    
});




