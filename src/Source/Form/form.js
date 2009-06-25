/**
 * Class: Jx.Form
 * A class that represents an HTML form. You add fields using either Jx.Form.add() 
 * or by using the field's .addTo() method. You can get all form values or set them 
 * using this class. It also handles validation of fields. 
 *    
 * 
 */
Jx.Form = new Class({
	
	Extends: Jx.Widget,
	
	options: {
		method: 'post',
		action: '',
		fileUpload: false,    //not yet supported
		id: null,
		formClass: null,
		name: '',
		validationOptions: {
            validateOnSubmit: false
        },
        
		errors: {
		    showErrorMessages: 'together',
            messageStyle: 'text',
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
     * Constructor: Jx.Form
     * Constructs the form but does not add it to anything to be shown. The caller
     * should use form.addTo() to add the form to the DOM.
     * 
     * Parameters:
     * options - {Object} an options object as described below.
     * 
     * Options:
     * method - the method used to submit the form
     * action - where to submit it to
     * fileUpload - whether this form handles file uploads or not. 
     *    			NOTE: not currently implemented
     * id - the id of this form
     * name - the name property for the form
     * formClass - a CSS class used to style the form (in addition to the standard)
     * showErrorMessages - How errors are shown. Values are 'together', 'individual', or 'both'.
     * 					   If 'together' then all errors are shown at the top of the page. If
     * 					   'individual' then errors are only noted by the fields. 'both' will do both.
     * 					   In any case, a class will be added to the invalid field that can be used
     * 					   to style the field however you wish. The default styling will be
     * 					   to change the background to red.
     * validationOptions - options for determining validation behavior. See docs for mootools-more's
     *                   FormValidator for valid options.
     * messageStyle - Determines how error messages are displayed. Values are
     *                either 'text', 'tip', or 'none'. 'text' shows the error in a span that 
     *                you can style. 'tip' shows just an icon that when hovered will
     *                pop up a tooltip with the error message. 'none' will not show
     *                any message so that the form's caller can handle errors. In any case,
     *                the input itself will have a class of 'jxFieldInvalid' added to it.
     * displayError - Whether to display only a single error or all of them in the message.
     *                Valid values are 'single' or 'all'.
     * buttons - An array of buttons. This can either contain the standard, prepackaged buttons
     * 			 which are 'submit','cancel', and 'reset' or you can pass in your own objects as
     * 			 either configs or instantiated Jx.Button instances. If you do pass in your own, you will
     * 			 need to handle the submitting, canceling, and resetting of your form as is appropriate
     * 			 for your application.
     * buttonLoc - Tells whether the buttons are placed at the 'top' or 'bottom' of the form. Default is 'bottom'.
     */
    initialize : function (options) {
        this.setOptions(options);

        //create the form first
        this.domObj = new Element('form', {
            'method' : this.options.method,
            'action' : this.options.action,
            'class' : 'jxForm',
            'name' : this.options.name
        });

        if ($defined(this.options.id)) {
            this.domObj.set('id', this.options.id);
        }
        if ($defined(this.options.formClass)) {
            this.domObj.addClass(this.options.formClass);
        }
    },

    enableValidation : function () {
        this.validator = new FormValidator(this.domObj,
                this.options.validationOptions);
        this.validator.addEvents({
            'onElementValidate' : this.elementFailedValidator.bind(this),
            'onElementPass' : this.elementPassed.bind(this),
            'onElementFail' : this.elementFailed.bind(this)
        });
    },

    addField : function (field) {
        this.fields.set(field.id, field);
    },

    elementFailedValidator : function (isValid, field, className, warn) {
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

    elementPassed : function (field) {
        var fld = field.retrieve('field');
        fld.clearErrors();
    },

    elementFailed : function (field) {
        var fld = field.retrieve('field');
        fld.showErrors(this.options.errors);
    },

    /**
     * Method: isValid
     * Determines if the form passes validation
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
     * Method: getValues
     * Gets the values of all the fields in the form as a Hash object. This
     * function doesn't account for arrayed names (i.e. 'user[]' or 'user[password]')
     * but will need to be enhanced for this use case.
     */
    getValues : function () {
        var vals = new Hash();
        this.fields.each(function (item) {
            var v = item.getValue();
            if ($defined(v)) {
                vals.set(item.name, v);
            }
        }, this);
        return vals;
    },
    /**
     * Method: setValues
     * Used to set values on the form
     * 
     * Parameters:
     * values - A Hash of values to set keyed by field name.
     */
    setValues : function (values) {
        if ($type(values) === 'object') {
            values = new Hash(values);
        }
        this.fields.each(function (item) {
            item.setValue(values.get(item.name));
        }, this);
    },

    /**
     * Method: showErrors
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
     * Method: clearError
     * Private Method. Clears the error message from the top of the form.
     */
    clearErrors : function () {
        if ($defined(this.errorMessages)) {
            this.errorMessages.dispose();
        }
        this.errors.empty();
    },

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
        
    reset : function () {
        this.fields.each(function (field, name) {
            field.reset();
        }, this);
        this.clearErrors();
    }
});
