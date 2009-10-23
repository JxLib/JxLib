// $Id: $
/**
 * Class: Jx.Form
 * 
 * Extends: <Jx.Widget>
 * 
 * A class that represents an HTML form. You add fields using either Jx.Form.add() 
 * or by using the field's .addTo() method. You can get all form values or set them 
 * using this class. It also handles validation of fields. 
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
Jx.Form = new Class({
	
	Extends: Jx.Widget,
	
	options: {
        /**
         * Option: method
         * the method used to submit the form
         */
		method: 'post',
		/**
         * Option: action
         * where to submit it to
         */
		action: '',
		/**
         * Option: fileUpload
         * whether this form handles file uploads or not. 
         */
		fileUpload: false,
		/**
         * Option: id
         * the id of this form
         */
		id: null,
		/**
         * Option: formClass
         */
		formClass: null,
		/**
         * Option: name
         * the name property for the form
         */
		name: '',
		/**
         * Option: validationOptions
         * options for determining validation behavior. See docs for mootools-more's
         * FormValidator for valid options.
         */
		validationOptions: {
            validateOnSubmit: false
        },
        /**
         * Option: errors
         * Error object used to determine error message settings
         */
		errors: {
            /**
             * Option: showErrorMessages
             * How errors are shown. Values are 'together', 'individual', or 'both'.
             * If 'together' then all errors are shown at the top of the page. If
             * 'individual' then errors are only noted by the fields. 'both' will do both.
             * In any case, a class will be added to the invalid field that can be used
             * to style the field however you wish.
             */
		    showErrorMessages: 'together',
		    /**
		     * Option: messageStyle
		     * Determines how error messages are displayed. Values are
		     * either 'text', 'tip', or 'none'. 'text' shows the error in a span that 
		     * you can style. 'tip' shows just an icon that when hovered will
		     * pop up a tooltip with the error message. 'none' will not show
		     * any message so that the form's caller can handle errors. In any case,
		     * the input itself will have a class of 'jxFieldInvalid' added to it.
		     */
            messageStyle: 'text',
            /**
             * Option: displayError
             * Whether to display only a single error or all of them in the message.
             * Valid values are 'single' or 'all'.
             */
            displayError: 'all'
        }
	},

	/**
     * Property: fields
     * An array of all of the single fields (not contained in a fieldset) for this form
     */
    fields : new Hash(),
    /**
     * Property: validator
     * Holds a reference to the FormValidator instance
     */
    validator : null,
    /**
     * Property: errors
     * an array of error objects
     */
    errors : new Hash(),
    /**
     * Property: errorMessages
     * An element representing the error messages for this form.
     */
    errorMessages : null,
    /**
     * Property: pluginNamespace
     * required variable for plugins
     */
    pluginNamespace: 'Form',

    /**
     * APIMethod: render
     * Constructs the form but does not add it to anything to be shown. The caller
     * should use form.addTo() to add the form to the DOM.
     */
    render : function () {
        //create the form first
        this.domObj = new Element('form', {
            'method' : this.options.method,
            'action' : this.options.action,
            'class' : 'jxForm',
            'name' : this.options.name
        });
        
        if (this.options.fileUpload) {
            this.domObj.set('enctype', 'multipart/form-data');
        }
        if ($defined(this.options.id)) {
            this.domObj.set('id', this.options.id);
        }
        if ($defined(this.options.formClass)) {
            this.domObj.addClass(this.options.formClass);
        }
    },

    /**
     * APIMethod: enableValidation
     * Call this method after adding the form to the DOM to enable
     * validation of the form
     * 
     */
    enableValidation : function () {
        this.validator = new Form.Validator(this.domObj,
                this.options.validationOptions);
        this.validator.addEvents({
            'onElementValidate' : this.elementValidator.bind(this),
            'onElementPass' : this.elementPassed.bind(this),
            'onElementFail' : this.elementFailed.bind(this)
        });
    },

    /**
     * APIMethod: addField
     * Adds a <Jx.Field> subclass to this form's fields hash
     * 
     * Parameters:
     * field - <Jx.Field> to add
     */
    addField : function (field) {
        this.fields.set(field.id, field);
    },

    /**
     * Method: elementValidator
     * Event handler called when a specific element fails or passes
     * a specific validator. It is used to automatically add the error
     * to the field class and display errors is needed
     * 
     * Parameters:
     * isValid - {boolean} indicates whether validator passed or not
     * field - {Element} the element that was being validated
     * className - {string} the name of the validator
     * warn - {boolean} whether this should be a warning (not really used)
     */
    elementValidator : function (isValid, field, className, warn) {
        var validator = this.validator.getValidator(className);
        var fld = field.retrieve('field');
        var errors;
        if (!isValid && validator.getError(field)) {
            var err = validator.getError(field);
            fld.addError(err, className);
            if (!this.errors.has(fld.name)) {
                this.errors.set(fld.name, new Hash());
            }
            errors = this.errors.get(fld.name);
            errors.set(className, err);
        } else {
            fld.clearError(className);
            if (this.errors.has(fld.name)) {
                errors = this.errors.get(fld.name);
                if (errors.has(className)) {
                    errors.erase(className);
                }
                if ($defined(this.errorMessages)) {
                    this.showErrors();
                }
            }
        }
    },
    
    /**
     * Method: elementPassed
     * event handler for when a single element passes all validators
     * 
     * Parameters:
     * field - an Element representing the passed field
     */ 
    elementPassed : function (field) {
        var fld = field.retrieve('field');
        fld.clearErrors();
    },

    /**
     * Method: elementFailed
     * event handler for when a single element fails validation
     * 
     * Parameters:
     * field - an Element representing the failed field
     */
    elementFailed : function (field) {
        var fld = field.retrieve('field');
        fld.showErrors(this.options.errors);
    },

    /**
     * Method: isValid
     * Determines if the form passes validation
     * 
     * Parameters:
     * evt - the Mootools event object
     */
    isValid : function (evt) {
        var valid = this.validator.validate(evt);
        if (!valid) {
            this.showErrors();
        } else {
            this.clearErrors();
        }
        return valid;
    },

    /**
     * APIMethod: getValues
     * Gets the values of all the fields in the form as a Hash object. This 
     * uses the mootools function Element.toQueryString to get the values and 
     * will either return the values as a querystring or as an object (using 
     * mootools-more's String.parseQueryString method).
     * 
     * Parameters:
     * asQueryString - {boolean} indicates whether to return the value as a 
     *                  query string or an object.
     */
    getValues : function (asQueryString) {
        var queryString = this.domObj.toQueryString();
        if ($defined(asQueryString)) {
            return queryString;
        } else {
            return queryString.parseQueryString();
        }
    },
    /**
     * APIMethod: setValues
     * Used to set values on the form
     * 
     * Parameters:
     * values - A Hash of values to set keyed by field name.
     */
    setValues : function (values) {
        //TODO: This may have to change with change to getValues().
        if (Jx.type(values) === 'object') {
            values = new Hash(values);
        }
        this.fields.each(function (item) {
            item.setValue(values.get(item.name));
        }, this);
    },

    /**
     * APIMethod: showErrors
     * Displays all of the errors in the error object at the top of the form.
     */
    showErrors : function () {
        if (this.options.errors.showErrorMessages === 'together'
                || this.options.errors.showErrorMessages === 'both') {
            if ($defined(this.errorMessages)) {
                this.errorMessages.empty();
            } else {
                this.errorMessages = new Element('div', {
                    'id' : 'error-messages',
                    'class' : 'jxFormErrors'
                });
            }
            var errs = new Element('ul');
            this.errors.each(function (errors, name) {
                var nameEl = new Element('li', {
                    'html' : name
                });
                nameEl.inject(errs);
                var msgs = new Element('ul');
                msgs.inject(nameEl);
                errors.each(function (message) {
                    var li = new Element('li', {
                        'html' : message
                    });
                    li.inject(msgs);
                }, this);
            }, this);
            errs.inject(this.errorMessages);
            this.errorMessages.inject(this.domObj, 'top');
        }
        
    },
    /**
     * APIMethod: clearError
     * Clears the error message from the top of the form.
     */
    clearErrors : function () {
        if ($defined(this.errorMessages)) {
            this.errorMessages.dispose();
        }
        this.errors.empty();
    },

    /**
     * APIMethod: add
     * 
     * Parameters:
     * Pass as many parameters as you like. However, they should all be
     * <Jx.Field> objects.
     */
    add : function () {
        var field;
        for (var x = 0; x < arguments.length; x++) {
            field = arguments[x];
            //add form to the field and field to the form if not already there
            if (field instanceof Jx.Field && !$defined(field.form)) {
                field.form = this;
                this.addField(field);
            }
            this.domObj.grab(field);
        }
        return this;
    },
    
    /**
     * APIMethod: reset
     * 
     */
    reset : function () {
        this.fields.each(function (field, name) {
            field.reset();
        }, this);
        this.clearErrors();
    }
});
