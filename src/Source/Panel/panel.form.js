/*
---

name: Jx.Panel.Form

description: Provides a Jx.Panel that holds a Jx.Form and other services 

license: MIT-style license.

requires:
 - jxlib/Jx.Panel
 - jxlib/Jx.Form
 - jxlib/Jx.Notifier.Float
 - jxlib/Jx.Notifier
 - jxlib/Jx.Plugin.Form.Validator
 - jxlib/Jx.Fieldset
 - jxlib/Jx.Notice

provides: [Jx.Panel.Form]

css:
 - panel.form

...
 */
/** 
 * Class: Jx.Panel.Form
 * Provides a Jx.Panel that holds a Jx.Form and other services
 */
Jx.Panel.Form = new Class({
    
    Extends: Jx.Panel,
    Family: 'Jx.Panel.Form',
    
    notices: {},
    
    options: {
        /**
         * Option: fields
         * an array of option objects that describe the various fields in the 
         * form. Each should have a type and fieldset objects can have children.
         * Formatted like so:
         * 
         * (code)
         * [{
         *     type: 'text',
         *     options: { ..options here.. }
         *  },{
         *      type: 'fieldset',
         *      options: { ..options for the fieldset.. },
         *      children: [ {},{},{} ]  //array of additional fields
         * }]
         * (end) 
         * 
         */
        fields: null,
        /**
         * Option: validators
         * This should be the config used in Jx.Plugin.Form.Validator
         */
        validators: null,
        
        /**
         * Option: formOptions
         * The options for the internal instance of Jx.Form
         */
        formOptions: null
    },
    
    init: function () {
        this.parent();
    },
    
    render: function () {
        this.form = new Jx.Form(this.options.formOptions);
       
        this.options.content = document.id(this.form);
        
        this.parent();
        
        //add fields
        this.addFields(this.form, this.options.fields);
        
        //create validator
        if (this.options.validators !== undefined && this.options.validators !== null) {
            this.validator = new Jx.Plugin.Form.Validator(this.options.validators);
            this.validator.attach(this.form);
        
            //connect validation events
            this.validator.addEvents({
                'fieldValidationFailed': this.fieldFailed.bind(this),
                'fieldValidationPassed': this.fieldPassed.bind(this)
            });
            this.form.fireEvent('postInit');
        }
        
        this.domObj.resize();
        
    },
    
    addFields: function (container, options) {
        Object.each(options, function(opt){
            var t = Jx.type(opt);
            if (t === 'element') {
                opt.inject(document.id(container));
            } else if (opt instanceof Jx.Widget) {
                opt.addTo(container);
                if (opt instanceof Jx.Field) {
                    this.form.addField(opt);
                }
            } else if (t === 'object' && opt.type !== undefined && opt.type !== null) {
                opt.options.parent = container;
                opt.options.form = this.form;
                if (opt.type.toLowerCase() === 'fieldset') {
                    var field = new Jx.Fieldset(opt.options);
                    if (opt.children !== undefined && opt.children !== null) {
                        this.addFields(field, opt.children);
                    }
                } else {
                    new Jx.Field[opt.type.capitalize()](opt.options);
                }
            }
        },this);
    },

    add: function(options) {
        if (Jx.type(options) !== 'array') {
            options = [options];
        }
        this.addFields(this.form,options)
    },
    
    fieldPassed: function (field, validator) {
        this.fireEvent('fieldPassed',[field,validator,this]);
    },
    fieldFailed: function (field, validator) {
        this.fireEvent('fieldFailed',[field,validator,this]);
    }
});
