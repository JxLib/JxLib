/**
 * Class: Jx.Field.Select
 * This class represents a form select field.
 * 
 * These fields are rendered as below.
 * 
 * (code)
 * <div id='' class=''>
 *    <label for=''>A label for the field</label>
 *    <select id='' name=''>
 *      <option value='' selected=''>text</option>
 *    </select>
 * </div>
 * (end)
 * 
 */

Jx.Field.Select = new Class({
    
    Extends: Jx.Field,
    
    options: {
        comboOpts: null,
        template: '<label class="jxInputLabel"></label><select class="jxInputSelect"></select><span class="jxInputTag"></span>'
    },
    
    type: 'Select',
    
    /**
     * Constructor: Jx.Field.Select
     * Creates a select field.
     * 
     * Params:
     * options - see below
     * form - Optional. The form this field is associated with.
     * 
     * Options:
     * In addition to all options for Jx.Field, there are
     * 
     * comboOpts - Optional, defaults to null. When type is 'combo' this option sets the different select options available.
     *      format: [{value:'', selected: true|false, text:''},...]
     */
    initialize: function(options, form){
        this.parent(options);
        
        if ($defined(this.options.comboOpts)){
            this.options.comboOpts.each(function(item){
                opt = new Element('option',{
                    'value': item.value,
                    'html': item.text
                });
                if ($defined(item.selected) && item.selected){
                    opt.set("selected","selected");
                }
                this.field.grab(opt);
            },this);
        }
    },
    
    /**
     * Method: setValue
     * Sets the value property of the field
     * 
     * Parameters:
     * v - The value to set the field to.
     */
    setValue: function(v){
        //loop through the options and set the one that matches v
        this.field.options.each(function(opt){
            if (opt.value == v){
                $(opt).set("selected",true);
            }
        },this);
    },
    
    /**
     * Method: getValue
     * Returns the current value of the field. If the field is a checkbox or 
     * radiobutton then the field must be "checked" in order to return a value.
     * Otherwise it returns null.
     */
    getValue: function(){
        var index = this.field.get("selectedIndex");
        return $(this.field.options[index]).get("value");
    }
});