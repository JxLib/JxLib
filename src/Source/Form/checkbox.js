// $Id: $
/**
 * Class: Jx.Field.Check
 * 
 * Extends: <Jx.Field>
 * 
 * This class represents a radio input field.
 * 
 * Example:
 * (code)
 * (end)
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 * 
 */
Jx.Field.Checkbox = new Class({
    
    Extends : Jx.Field,

    options : {
        /**
         * Option: template
         * The template used for rendering this field
         */
        template : '<input class="jxInputCheck" type="checkbox"/><label class="jxInputLabel"></label><span class="jxInputTag"></span>',
        /**
         * Option: checked
         * Whether this field is checked or not
         */
        checked : false,
        /**
         * Option: clickableLabel
         * Determines whether clicking the label also clicks the button
         */
        clickableLabel: true,
        
        labelSeparator: ''
    },
    /**
     * Property: type
     * The type of this field
     */
    type : 'Check',
    
    /**
     * Constructor: Jx.Field.Check 
     * Creates a checkbox input field.
     * 
     * Params: 
     * options - <Jx.Field.Checkbox.Options> and <Jx.Field.Options>
     */
    initialize : function (options, form) {
        this.parent(options, form);
    
        if ($defined(this.options.checked) && this.options.checked) {
            if (Browser.Engine.trident) {
                this.field.setStyle('display', 'none');
                this.field.inject(document.body);
                this.field.set("checked", "checked");
                this.field.dispose();
            } else {
                this.field.set("checked", "checked");
            }
        }
        
        if (this.options.clickableLabel) {
            this.label.addEvent('click', (function () {
                this.field.click();
            }).bind(this));
        }
    
    },
    
    /**
     * APIMethod: setValue 
     * Sets the value property of the field
     * 
     * Parameters: 
     * v - The value to set the field to, "checked" if it should be checked.
     */
    setValue : function (v) {
        if (v === 'checked') {
            this.field.set('checked', "checked");
        } else {
            this.field.erase('checked');
        }
    },
    
    /**
     * APIMethod: getValue 
     * Returns the current value of the field. The field must be
     * "checked" in order to return a value. Otherwise it returns null.
     */
    getValue : function () {
        if (this.field.get("checked")) {
            return this.field.get("value");
        } else {
            return null;
        }
    },
    
    /**
     * APIMethod: reset
     * Sets the field back to the value passed in the original
     * options. no IE hack is implemented because the field should
     * already be in the DOM when this is called.
     */
    reset : function () {
        if (this.options.checked) {
            this.field.set('checked', "checked");
        } else {
            this.field.erase('checked');
        }
    }
    
});
