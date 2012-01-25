/*
---

name: Jx.Field

description: Base class for all inputs

license: MIT-style license.

requires:
 - Jx.Fieldset
 - Jx.Form

provides: [Jx.Field]


...
 */
// $Id$
/**
 * Class: Jx.Field
 *
 * Extends: <Jx.Widget>
 *
 * This class is the base class for all form fields.
 *
 *
 * Example:
 * (code)
 * (end)
 * 
 * Locale Keys:
 * - field.requiredText
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Field = new Class({
    
    Extends : Jx.Widget,
    Family: 'Jx.Field',
    pluginNamespace: 'Field',
    Binds: ['changeText'],
    
    options : {
        /**
         * Option: id
         * The ID assigned to the container of the Jx.Field element, this is
         * not the id of the input element (which is internally computed to be
         * unique)
         */
        id : null,
        /**
         * Option: name
         * The name of the field (used when submitting to the server). Will also be used for the
         * name attribute of the field.
         */
        name : null,
        /**
         * Option: label
         * The text that goes next to the field.
         */
        label : null,
        /**
         * Option: labelSeparator
         * A character to use as the separator between the label and the input.
         * Make it an empty string for no separator.
         */
        labelSeparator : ":",
        /**
         * Option: value
         * A default value to populate the field with.
         */
        value : null,
        /**
         * Option: tag
         * a string to use as the HTML of the tag element (default is a
         * <span> element).
         */
        tag : null,
        /**
         * Option: tip
         * A string that will eventually serve as a tooltip for an input field.
         * Currently only implemented as OverText for text fields.
         */
        tip : null,
        /**
         * Option: template
         * A string holding the template for the field.
         */
        template : null,
        /**
         * Option: containerClass
         * a CSS class that will be added to the containing element.
         */
        containerClass : null,
        /**
         * Option: labelClass
         * a CSS to add to the label
         */
        labelClass : null,
        /**
         * Option: fieldClass
         * a CSS class to add to the input field
         */
        fieldClass : null,
        /**
         * Option: tagClass
         * a CSS class to add to the tag field
         */
        tagClass : null,
        /**
         * Option: required
         * Whether the field is required. Setting this to true will trigger
         * the addition of a "required" validator class and the form
         * will not submit until it is filled in and validates provided
         * that the plugin Jx.Plugin.Field.Validator has been added to this
         * field.
         */
        required : false,
        /**
         * Option: readonly
         * {True|False} defaults to false. Whether this field is readonly.
         */
        readonly : false,
        /**
         * Option: disabled
         * {True|False} defaults to false. Whether this field is disabled.
         */
        disabled : false,
        /**
         * Option: defaultAction
         * {Boolean} defaults to false, if true and this field is a button
         * of some kind (Jx.Button, a button or an input of type submit) then
         * if the user hits the enter key on any field in the form except a
         * textarea, this field will be activated as if clicked
         */
        defaultAction: false
    },

    /**
     * Property: overtextOptions
     * The default options Jx uses for mootools-more's OverText
     * plugin
     */
    overtextOptions : {
        element : 'label'
    },

    /**
     * Property: field
     * An element representing the input field itself.
     */
    field : null,
    /**
     * Property: label
     * A reference to the label element for this field
     */
    label : null,
    /**
     * Property: tag
     * A reference to the "tag" field of this input if available
     */
    tag : null,
    /**
     * Property: id
     * A computed, unique id attached to the input element of this field.
     */
    id : null,
    /**
     * Property: overText
     * The overText instance for this field.
     */
    overText : null,
    /**
     * Property: type
     * Indicates that this is a field type
     */
    type : 'field',
    /**
     * Property: classes
     * The classes to search for in the template. Not
     * required, but we look for them.
     */
    classes : {
        domObj: 'jxInputContainer',
        label: 'jxInputLabel',
        tag: 'jxInputTag'
    },

    /**
     * APIMethod: render
     */
    render : function () {
        this.classes.field = 'jxInput'+this.type;
        var name = (this.options.name !== undefined && this.options.name !== null) ? this.options.name : '';
        this.options.template = this.options.template.substitute({name:name});
        this.parent();

        this.id = this.generateId();
        this.name = this.options.name;

        if (this.type !== undefined && this.type !== null) {
            this.domObj.addClass('jxInputContainer'+this.type);
        }

        if (this.options.containerClass !== undefined && this.options.containerClass !== null) {
            this.domObj.addClass(this.options.containerClass);
        }
        if (this.options.required !== undefined && this.options.required !== null && this.options.required) {
            this.domObj.addClass('jxFieldRequired');
            if (this.options.validatorClasses !== undefined && is.options.validatorClasses !== null) {
                this.options.validatorClasses = 'required ' + this.options.validatorClasses;
            } else {
                this.options.validatorClasses = 'required';
            }
        }


        // FIELD
        if (this.field) {
            if (this.options.fieldClass !== undefined && this.options.fieldClass !== null) {
                this.field.addClass(this.options.fieldClass);
            }

            if (this.options.value !== undefined && this.options.value !== null) {
                this.field.set('value', this.options.value);
            }

            this.field.set('id', this.id);

            if (this.options.readonly !== undefined &&
                    this.options.readonly !== null &&
                    this.options.readonly) {
                this.field.set("readonly", "readonly");
                this.field.addClass('jxFieldReadonly');
            }

            if (this.options.disabled !== undefined &&
                    this.options.disabled !== null &&
                    this.options.disabled) {
                this.field.set("disabled", "disabled");
                this.field.addClass('jxFieldDisabled');
            }
            
            //add events
            this.field.addEvents({
              'focus': this.onFocus.bind(this),
              'blur': this.onBlur.bind(this),
              'change': this.onChange.bind(this)
            });

            this.field.store('field', this);

            // add click event to label to set the focus to the field
            // COMMENT: tried it without a function using addEvent('click', this.field.focus.bind(this)) but crashed in IE
            if(this.label) {
              this.label.addEvent('click', function() {
                this.field.focus();
              }.bind(this));
            }
        }
        // LABEL
        if (this.label) {
            if (this.options.labelClass !== undefined && this.options.labelClass !== null) {
                this.label.addClass(this.options.labelClass);
            }
            if (this.options.label !== undefined && this.options.label !== null) {
                this.label.set('html', this.getText(this.options.label) +
                        this.options.labelSeparator);
            }

            this.label.set('for', this.id);

            if (this.options.required) {
                this.requiredText = new Element('em', {
                    'html' : this.getText({set:'Jx',key:'field',value:'requiredText'}),
                    'class' : 'required'
                });
                this.requiredText.inject(this.label);
            }

        }

        // TAG
        if (this.tag) {
            if (this.options.tagClass !== undefined && this.options.tagClass !== null) {
                this.tag.addClass(this.options.tagClass);
            }
            if (this.options.tag !== undefined && this.options.tag !== null) {
                this.tag.set('html', this.options.tag);
            }
        }

        if (this.options.form !== undefined &&
                this.options.form !== null &&
                this.options.form instanceof Jx.Form) {
            this.form = this.options.form;
            this.form.addField(this);
        }

    },
    /**
     * APIMethod: setValue 
     * Sets the value property of the field
     *
     * Parameters:
     * v - The value to set the field to.
     */
    setValue : function (v) {
        if (!this.options.readonly) {
            this.field.set('value', v);
        }
    },

    /**
     * APIMethod: getValue
     * Returns the current value of the field.
     */
    getValue : function () {
        return this.field.get("value");
    },

    /**
     * APIMethod: reset
     * Sets the field back to the value passed in the
     * original options
     */
    reset : function () {
        this.setValue(this.options.value);
        this.fireEvent('reset', this);
    },
    /**
     * APIMethod: disable
     * Disabled the field
     */
    disable : function () {
        this.options.disabled = true;
        this.field.set("disabled", "disabled");
        this.field.addClass('jxFieldDisabled');
    },
    /**
     * APIMethod: enable
     * Enables the field
     */
    enable : function () {
        this.options.disabled = false;
        this.field.erase("disabled");
        this.field.removeClass('jxFieldDisabled');
    },
    
    /**
     * APIMethod: addTo
     * Overrides default Jx.Widget AddTo() so that we can call .add() if
     * adding to a Jx.Form or Jx.Fieldset object.
     *
     * Parameters:
     * what - the element or object to add this field to.
     * where - where in the object to place it. Not valid if adding to Jx.Form
     *      or Jx.Fieldset.
     */
    addTo: function(what, where) {
        if (what instanceof Jx.Fieldset || what instanceof Jx.Form) {
            what.add(this);
        } else {
            this.parent(what, where);
        }
        return this;
    },
    
    /**
     * APIMethod: changeText
     * This method should be overridden by subclasses. It should be used
     * to change any language specific default text that is used by the widget.
     * 
     * Parameters:
     * lang - the language being changed to or that had it's data set of 
     *    translations changed.
     */
    changeText: function (lang) {
        this.parent();
        if (this.options.label !== undefined && this.options.label !== null && this.label) {
          this.label.set('html', this.getText(this.options.label) + this.options.labelSeparator);
        }
        if(this.options.required) {
          this.requiredText = new Element('em', {
              'html' : this.getText({set:'Jx',key:'field',value:'requiredText'}),
              'class' : 'required'
          });
          this.requiredText.inject(this.label);
        }
        if (this.requiredText !== undefined && his.requiredText !== null) {
          this.requiredText.set('html',this.getText({set:'Jx',key:'field',value:'requiredText'}));
        }
    }, 
    
    onFocus: function() {
      this.fireEvent('focus', this);
    },
    
    onBlur: function () {
      this.fireEvent('blur',this);
    },
    
    onChange: function () {
      this.fireEvent('change', this);
    },
    
    setBusy: function(state, withoutMask) {
      if (!withoutMask) {
        this.parent(state);
      }
      this.field.set('readonly', state || this.options.readonly);
    }

});
