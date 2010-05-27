/*
---

name: Jx.Plugin.Field.Validator

description: Provides validation services for Jx.Field subclasses

license: MIT-style license.

requires:
 - Jx.Plugin.Field
 - More/Form.Validator
 - More/Form.Validator.Extras

provides: [Jx.Plugin.Field.Validator]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Field.Validator
 *
 * Extends: <Jx.Plugin>
 *
 * Field plugin for enforcing validation when a field is not used in a form.
 *
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner.
 * Parts inspired by mootools-more's Form.Validator class
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Field.Validator = new Class({

    Extends : Jx.Plugin,
    name: 'Field.Validator',

    options: {
        /**
         * Option: validators
         * An array that contains either a string that names the predefined
         * validator to use with its needed options or an object that defines
         * the options of an InputValidator (also with needed options) defined
         * like so:
         *
         * (code)
         * {
         *     validatorClass: 'name:with options',    //gets applied to the field
         *     validator: {                         //used to create the InputValidator
         *         name: 'validatorName',
         *         options: {
         *             errorMsg: 'error message',
         *             test: function(field,props){}
         *         }
         *     }
         * }
         * (end)
         */
        validators: [],
        /**
         * Option: validateOnBlur
         * Determines whether the plugin will validate the field on blur.
         * Defaults to true.
         */
        validateOnBlur: true,
        /**
         * Option: validateOnChange
         * Determines whether the plugin will validate the field on change.
         * Defaults to true.
         */
        validateOnChange: true
    },
    /**
     * Property: valid
     * tells whether this field passed validation or not.
     */
    valid: null,
    /**
     * Property: errors
     * array of errors found on this field
     */
    errors: null,
    validators : null,
    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function () {
        this.parent();
        this.errors = [];
        this.validators = new Hash();
        this.bound.validate = this.validate.bind(this);
        this.bound.reset = this.reset.bind(this);
    },
    /**
     * APIMethod: attach
     * Sets up the plugin and connects it to the field
     */
    attach: function (field) {
        if (!$defined(field) && !(field instanceof Jx.Field)) {
            return;
        }
        this.field = field;
        if (this.field.options.required && !this.options.validators.contains('required')) {
            //would have used unshift() but reading tells me it may not work in IE.
            this.options.validators.reverse().push('required');
            this.options.validators.reverse();
        }
        //add validation classes
        this.options.validators.each(function (v) {
            var t = Jx.type(v);
            if (t === 'string') {
                this.field.field.addClass(v);
            } else if (t === 'object') {
                this.validators.set(v.validator.name, new InputValidator(v.validator.name, v.validator.options));
                this.field.field.addClass(v.validatorClass);
            }
        }, this);
        if (this.options.validateOnBlur) {
            this.field.field.addEvent('blur', this.bound.validate);
        }
        if (this.options.validateOnChange) {
            this.field.field.addEvent('change', this.bound.validate);
        }
        this.field.addEvent('reset', this.bound.reset);
    },
    /**
     * APIMethod: detach
     */
    detach: function () {
        if (this.field) {
            this.field.field.removeEvent('blur', this.bound.validate);
            this.field.field.removeEvent('change', this.bound.validate);
        }
        this.field.removeEvent('reset', this.bound.reset);
        this.field = null;
        this.validators = null;
    },

    validate: function () {
        $clear(this.timer);
        this.timer = this.validateField.delay(50, this);
    },

    validateField: function () {
        //loop through the validators
        this.valid = true;
        this.errors = [];
        this.options.validators.each(function (v) {
            var val = (Jx.type(v) === 'string') ? Form.Validator.getValidator(v) : this.validators.get(v.validator.name);
            if (val) {
                if (!val.test(this.field.field)) {
                    this.valid = false;
                    this.errors.push(val.getError(this.field.field));
                }
            }
        }, this);
        if (!this.valid) {
            this.field.domObj.removeClass('jxFieldSuccess').addClass('jxFieldError');
            this.fireEvent('fieldValidationFailed', [this.field, this]);
        } else {
            this.field.domObj.removeClass('jxFieldError').addClass('jxFieldSuccess');
            this.fireEvent('fieldValidationPassed', [this.field, this]);
        }
        return this.valid;
    },

    isValid: function () {
        return this.validateField();
    },

    reset: function () {
        this.valid = null;
        this.errors = [];
        this.field.field.removeClass('jxFieldError').removeClass('jxFieldSuccess');
    },
    /**
     * APIMethod: getErrors
     * USe this method to retrieve all of the errors noted for this field.
     */
    getErrors: function () {
        return this.errors;
    }


});
