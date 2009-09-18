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
         * Option: comboOpts
         * Optional, defaults to null. if not null, this should be an array of objects 
         * formated like [{value:'', selected: true|false, text:''},...]
         */
        comboOpts: null,
        /**
         * Option: optGroups
         * Optional, defaults to null. if not null this should be an array of objects
         * defining option groups for this select. The comboOpts and optGroups options
         * are mutually exclusive. optGroups will always be shown if defined.
         * 
         * define them like [{name: '', options: [{value:'', selected: '', text: ''}...]},...]
         */
        optGroups: null,
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
     * APIMethod: render
     * Creates a select field.
     */
    render: function () {
        this.parent();
        
        if ($defined(this.options.optGroups)) {
            this.options.optGroups.each(function(group){
                var gr = new Element('optGroup');
                gr.set('label',group.name);
                group.options.each(function(option){
                    var opt = new Element('option', {
                        'value': option.value,
                        'html': option.text
                    });
                    if ($defined(option.selected) && option.selected) {
                        opt.set("selected", "selected");
                    }
                    gr.grab(opt);
                },this);
                this.field.grab(gr);
            },this);
        } else if ($defined(this.options.comboOpts)) {
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
        $$(this.field.options).each(function (opt) {
            if (opt.get('value') === v) {
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