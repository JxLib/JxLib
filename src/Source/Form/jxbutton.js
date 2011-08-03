/*
---

name: Jx.Field.Button

description: Represents a button input

license: MIT-style license.

requires:
 - Jx.Field
 - Jx.Button

provides: [Jx.Field.Button]

...
 */
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
    Family: "Jx.Field.Button",

    options: {
        /**
         * Option: buttonClass
         * choose the actual Jx.Button subclass to create for this form
         * field.  The default is to create a basic Jx.Button.  To create
         * a different kind of button, pass the class to this option, for
         * instance:
         * (code)
         * buttonClass: Jx.Button.Color
         * (end)
         */
        buttonClass: Jx.Button,
        
        /**
         * Option: buttonOptions
         */
        buttonOptions: {},
        /**
         * Option: template
         * The template used to render this field
         */
        template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><div class="jxInputButton"></div><span class="jxInputTag"></span></span>'
    },
    
    button: null,
    
    /**
     * Property: type
     * The type of this field
     */
    type: 'Button',

    processTemplate: function(template, classes, container) {
        var h = this.parent(template, classes, container);
        this.button = new this.options.buttonClass(this.options.buttonOptions);
        this.button.addEvent('click', function(){
          this.fireEvent('click');
        }.bind(this));
        var c = h.jxInputButton;
        if (c) {
            this.button.domObj.replaces(c);
        }
        this.button.setEnabled(!this.options.disabled);
        return h;
    },
    
    click: function() {
        this.button.clicked();
    },
    
    enable: function() {
      this.parent();
      this.button.setEnabled(true);
    },
    
    disable: function() {
      this.parent();
      this.button.setEnabled(false);
    }
});