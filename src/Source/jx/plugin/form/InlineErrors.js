/*
---

name: Jx.Plugin.Form.InlineErrors

description: Plugin to Form.Panel to display error using a Jx.Notifier

license: MIT-style license.

requires:
 - Jx.Form
 - Jx.Plugin.Form

provides: [Jx.Plugin.Form.InlineErrors]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Form.InlineErrors
 *
 * Extends: <Jx.Plugin>
 *
 * Jx.Form plugin for displaying errors inline with the fields.
 *
 * License:
 * Copyright (c) 2011, Jonathan Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
define("jx/plugin/form/inlineerrors", ['../../../base','../../plugin'],
       function(base, Plugin){
    
    var inlineErrors = new Class({

        Extends : Plugin,
        Family: "Jx.Plugin.Form.InlineErrors",
        name: 'Form.InlineErrors',
    
        options: {
            
        },
        
        init: function(){
            this.parent();
            this.bound = {
                fieldValidationPassed: this.onFieldPassed.bind(this),
                fieldValidationFailed: this.onFieldFailed.bind(this)
            };
        },
        
        attach: function(form){
            this.parent(form);
            this.form = form;
            
            //listen for the validation errors
            //and wait for postInit to add the notifier.
            form.addEvents(this.bound);
            
        },
    
        onFieldPassed: function (field, validator) {
            field.domObj.getElements('.jxInlineError').destroy();
        },
        
        onFieldFailed: function (field, validator) {
            //build a list of the errors
            var the_errors = ""; 
            validator.getErrors().each(function(error) {
                the_errors += error + '<br />';
            });
            //trim last <br />
            if (the_errors) { the_errors.slice(0,'<br />'.length); } 
            if (field.label && the_errors) {
                if (field.error) {
                    field.error.destroy();
                }
                var e = new Element("span", {
                    'class' : 'jxInlineError',
                    html : the_errors
                });
                field.error = e;
                e.inject(field, 'bottom');
            }
        }
    
    });

    if (base.global) {
        base.global.Plugin.Form.InlineErrors = inlineErrors;
    }
    
    return inlineErrors;
});
    