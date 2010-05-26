/*
---

name: Jx.Fieldset

description: Used to create fieldsets in Forms

license: MIT-style license.

requires:
 - Jx.Widget

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
Jx.Fieldset = new Class({
    Family: 'Jx.Fieldset',
    Extends : Jx.Widget,

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

    classes: new Hash({
        domObj: 'jxFieldset',
        legend: 'jxFieldsetLegend'
    }),

    /**
     * Property: legend
     * a holder for the legend Element
     */
    legend : null,

    /**
     * APIMethod: render
     * Creates a fieldset.
     */
    render : function () {
        this.parent();

        this.id = this.options.id;

        if ($defined(this.options.form)
                && this.options.form instanceof Jx.Form) {
            this.form = this.options.form;
        }

        //FIELDSET
        if (this.domObj) {
            if ($defined(this.options.id)) {
                this.domObj.set('id', this.options.id);
            }
            if ($defined(this.options.fieldsetClass)) {
                this.domObj.addClass(this.options.fieldsetClass);
            }
        }

        if (this.legend) {
            if ($defined(this.options.legend)) {
                this.legend.set('html', this.getText(this.options.legend));
                if ($defined(this.options.legendClass)) {
                    this.legend.addClass(this.options.legendClass);
                }
            } else {
                this.legend.destroy();
            }
        }
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
            if ($defined(field.jxFamily) && !$defined(field.form) && $defined(this.form)) {
                field.form = this.form;
                this.form.addField(field);
            }
            this.domObj.grab(field);
        }
        return this;
    },
    
    /**
     * APIMethod: addTo
     *
     */
    addTo: function(what) {
        if (what instanceof Jx.Form) {
            this.form = what;
        } else if (what instanceof Jx.Fieldset) {
            this.form = what.form;
        }
        return this.parent(what);
    }
    
});
