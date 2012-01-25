/*
---

name: Jx.Plugin.Form.Notifier

description: Plugin to Form.Panel to display error using a Jx.Notifier

license: MIT-style license.

requires:
 - Jx.Plugin.Panel
 - Jx.Notifier

provides: [Jx.Plugin.Form.Notifier]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Form.Notifier
 *
 * Extends: <Jx.Plugin>
 *
 * Panel.Form plugin for displaying error messages using a <Jx.Notifier> 
 * instance.
 *
 * License:
 * Copyright (c) 2011, Jonathan Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Form.Notifier = new Class({

    Extends : Jx.Plugin,
    Family: "Jx.Plugin.Form.Notifier",
    name: 'Form.Notifier',

    options: {
        /**
         * Option: notifierType
         * The type of notifier to use. Either 'float' or 'inline'.
         * Default is 'inline' which places the notifier at the top of the form.
         */
        notifierType: 'inline',
    },
    /**
     * Property: notices
     * Object holding all of the currently displayed notices.
     */
    notices: null,
    
    bound: null,
    
    init: function(){
        this.parent();
        this.bound = {
            postInit: this.onPostInit.bind(this),
            fieldValidationPassed: this.onFieldPassed.bind(this),
            fieldValidationFailed: this.onFieldFailed.bind(this)
        };
        this.notices = {};
    },
    
    attach: function(form){
        this.parent(form);
        this.form = form;
        
        //listen for the validation errors
        //and wait for postInit to add the notifier.
        form.addEvents(this.bound);
    },
    
    onPostInit: function(){
        //create the notifier and put it at the top of the fom
        if (this.options.notifierType instanceof Jx.Notifier) {
            this.notifier = this.options.notifierType;
        } else if (this.options.notifierType === 'inline') {
            this.notifier = new Jx.Notifier();
            this.notifier.addTo(document.id(this.form),'top');
        } else {
            this.notifier = new Jx.Notifier.Float({parent: document.body});
        }
        this.form.removeEvent('postInit',this.bound.postInit);
    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        this.form.removeEvents(this.bound);
    },

    onFieldPassed: function (field, validator, panel) {
        if (this.notices[field.id] !== undefined && this.notices[field.id] !== null) {
            this.notices[field.id].close();
        }
    },
    
    onFieldFailed: function (field, validator, panel) {
        if (this.notices[field.id] !== undefined && this.notices[field.id] !== null) {
            this.notices[field.id].close();
        }
        var errs = validator.getErrors();
        var text = field.name + " has the following errors: " + errs.join(",") + ".";
        var notice = new Jx.Notice.Error({
            content: text,
            onClose: function(){
                delete this.notices[field.id];
            }.bind(this)
        });
        this.notifier.add(notice);
        this.notices[field.id] = notice;
    }

});
