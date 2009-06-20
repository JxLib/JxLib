/**
 * Class: Jx.Field
 * This class is the base class for all form fields. 
 * 
 * The class will also allow for validation of the field.
 * 
 */
Jx.Field = new Class({
	
    Extends: Jx.Widget,
	
	options: {
        
        id: null,
		name: null,
		
		label: null,
		labelSeparator: ":",
		value: null,
		tag: null,
		tip: null,
		
		template: null,
 		
 		containerClass: null,
 		labelClass: null,
 		fieldClass: null,
 		tagClass: null,
		validatorClasses: null,
		
		required: false,
        requiredText: '*',
		readonly: false,
		disabled: false
		
	},
	
	errorClass: 'jxFormErrorText',
	
	overtextOptions: {
	    element: 'label'
	},
	
	/**
	 * Property: field
	 * An element representing the input field itself. 
	 */
	field: null,
	/**
	 * Property: label
	 * A reference to the label element for this field
	 */
	label: null,
	/**
	 * Property: tag
	 * A reference to the "tag" field of this input if available 
	 */
	tag: null,
	/**
	 * Property: name
	 * The name of this field.
	 */
	name: null,
	/**
	 * Property: overText
	 * The overText instance for this field.
	 */
	overText: null,
	/**
	 * Property: type
	 * Indicates that this is a field type
	 */
	type: 'field',
	/**
	 * Property: classes
	 * The classes to search for in the template. Not required, but we look for them.
	 */
	classes: ['jxInputLabel','jxInputTag'],
	
	/**
	 * Constructor: Jx.Field
	 * 
	 * Params:
	 * {Object} options
	 * 
	 * Options:
	 * id -The ID of the field
	 * name - The name of the field (used when submitting to the server). 
	 * 		Will also be used for the name attribute of the field.
	 * label - The text that goes next to the field
	 * labelSeparator - a character to use as the separator between the label and the input. make it 
	 *                  an empty string for no separator.
	 * value - a default value to populate the field with
	 * tag - a string to use as the HTML of the tag element (default is a <span> element)
	 * tip - a string that will eventually serve as a tooltip for an input field. Currently only
	 *       implemented as OverText for text fields.
	 * containerClass - a CSS class that will be added to the containing element. 
	 * labelClass - a CSS to add to the label
	 * fieldClass - a CSS class to add to the input field
	 * tagClass - a CSS class to add to the tag field
	 * validatorClasses - a string containing the validator information to add to the field. 
	 *             See the mootools-more FormValidator and FormValidator.Extras documentation for
	 *             documentation.
	 * required - Whether the field is required. Setting this to true will 
     *      trigger the addition of a "required" class (s-form-required) and
     *      the form will not submit until it is filled in and validates.
     * requiredText - Text to be displayed if a field is required. It is added as an <em> 
     *                element inside the <label>.
     * readonly - {True|False} defaults to false. Whether this field is readonly.
     * disabled - {True|False} defaults to false. Whether this field is disabled.
	 * 
	 */
	initialize: function(options){
	    this.parent(options);
	    
		this.name = this.options.name;
		
		//first the container
		this.domObj = new Element('div',{
			'class': 'jxInputContainer'
		});
		if ($defined(this.options.cssClass)){
			this.domObj.addClass(options.containerClass);
		}
		if ($defined(this.options.required) && this.options.required){
			this.domObj.addClass('jxFieldRequired');
		}
		
		var field = 'jxInput'+this.type;
		this.classes.push(field);
		var els = this.processTemplate(this.options.template,this.classes, this.domObj);
        
        //LABEL
        if (els.has('jxInputLabel')){
            this.label = els.get('jxInputLabel');
            if ($defined(this.options.labelClass)){
                this.label.addClass(this.options.labelClass);
            }
            if ($defined(this.options.label)){
                this.label.set('html',this.options.label + this.options.labelSeparator);
            }
            if ($defined(this.options.id)){
                this.label.set('for',this.options.id);
            } else if ($defined(this.options.name)){
                this.label.set('for',this.options.name);
            }
    		if (this.options.required){
    			em = new Element('em', {
    				'html': this.options.requiredText,
    				'class': 'required'
    			});
    			em.inject(this.label);
    		}
        }
        
        //FIELD
		if (els.has(field)){
		    this.field = els.get(field);
		    if ($defined(this.options.fieldClass)){
		        this.field.addClass(this.options.fieldClass);
		    }
		    
		    if ($defined(this.options.value)){
		        this.field.set('value',this.options.value);
		    }
		    
		    if ($defined(this.options.name)){
                this.field.set('name',this.options.name);
            }
		    
		    if ($defined(this.options.id)){
		        this.field.set('id',this.options.id);
		    }
		
    		if ($defined(this.options.readonly) && this.options.readonly){
                this.field.set("readonly","readonly");
                this.field.addClass('jxFieldReadonly'); //Is this class really needed? could be targeted using attribute selector (though not in older browsers)
            }
    		
    		if ($defined(this.options.disabled) && this.options.disabled){
                this.field.set("disabled","disabled");
                this.field.addClass('jxFieldDisabled'); //same as above for this one
            }
    		
    		//add validator classes
    		if ($defined(this.options.validatorClasses)){
    		    this.field.addClass(this.options.validatorClasses);
    		}
		}
		
		//TAG
		if (els.has('jxInputTag')){
		    this.tag = els.get('jxInputTag');
		    if ($defined(this.options.tagClass)){
		        this.tag.addClass(this.options.tagClass);
		    }
		    if ($defined(this.options.tag)){
		        this.tag.set('html',this.options.tag);
		    }
		}
		
		if ($defined(this.options.form) && this.options.form instanceof Jx.Form){
		    this.form = this.options.form;
		    this.form.addField(this);
		}
		
		
	},
	/**
	 * Method: setValue
	 * Sets the value property of the field
	 * 
	 * Parameters:
	 * v - The value to set the field to, "checked" if a checkbox
	 * 		or radiobutton should be checked.
	 */
	setValue: function(v){
		this.field.set('value', v);
	},
	
	/**
	 * Method: getValue
	 * Returns the current value of the field. If the field is a checkbox or 
	 * radiobutton then the field must be "checked" in order to return a value.
	 * Otherwise it returns null.
	 */
	getValue: function(){
		return this.field.get("value");
	},
	
	/**
	 * Method: reset
	 * Sets the field back to the value passed in the original
	 * options
	 */
	reset: function(){
		this.field.set('value', this.options.value);
		this.clearErrors();
	},
	
	disable: function(){
	    this.field.set("disabled","disabled");
	    this.field.addClass('jxFieldDisabled');
	},
	
	enable: function(){
	    this.field.erase("disabled");
	    this.field.removeClass('jxFieldDisabled');
	},
	
	addError: function(error){
	    this.errors.push(error);
	},
	
	/**
     * Method: validate
     * Called on blur to validate the field and display 
     * the appropriate error messages.
     */
    showErrors: function(){
                    
        if (this.options.displayError === 'none') return;
            
        if ($defined(this.errorMessage)) {
            this.errorMessage.dispose();
        }
            
        var el = this.setupErrorMessage();
        if (this.form.options.messageStyle === 'text'){
            el.addClass(this.errorClass);
            el.inject(this.label);
            this.errorMessage = el;
        } else if (this.options.messageStyle === 'tip'){
            icon = new Element('span', {
                'class': 'jxFieldFeedback',
                'html': '&nbsp;'
            });
            icon.inject(this.label);
            //setup tip
            if ($defined(this.tip)){
                this.tip.detach();
                this.tip = null;
            }
            icon.addClass(this.errorClass);
            this.tip = new Jx.Tooltip(icon,el,{cssClass: 'jxFieldFeedbackTip'});
            this.errorMessage = icon;
        }
        this.field.addClass('jxFieldInvalid');
        
    },
    /**
     * Method: setupErrorMessage
     * Private method. Creates the Element containing the error message(s).
     */
    setupErrorMessage: function(){
        wrapper = new Element('span',{
            'class': 'jxFieldFeedback',
            'id': this.field.name+'-error'
        });
        if (this.form.options.displayError == 'single'){
            wrapper.set('html', this.errors[0]);
        } else {
            if (this.errors.length === 1) {
                wrapper.set('html', this.errors[0]);
            }
            else {
                list = new Element('ul');
                this.errors.each(function(item){
                    li = new Element('li', {
                        'html': item
                    });
                    li.inject(list);
                }, this);
                list.inject(wrapper);
            }
        }
        return wrapper;
    },
    
    /**
     * Method: clearError
     * Private Method. Used to clear any error messages when a reset is 
     * called for or the field passes validation after it had failed.
     */
    clearErrors: function(){
        this.errors.empty();
        if (this.field.hasClass('jxFieldInvalid')) {
            this.field.removeClass('jxFieldInvalid');
        }
        if ($defined(this.errorMessage)){
            this.errorMessage.dispose();
        }
    }
	    

});
