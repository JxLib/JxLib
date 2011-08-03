/*
---

name: Jx.Field.Check

description: Represents a checkbox input

license: MIT-style license.

requires:
 - Jx.Field

provides: [Jx.Field.Checkbox]

...
 */
// $Id$
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
    Family: "Jx.Field.Checkbox",

    options : {
        /**
         * Option: template
         * The template used for rendering this field
         */
        template : '<span class="jxInputContainer"><input class="jxInputCheck" type="checkbox" name="{name}"/><label class="jxInputLabel"></label><span class="jxInputTag"></span></span>',
        /**
         * Option: checked
         * Whether this field is checked or not
         */
        checked : false,

        labelSeparator: ''
    },
    /**
     * Property: type
     * The type of this field
     */
    type : 'Check',

    /**
     * APIMethod: render
     * Creates a checkbox input field.
    */
    render : function () {
        this.parent();

        if (this.options.checked !== undefined && this.options.checked !== null && this.options.checked) {
            if (Browser.ie) {
                var parent = this.field.getParent();
                var sibling;
                if (parent) {
                    sibling = this.field.getPrevious();
                }
                this.field.setStyle('visibility','hidden');
                this.field.inject(document.id(document.body));
                this.field.checked = true;
                this.field.defaultChecked = true;
                this.field.dispose();
                this.field.setStyle('visibility','visible');
                if (sibling) {
                    this.field.inject(sibling, 'after');
                } else if (parent) {
                    this.field.inject(parent, 'top');
                }
            } else {
                this.field.set("checked", "checked");
                this.field.set("defaultChecked", "checked");
            }
        }

        // add click event to the label to toggle the checkbox
        if(this.label) {
          this.label.addEvent('click', function(ev) {
            this.setValue(this.getValue() !== null ? false : true);
          }.bind(this));
        }
    },

    /**
     * APIMethod: setValue
     * Sets the value property of the field
     *
     * Parameters:
     * v - Whether the box shouldbe checked or not. "checked" or "true" if it should be checked.
     */
    setValue : function (v) {
        if (!this.options.readonly) {
            if (v === 'checked' || v === 'true' || v === true) {
                this.field.set('checked', "checked");
            } else {
                this.field.erase('checked');
            }
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
    },

    getChecked: function () {
        return this.field.get("checked");
    }

});
