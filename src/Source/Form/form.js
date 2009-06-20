/**
 * Class: Jx.Form
 * A class that represents an HTML form. It can construct the form based
 * on the fields passed in. It will also validate the form before outputting 
 * the values. The user of this form class will be responsible for send/saving 
 * the form values.
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
		
		showErrorMessages: 'together',
		validationOptions: {
            validateOnSubmit: false,
            
        },
		messageStyle: 'together',
		displayError: 'single',
		
		buttons: ['submit','cancel','reset'],
		buttonAlign: 'left',
		buttonLoc: 'bottom',
		
		//events
		onFormsubmit: $empty,
		onFormcancel: $empty,
		onFormvalidation: $empty
	},
	/**
	 * Property: buttonBar
	 * The Jx.Toolbar holding the buttons (submit, cancel, reset, etc..)
	 */
	buttonBar: null,
	/**
	 * Property: fields
	 * An array of all of the single fields (not contained in a fieldset) for this form
	 */
	fields: new Hash(),
	/**
	 * Property: validator
	 * Holds a reference to the FormValidator instance
	 */
	validator: null,
	/**
	 * Property: errors
	 * an array of error objects
	 */
	errors: new Hash(),
	/**
	 * Property: errorMessages
	 * An element representing the error messages for this form.
	 */
	errorMessages: null,
	
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
	initialize: function(options){
		this.setOptions(options);
		
		//create the form first
		var f = new Element('form',{
			'method': this.options.method,
			'action': this.options.action,
			'class': 'jxForm',
			'name': this.options.name
		});
		
		
		if ($defined(this.options.id)){
			f.set('id',this.options.id);
		}
		if ($defined(this.options.cssClass)){
			f.addClass(this.options.cssClass);
		}
		
		if ($defined(this.options.buttons)) {
			
			buttonContainer = new Jx.Toolbar.Container();
			var toolbar = new Jx.Toolbar();
			toolbar.addTo(buttonContainer);
			this.options.buttons.each(function(item){
				if (item instanceof Jx.Button) {
					toolbar.add(item);
				} else {
					t = $type(item);
					switch (t) {
						case "string":
							i = this.createButton(item);
							toolbar.add(i);
							break;
						case "object":
							i = new Jx.Button(item);
							toolbar.add(i);
							break;
					}
				}
			}, this);
			buttonContainer.inject(f, this.options.buttonLoc);
		}
		this.domObj = f;
	},
	
	enableValidation: function(){
	    this.validator = new FormValidator(this.domObj,this.options.validationOptions);
	    this.validator.addEvents({
	        'onElementValidate':this.elementFailedValidator.bind(this),
	        'onElementPass': this.elementPassed.bind(this),
	        'onElementFail': this.elementFailed.bind(this)
	    });
	},
	
	addField: function(field){
	    this.fields.set(field.name,field);
	},
	
	elementFailedValidator: function(isValid, field, className, warn){
	    var validator = this.getValidator(className);
	    var name = field.get('name');
        var fld = this.fields.get(name);
        if (!isValid && validator.getError(field)){
            var err = validator.getError(field);
            fld.addError(err);
            if (!this.errors.has(name)){
                this.errors.set(name,[]);
            }
            var errors = this.errors.get(name);
            errors.push(err);
        }
	},
	
	elementPassed: function(field){
	    var fld = this.fields.get(field.get('name'));
	    fld.clearErrors();
	},
	
	elementFailed: function(field){
	    var fld = this.fields.get(field.get('name'));
	    fld.showErrors();
	},
	
	/**
	 * Method: createButton
	 * Creates a preconfigured button for the form
	 * 
	 * Parameters:
	 * b - a string indicating what kind of button to create. One of "submit",
	 * 		"cancel", or "reset"
	 */
	createButton: function(b){
		switch (b){
			case "submit":
				return new Jx.Button({
					label: 'Submit',
					onClick: this.submit.bindWithEvent(this)
				});
				break;
			case "cancel":
				return new Jx.Button({
					label: 'Cancel',
					onClick: this.cancel.bindWithEvent(this)
				});
				break;
			case "reset":
				return new Jx.Button({
					label: 'Reset',
					onClick: this.reset.bindWithEvent(this)
				});
				break;
		}
	},
	/**
	 * Method: submit
	 * Called when the pre-defined submit button is pressed.
	 * 
	 * Parameters:
	 * obj - The object the method is called on
	 * evt - The mootools event object
	 */
	submit: function(obj, evt){
		
		if (this.isValid(evt)){
			if ($defined(this.errorMessages) && (this.errorMessages.getStyle('visibility') !== 'hidden')){
				this.errorMessages.setStyle('visibility','hidden');
			}
			vals = this.getValues();
			this.fireEvent('formsubmit',[this,vals]);
		} else {
			this.showErrors();
		}
	},
	/**
	 * Method: isValid
	 * Determines if the form passes validation
	 */
	isValid: function(evt){
		return this.validator.validate(evt);
	},
	/**
	 * Method: cancel
	 * Called when the pre-defined cancel button is pressed.
	 * 
	 * Parameters:
	 * obj - The object the method is called on
	 * evt - The mootools event object
	 */
	cancel: function(obj, evt){
		this.fireEvent('formcancel',this);
	},
	/**
	 * Method: reset
	 * Called when the pre-defined reset button is pressed.
	 * 
	 * Parameters:
	 * obj - The object the method is called on
	 * evt - The mootools event object
	 */
	reset: function(obj, evt){
		this.fields.each(function(item){
			item.reset();
		},this);
		this.fireEvent('formreset',this);
	},
	/**
	 * Method: getValues
	 * Gets the values of all the fields in the form as a Hash object.
	 */
	getValues: function(){
		var vals = new Hash();
		this.fields.each(function(item){
			v = item.getValue();
			if ($defined(v)) {
				vals.set(item.name, v);
			}
		},this);
		return vals;
	},
	/**
	 * Method: setValues
	 * Used to set values on the form
	 * 
	 * Parameters:
	 * values - A Hash of values to set keyed by field name.
	 */
	setValues: function(values){
	    if ($type(values) === 'object'){
	        values = new Hash(values);
	    }
		this.fields.each(function(item){
			item.setValue(values.get(item.name));
		},this);
	},
	
	/**
	 * Method: showErrors
	 * Displays all of the errors in the error object at the top of the form.
	 */
	showErrors: function(){
		if (this.options.showErrorMessages === 'together' || this.options.showErrorMessages === 'both') {
			if ($defined(this.errorMessages)) {
				this.errorMessages.empty();
			} else {
				this.errorMessages = new Element('div', {
					'id': 'error-messages',
					'class': 'jxFormErrors'
				});
			}
			errs = new Element('ul');
			this.errors.each(function(errors,name){
				nameEl = new Element('li', {
					'html': name
				});
				nameEl.inject(errs);
				msgs = new Element('ul');
				msgs.inject(nameEl);
				errors.each(function(message){
					new Element('li', {
						'html': message
					}).inject(msgs);
				}, this);
			}, this);
			errs.inject(this.errorMessages);
			this.errorMessages.inject(this.domObj, 'top');
		}
		if (this.options.showErrorMessages === 'individual' || this.options.showErrorMessages === 'both') {
			//set single messages
			this.fields.each(function(field, name){
				field.showErrors();
			},this);
		} 
	},
	/**
	 * Method: clearError
	 * Private Method. Clears the error message from the top of the form.
	 */
	clearError: function(){
		if ($defined(this.errorMessages)) {
			this.errorMessages.dispose();
		}
		this.errors.empty();
	}
});
