// $Id$
/**
 * Class: Jx.Form
 *
 * Extends: <Jx.Widget>
 *
 * A class that represents an HTML form. You add fields using either
 * Jx.Form.add() or by using the field's .addTo() method. You can get all form
 * values or set them using this class. It also handles validation of fields.
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
    Family: 'Jx.Form',
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
         * Option: formClass
         */
        formClass: null,
        /**
         * Option: name
         * the name property for the form
         */
        name: '',
        /**
         * Option: acceptCharset
         * the character encoding to be used. Defaults to utf-8.
         */
        acceptCharset: 'utf-8',

        template: '<form class="jxForm"></form>'
    },
    
    /**
     * Property: defaultAction
     * the default field to activate if the user hits the enter key in this
     * form.  Set by specifying default: true as an option to a field.  Will
     * only work if the default is a Jx button field or an input of a type
     * that is a button
     */
    defaultAction: null,

    /**
     * Property: fields
     * An array of all of the single fields (not contained in a fieldset) for
     * this form
     */
    fields : null,
    /**
     * Property: pluginNamespace
     * required variable for plugins
     */
    pluginNamespace: 'Form',

    classes: $H({
        domObj: 'jxForm'
    }),
    
    init: function() {
      this.parent();
      this.fields = new Hash();
    },
    /**
     * APIMethod: render
     * Constructs the form but does not add it to anything to be shown. The
     * caller should use form.addTo() to add the form to the DOM.
     */
    render : function () {
        this.parent();
        //create the form first
        this.domObj.set({
            'method' : this.options.method,
            'action' : this.options.action,
            'name' : this.options.name,
            'accept-charset': this.options.acceptCharset,
            events: {
                keypress: function(e) {
                    if (e.key == 'enter' && 
                        e.target.tagName != "TEXTAREA" && 
                        this.defaultAction &&
                        this.defaultAction.click) {
                        document.id(this.defaultAction).focus();
                        this.defaultAction.click();
                        e.stop();
                    }
                }.bind(this)
            }
        });

        if (this.options.fileUpload) {
            this.domObj.set('enctype', 'multipart/form-data');
        }
        
        if ($defined(this.options.formClass)) {
            this.domObj.addClass(this.options.formClass);
        }
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
        if (field.options.defaultAction) {
            this.defaultAction = field;
        }
    },

    /**
     * Method: isValid
     * Determines if the form passes validation
     *
     * Parameters:
     * evt - the MooTools event object
     */
    isValid : function (evt) {
        return true;
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
        if ($defined(asQueryString) && asQueryString) {
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
            } else if (field instanceof Jx.Fieldset && !$defined(field.form)) {
                field.form = this;
            }
            
            this.domObj.grab(field);
        }
        return this;
    },

    /**
     * APIMethod: reset
     * Resets all fields back to their original value
     */
    reset : function () {
        this.fields.each(function (field, name) {
            field.reset();
        }, this);
        this.fireEvent('reset',this);
    },
    /**
     * APIMethod: getFieldsByName
     * Allows retrieving a field from a form by the name of the field (NOT the
     * ID).
     *
     * Parameters:
     * name - {string} the name of the field to find
     */
    getFieldsByName: function (name) {
        var fields = [];
        this.fields.each(function(val, id){
            if (val.name === name) {
                fields.push(val);
            }
        },this);
        return fields;
    },
    /**
     * APIMethod: getField
     * Returns a Jx.Field object by its ID.
     *
     * Parameters:
     * id - {string} the id of the field to find.
     */
    getField: function (id) {
        if (this.fields.has(id)) {
            return this.fields.get(id);
        } 
        return null;
    },
    /**
     * APIMethod: setBusy
     * Sets the busy state of the Form and all of it's fields.
     *
     * Parameters:
     * state - {boolean} indicated whether the form is busy or not.
     */
    setBusy: function(state) {
      if (this.busy == state) {
        return;
      }
      this.parent(state);
      this.fields.each(function(field) {
        field.setBusy(state, true);
      });
    }
});
