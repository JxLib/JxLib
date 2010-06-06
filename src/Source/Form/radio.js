/*
---

name: Jx.Field.Radio

description: Represents a radio button input

license: MIT-style license.

requires:
 - Jx.Field

provides: [Jx.Field.Radio]

...
 */
// $Id$
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
        template: '<span class="jxInputContainer"><input class="jxInputRadio" type="radio" name="{name}"/><label class="jxInputLabel"></label><span class="jxInputTag"></span></span>',
        /**
         * Option: checked
         * whether this radio button is checked or not
         */
        checked: false,

        labelSeparator: ''
    },
    /**
     * Property: type
     * What kind of field this is
     */
    type: 'Radio',

    /**
     * APIMethod: render
     * Creates a radiobutton input field.
     */
    render: function () {
        this.parent();

        if ($defined(this.options.checked) && this.options.checked) {
            if (Browser.Engine.trident) {
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

        // add click event to toggle the radio buttons
        this.label.addEvent('click', function(ev) {
          this.field.checked ? this.setValue(false) : this.setValue(true);
        }.bind(this));

    },

    /**
     * APIMethod: setValue
     * Sets the value property of the field
     *
     * Parameters:
     * v - The value to set the field to, "checked" it should be checked.
     */
    setValue: function (v) {
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




