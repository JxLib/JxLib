// $Id: $
/**
 * Class: Jx.Field.Select
 * 
 * Extends: <Jx.Field>
 * 
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

Jx.Field.Select = new Class({
    
    Extends: Jx.Field,
    
    options: {
        /**
         * Options: comboOpts
         * Optional, defaults to null. if not null, this should be an array of objects 
         * formated like [{value:'', selected: true|false, text:''},...]
         */
        comboOpts: null,
        /**
         * Option: template
         * The template for creating this select input
         */
        template: '<label class="jxInputLabel"></label><select class="jxInputSelect"></select><span class="jxInputTag"></span>'
    },
    /**
     * Property: type
     * Indictes this type of field.
     */
    type: 'Select',
    
    /**
     * Constructor: Jx.Field.Select
     * Creates a select field.
     * 
     * Parameters:
     * options - <Jx.Field.Select.Options> and <Jx.Field.Options>
     */
    initialize: function (options) {
        this.parent(options);
        
        if ($defined(this.options.comboOpts)) {
            this.options.comboOpts.each(function (item) {
                var opt = new Element('option', {
                    'value': item.value,
                    'html': item.text
                });
                if ($defined(item.selected) && item.selected) {
                    opt.set("selected", "selected");
                }
                this.field.grab(opt);
            }, this);
        }
    },
    
    /**
     * Method: setValue
     * Sets the value property of the field
     * 
     * Parameters:
     * v - The value to set the field to.
     */
    setValue: function (v) {
        //loop through the options and set the one that matches v
        this.field.options.each(function (opt) {
            if (opt.value === v) {
                document.id(opt).set("selected", true);
            }
        }, this);
    },
    
    /**
     * Method: getValue
     * Returns the current value of the field.
     */
    getValue: function () {
        var index = this.field.get("selectedIndex");
        return document.id(this.field.options[index]).get("value");
    }
});