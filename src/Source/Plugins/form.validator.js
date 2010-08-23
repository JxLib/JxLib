/*
---

name: Jx.Plugin.Form.Validator

description: Provides validation services for Jx.Form

license: MIT-style license.

requires:
 - Jx.Plugin.Form
 - Jx.Plugin.Field.Validator

provides: [Jx.Plugin.Form.Validator]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Form.Validator
 *
 * Extends: <Jx.Plugin>
 *
 * Form plugin for enforcing validation on the fields in a form.
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner.
 * Parts inspired by mootools-more's Form.Validator class
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Form.Validator = new Class({

    Extends : Jx.Plugin,
    name: 'Form.Validator',

    options: {
        /**
         * Option: fields
         * This will be key/value pairs for each of the fields as shown here:
         * (code)
         * {
         *     fieldID: {
         *          ... options for Field.Validator plugin ...
         *     },
         *     fieldID: {...
         *     }
         * }
         * (end)
         */
        fields: null,
        /**
         * Option: fieldDefaults
         * {Object} contains named defaults for field validators to be
         * triggered on blur or change.  Default is:
         * (code)
         * {
         *    validateOnBlur: true
         *    validateOnChange: false
         * }
         * (end)
         */
        fieldDefaults: {
            validateOnBlur: true,
            validateOnChange: true
        },
        /**
         * Option: validateOnSubmit
         * {Boolean} default true.  Trigger validation on submission of
         * form if true.
         */
        validateOnSubmit: true,
        /**
         * Option: suspendSubmit
         * {Boolean} default false.  Stop form submission when validator is
         * attached.
         */
        suspendSubmit: false
    },
    /**
     * Property: errorMessagess
     * element holding
     */
    errorMessage: null,
    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function() {
        this.parent();
        this.bound.validate = this.validate.bind(this);
        this.bound.failed = this.fieldFailed.bind(this);
        this.bound.passed = this.fieldPassed.bind(this);
    },
    /**
     * APIMethod: attach
     * Sets up the plugin and connects it to the form
     */
    attach: function (form) {
        if (!$defined(form) && !(form instanceof Jx.Form)) {
            return;
        }
        this.form = form;
        var plugin = this,
            options = this.options;
        //override the isValid function in the form
        form.isValid = function () {
            return plugin.isValid();
        };

        if (options.validateOnSubmit && !options.suspendSubmit) {
            document.id(this.form).addEvent('submit', this.bound.validate);
        } else if (options.suspendSubmit) {
            document.id(this.form).addEvent('submit', function (ev) {
                ev.stop();
            });
        }

        this.plugins = $H();

        //setup the fields
        $H(options.fields).each(function (val, key) {
            var opts = $merge(this.options.fieldDefaults, val),
                fields = this.form.getFieldsByName(key).
                p;
            if (fields && fields.length) {
                p = new Jx.Plugin.Field.Validator(opts);
                this.plugins.set(key, p);
                p.attach(fields[0]);
                p.addEvent('fieldValidationFailed', this.bound.failed);
                p.addEvent('fieldValidationPassed', this.bound.passed);
            }
        }, this);

    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        if (this.form) {
            document.id(this.form).removeEvent('submit');
        }
        this.form = null;
        this.plugins.each(function(plugin){
            plugin.detach();
            plugin = null;
        },this);
        this.plugins = null;
    },
    /**
     * APIMethod: isValid
     * Call this to determine whether the form validates.
     */
    isValid: function () {
        return this.validate();
    },
    /**
     * Method: validate
     * Method that actually does the work of validating the fields in the form.
     */
    validate: function () {
        var valid = true;
        this.errors = $H();
        this.plugins.each(function(plugin){
            if (!plugin.isValid()) {
                valid = false;
                this.errors.set(plugin.field.id,plugin.getErrors());
            }
        }, this);
        if (valid) {
            this.fireEvent('formValidationPassed', [this.form, this]);
        } else {
            this.fireEvent('formValidationFailed', [this.form, this]);
        }
        return valid;
    },
    /**
     * Method: fieldFailed
     * Refires the fieldValidationFailed event from the field validators it contains
     */
    fieldFailed: function (field, validator) {
        this.fireEvent('fieldValidationFailed', [field, validator]);
    },
    /**
     * Method: fieldPassed
     * Refires the fieldValidationPassed event from the field validators it contains
     */
    fieldPassed: function (field, validator) {
        this.fireEvent('fieldValidationPassed', [field, validator]);
    },
    /**
     * APIMethod: getErrors
     * Use this method to get all of the errors from all of the fields.
     */
    getErrors: function () {
        if (!$defined(this.errors)) {
           this.validate();
        }
        return this.errors;
    }


});
