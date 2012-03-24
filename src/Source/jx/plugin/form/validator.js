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
define("jx/plugin/form/validator", ['../../../base','../../plugin','../../form','../field/validator'],
       function(base, Plugin, Form, Validator){
    
    var validator = new Class({

        Extends : Plugin,
        Family: "Jx.Plugin.Form.Validator",
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
            this.bound.finish = this.finishSetup.bind(this);
            this.bound.fieldAdded = this.onFieldAdded.bind(this);
        },
        /**
         * APIMethod: attach
         * Sets up the plugin and connects it to the form
         */
        attach: function (form) {
            if (form === undefined || form === null || !instanceOf(form, Form)) {
                return;
            }
    
            this.parent(form);        
            
            this.form = form;
            var plugin = this;
            //override the isValid function in the form
            form.isValid = function () {
                return plugin.isValid();
            };
    
            this.plugins = {};
            
            if (this.form.ready === true) {
                this.finishSetup();
            } else {
               form.addEvent('postRender',this.bound.finish);
            }
            
            //we also need to listen for added fields so we can setup validators
            //if they are needed.
            form.addEvent('fieldAdded',this.bound.fieldAdded);
    
        },
        
        finishSetup: function(){
            var options = this.options;
            //setup the fields
            Object.each(options.fields, function (val, key) {
                var opts = Object.merge({},options.fieldDefaults, val),
                    fields = this.form.getFieldsByName(key),
                    p;
                if (fields && fields.length) {
                    p = new Validator(opts);
                    this.plugins[key] = p;
                    p.attach(fields[0]);
                    fields[0].addEvent('fieldValidationFailed', this.bound.failed);
                    fields[0].addEvent('fieldValidationPassed', this.bound.passed);
                }
            }, this);
            
            if (options.validateOnSubmit && !options.suspendSubmit) {
                document.id(this.form).addEvent('submit', this.bound.validate);
            } else if (options.suspendSubmit) {
                document.id(this.form).addEvent('submit', function (ev) {
                    ev.stop();
                });
            }
        },
        /**
         * APIMethod: onFieldAdded
         * Event handler for the form's fieldAdded event. Handles attaching
         * Field.Validator instances to the field as they are added if needed.
         */
        onFieldAdded: function(field,form) {
            if (this.options.fields[field.name] !== undefined &&
                this.options.fields[field.name] !== null) {
                var opts = Object.merge({},this.options.fieldDefaults, this.options.fields[field.name]),
                    p = new Validator(opts);
                this.plugins[field.name] = p;
                p.attach(field);
                field.addEvent('fieldValidationFailed', this.bound.failed);
                field.addEvent('fieldValidationPassed', this.bound.passed);
            }
        },
        
        /**
         * APIMethod: detach
         */
        detach: function() {
            if (this.form) {
                document.id(this.form).removeEvent('submit');
            }
            this.form = null;
            Object.each(this.plugins, function(plugin){
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
            this.errors = {};
            Object.each(this.plugins, function(plugin){
                if (!plugin.isValid()) {
                    valid = false;
                    this.errors[plugin.field.id] = plugin.getErrors();
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
            this.form.fireEvent('fieldValidationFailed', [field, validator]);
        },
        /**
         * Method: fieldPassed
         * Refires the fieldValidationPassed event from the field validators it contains
         */
        fieldPassed: function (field, validator) {
            this.form.fireEvent('fieldValidationPassed', [field, validator]);
        },
        /**
         * APIMethod: getErrors
         * Use this method to get all of the errors from all of the fields.
         */
        getErrors: function () {
            if (this.errors !== undefined && this.errors !== null) {
               this.validate();
            }
            return this.errors;
        }
    
    
    });
    
    if (base.global) {
        base.global.Plugin.Form.Validator = validator;
    }
    
    return validator;
});
