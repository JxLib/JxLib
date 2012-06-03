/*
---

name: Jx.Fieldset

description: Used to create fieldsets in Forms

license: MIT-style license.

requires:
 - Jx.Widget
 - Jx.Field
 - Jx.Form

provides: [Jx.Fieldset]

...
 */
// $Id$
/**
 * Class: Jx.Fieldset
 *
 * Extends: <Jx.Widget>
 *
 * This class represents a fieldset. It can be used to group fields together.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 *
 */
define("jx/fieldset", ['require', '../base','./widget','./form','./field'],
       function(require, base, Widget, Form, Field){
    
    var fieldset = new Class({
    
        Extends : Widget,
        Family: 'Jx.Fieldset',
    
        options : {
            /**
             * Option: legend
             * The text for the legend of a fieldset. Default is null
             * or no legend.
             */
            legend : null,
            /**
             * Option: id
             * The id to assign to this element
             */
            id : null,
            /**
             * Option: fieldsetClass
             * A CSS class to assign to the fieldset. Useful for custom styling of
             * the element
             */
            fieldsetClass : null,
            /**
             * Option: legendClass
             * A CSS class to assign to the legend. Useful for custom styling of
             * the element
             */
            legendClass : null,
            /**
             * Option: template
             * a template for how this element should be rendered
             */
            template : '<fieldset class="jxFieldset"><legend><span class="jxFieldsetLegend"></span></legend></fieldset>',
            /**
             * Option: form
             * The <Jx.Form> that this fieldset should be added to
             */
            form : null
        },
    
        classes: {
            domObj: 'jxFieldset',
            legend: 'jxFieldsetLegend'
        },
    
        /**
         * Property: legend
         * a holder for the legend Element
         */
        legend : null,
    
        init: function(){
            if (Form === undefined || Form === null) {
                Form = require('jx/form');
            }
            if (Field === undefined || Field === null) {
                Field = require('jx/field');
            }
            
            this.parent();
        },
        /**
         * APIMethod: render
         * Creates a fieldset.
         */
        render : function () {
            this.parent();
    
            this.id = this.options.id;
    
            if (this.options.form !== undefined &&
                    this.options.form !== null &&
                    instanceOf(this.options.form, Form)) {
                this.form = this.options.form;
            }
    
            //FIELDSET
            if (this.domObj) {
                if (this.options.id !== undefined && this.options.id !== null) {
                    this.domObj.set('id', this.options.id);
                }
                if (this.options.fieldsetClass !== undefined && this.options.fieldsetClass !== null) {
                    this.domObj.addClass(this.options.fieldsetClass);
                }
            }
    
            if (this.legend) {
                if (this.options.legend !== undefined && this.options.legend !== null) {
                    this.legend.set('html', this.getText(this.options.legend));
                    if (this.options.legendClass !== undefined && this.options.legendClass !== null) {
                        this.legend.addClass(this.options.legendClass);
                    }
                } else {
                    this.legend.destroy();
                }
            }
            
            if (this.options.items !== undefined && this.options.items !== null) {
                this.addItems(this, this.options.items);
            }
        },
        
        addItems: function (container, options) {
            Object.each(options, function(opt){
                var t = typeOf(opt);
                if (t === 'element' || t === 'string' || instanceOf(opt, Widget)) {
                    this.add(opt);
                } else if (t === 'object' && opt['class'] !== undefined && opt['class'] !== null) {
                    //opt.options.parent = container;
                    opt.options.form = this;
                    if (opt['class'].toLowerCase() === 'fieldset') {
                        this.add(new Fieldset(opt.options));
                    } else {
                        var field = require("jx/field/" + opt['class']);
                        this.add(new field(opt.options));
                    }
                }
            },this);
        },
        
        /**
         * APIMethod: add
         * Adds fields to this fieldset
         *
         * Parameters:
         * pass as many fields to this method as you like. They should be
         * <Jx.Field> objects
         */
        add : function () {
            var field;
            for (var x = 0; x < arguments.length; x++) {
                field = arguments[x];
                //add form to the field and field to the form if not already there
                //TODO: is there another way to do this without referencing Field?
                //      it would remove a circular reference if we could...
                if (instanceOf(field, Field) && 
                    (field.form === undefined || field.form === null) &&
                    this.form !== undefined && this.form !== null) {
                    field.form = this.form;
                    this.form.addField(field);
                }
                this.domObj.grab(document.id(field));
            }
            return this;
        },
        
        /**
         * APIMethod: addTo
         *
         */
        addTo: function(what) {
            if (instanceOf(what, Form)) {
                this.form = what;
                this.form.add(this);
            } else if (instanceOf(what, fieldset)) {
                this.form = what.form;
                what.add(this);
            } else {
                this.parent(what);
            }
            return this;
        }
        
    });

    if (base.global) {
        base.global.Fieldset = fieldset;
    }
    
    return fieldset;
    
});