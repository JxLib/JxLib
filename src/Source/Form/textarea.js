/**
 * Class: Jx.Field.Textarea
 * This class represents a textarea field.
 * 
 * These fields are rendered as below.
 * 
 * (code)
 * <div id='' class=''>
 *    <label for=''>A label for the field</label>
 *    <textarea id='' name='' rows='' cols=''>
 *      value/ext
 *    </textarea>
 * </div>
 * (end)
 * 
 */
Jx.Field.Textarea = new Class({
    
    Extends: Jx.Field,
    
    options: {
        rows: null,
        columns: null,
        template: '<label class="jxInputLabel"></label><textarea class="jxInputTextarea"></textarea><span class="jxInputTag"></span>'
    },
    
    type: 'Textarea',
    
    errorClass: 'jxFormErrorTextarea',
    
    /**
     * Constructor: Jx.Field.Textarea
     * Creates the input.
     * 
     * Params:
     * options - see below
     * form - Optional. The form this field is associated to
     * 
     * Options:
     * In addition to all options for Jx.Form.Field, there are
     * 
     * row - the number of rows to show
     * cols - the number of columns to show
     */
    initialize: function (options) {
        this.parent(options);
                
        if ($defined(this.options.rows)) {
            this.field.set('rows', this.options.rows);
        }
        if ($defined(this.options.columns)) {
            this.field.set('cols', this.options.columns);
        }
        
        //TODO: Do we need to use OverText here as well??
        
    }
});