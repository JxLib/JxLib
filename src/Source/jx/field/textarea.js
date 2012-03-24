/*
---

name: Jx.Field.Textarea

description: Represents a textarea input

license: MIT-style license.

requires:
 - Jx.Field

provides: [Jx.Field.Textarea]

...
 */
// $Id$
/**
 * Class: Jx.Field.Textarea
 *
 * Extends: <Jx.Field>
 *
 * This class represents a textarea field.
 *
 * These fields are rendered as below.
 *
 * (code)
 * <div id='' class=''>
 *    <label for=''>A label for the field</label>
 *    <textarea id='' name='' rows='' cols=''>
 *      value/ext
 *    </textarea>
 * </div>
 * (end)
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
define("jx/field/textarea", ['../../base','../field'],
       function(base, Field){
    
    var textarea = new Class({

        Extends: Field,
        Family: "Jx.Field.Textarea",
    
        options: {
            /**
             * Option: rows
             * the number of rows to show
             */
            rows: null,
            /**
             * Option: columns
             * the number of columns to show
             */
            columns: null,
            /**
             * Option: template
             * the template used to render this field
             */
            template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><textarea class="jxInputTextarea" name="{name}"></textarea><span class="jxInputTag"></span></span>'
        },
        /**
         * Property: type
         * The type of field this is.
         */
        type: 'Textarea',
        /**
         * Property: errorClass
         * The class applied to error elements
         */
        errorClass: 'jxFormErrorTextarea',
    
        /**
         * APIMethod: render
         * Creates the input.
        */
        render: function () {
            this.parent();
    
            if (this.options.rows !== undefined && this.options.rows !== null) {
                this.field.set('rows', this.options.rows);
            }
            if (this.options.columns !== undefined && this.options.columns !== null) {
                this.field.set('cols', this.options.columns);
            }
    
            //TODO: Do we need to use OverText here as well??
    
        }
    });
    
    if (base.global) {
        base.global.Field.Textarea = textarea;
    }
    
    return textarea;
    
});