// $Id: $
/**
 * Class: Jx.Field.Radio
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
 */
Jx.Field.Radio = new Class({
    
    Extends: Jx.Field,
    
    options: {
        /**
         * Option: template
         * The template used to create this field
         */
        template: '<input class="jxInputRadio" type="radio" /><label class="jxInputLabel"></label><span class="jxInputTag"></span>',
        /**
         * Option: checked
         * whether this radio button is checked or not
         */
        checked: false,
        /**
         * Option: clickableLabel
         * Determines whether clicking the label also clicks the button
         */
        clickableLabel: true
    },
    /**
     * Property: type
     * What kind of field this is
     */
    type: 'Radio',
    
    /**
     * Constructor: Jx.Field.Radio
     * Creates a radiobutton input field.
     * 
     * Params:
     * options - <Jx.Field.Radio.Options> and <Jx.Field.Options>
     */
    initialize: function (options) {
        this.parent(options);
        
        if ($defined(this.options.checked) && this.options.checked) {
            this.field.checked = this.options.checked;
        }
        
        if (this.options.clickableLabel) {
            this.label.addEvent('click',this.onClick.bind(this));
            this.label.setStyle('cursor','pointer');
        }
        
    },
    
    /**
     * Method: onClick
     * calls the click function on the field when the label is clicked.
     */
    onClick: function () {
        this.field.click();
    },

    /**
     * APIMethod: setValue
     * Sets the value property of the field
     * 
     * Parameters:
     * v - The value to set the field to, "checked" it should be checked.
     */
    setValue: function (v) {
        if (v === 'checked') {
            this.field.set('checked', "checked");
        } else {
            this.field.erase('checked');
        } 
    },
    
    /**
     * APIMethod: getValue
     * Returns the current value of the field. The field must be "checked" 
     * in order to return a value. Otherwise it returns null.
     */
    getValue: function () {
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
    reset: function () {
        if (this.options.checked) {
            this.field.set('checked', "checked");
        } else {
            this.field.erase('checked');
        }
    }
    
});




