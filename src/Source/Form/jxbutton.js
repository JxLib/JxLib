/**
 * Class: Jx.Field.Button
 * 
 * Extends: <Jx.Field>
 * 
 * This class represents a button.
 * 
 * Example:
 * (code)
 * (end)
 *
 * License: 
 * Copyright (c) 2009, DM Solutions Group
 * 
 * This file is licensed under an MIT style license
 */
Jx.Field.Button = new Class({
    
    Extends: Jx.Field,
    
    options: {
        /**
         * Option: buttonOptions
         */
        buttonOptions: {},
        /**
         * Option: template
         * The template used to render this field
         */
        template: '<label class="jxInputLabel"></label><div class="jxInputButton"></div><span class="jxInputTag"></span>'
    },
    /**
     * Property: type
     * The type of this field
     */
    type: 'Button',
    
    processTemplate: function(template, classes, container) {
        var h = this.parent(template, classes, container);
        var b = new Jx.Button(this.options.buttonOptions);
        var c = h.get('jxInputButton');
        if (c) {
            b.domObj.replaces(c);
        }
        return h;
    }
    
});