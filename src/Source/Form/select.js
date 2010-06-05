/*
---

name: Jx.Field.Select

description: Represents a select, or drop down, input

license: MIT-style license.

requires:
 - Jx.Field

provides: [Jx.Field.Select]

...
 */
// $Id$
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
         * Option: multiple
         * {Boolean} optional, defaults to false.  If true, then the select
         * will support multi-select
         */
        mulitple: false,
        /**
         * Option: size
         * {Integer} optional, defaults to 1.  If set, then this specifies
         * the number of rows of the select that are visible
         */
        size: 1,
        /**
         * Option: comboOpts
         * Optional, defaults to null. if not null, this should be an array of
         * objects formated like [{value:'', selected: true|false,
         * text:''},...]
         */
        comboOpts: null,
        /**
         * Option: optGroups
         * Optional, defaults to null. if not null this should be an array of
         * objects defining option groups for this select. The comboOpts and
         * optGroups options are mutually exclusive. optGroups will always be
         * shown if defined.
         *
         * define them like [{name: '', options: [{value:'', selected: '',
         * text: ''}...]},...]
         */
        optGroups: null,
        /**
         * Option: template
         * The template for creating this select input
         */
        template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><select class="jxInputSelect" name="{name}"></select><span class="jxInputTag"></span></span>'
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
        this.field.addEvent('change', function() {this.fireEvent('change', this);}.bind(this));
        if ($defined(this.options.multiple)) {
          this.field.set('multiple', this.options.multiple);
        }
        if ($defined(this.options.size)) {
          this.field.set('size', this.options.size);
        }
        if ($defined(this.options.optGroups)) {
            this.options.optGroups.each(function(group){
                var gr = new Element('optGroup');
                gr.set('label',group.name);
                group.options.each(function(option){
                    var opt = new Element('option', {
                        'value': option.value,
                        'html': this.getText(option.text)
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
                this.addOption(item);
            }, this);
        }
    },

    /**
     * Method: addOption
     * add an option to the select list
     *
     * Parameters:
     * item - The option to add.
     * position (optional) - an integer index or the string 'top'.
     *                     - default is to add at the bottom.
     */
    addOption: function (item, position) {
        var opt = new Element('option', {
            'value': item.value,
            'html': this.getText(item.text)
        });
        if ($defined(item.selected) && item.selected) {
            opt.set("selected", "selected");
        }
        var where = 'bottom';
        var field = this.field;
        if ($defined(position)) {
            if (Jx.type(position) == 'integer' &&
                (position >= 0  && position < field.options.length)) {
                field = this.field.options[position];
                where = 'before';
            } else if (position == 'top') {
                where = 'top';
            }

        }
        opt.inject(field, where);
    },

    /**
     * Method: removeOption
     * removes an option from the select list
     *
     * Parameters:
     *  item - The option to remove.
     */
    removeOption: function (item) {
        //TBD
    },
    /**
     * Method: setValue
     * Sets the value property of the field
     *
     * Parameters:
     * v - The value to set the field to.
     */
    setValue: function (v) {
        if (!this.options.readonly) {
            //loop through the options and set the one that matches v
            $$(this.field.options).each(function (opt) {
                if (opt.get('value') === v) {
                    document.id(opt).set("selected", true);
                }
            }, this);
        }
    },

    /**
     * Method: getValue
     * Returns the current value of the field.
     */
    getValue: function () {
        var index = this.field.selectedIndex;
        //check for a set "value" attribute. If not there return the text
        if (index > -1) {
            var ret = this.field.options[index].get("value");
            if (!$defined(ret)) {
                ret = this.field.options[index].get("text");
            }
            return ret;
        }
    },
    
    /**
     * APIMethod: empty
     * Empties all options from this select
     */
    empty: function () {
        if ($defined(this.field.options)) {
            $A(this.field.options).each(function (option) {
                this.field.remove(option);
            }, this);
        }
    }
});