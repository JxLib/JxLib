/*
---

name: Jx.Field.Date

description: Provides a field to select a valid date value using a Date Picker

license: MIT-style license.

requires:
 - Jx.DatePicker
 - Jx.Field
 - Jx.Formatter.Date
 - Jx.Button.Flyout
 
css:
 - field.date

provides: [Jx.Field.Date]

...
 */
// $Id$
/**
 * Class: Jx.Field.Date
 *
 * Provides a field to select a valid date value using a Date Picker
 *
 * Example:
 * (code)
 * 	new Jx.Field.Date({
 * 		label: 'Start Date',
 *		value: '05/05/1984',
 *		format: '%m/%d/%Y'
 *	})
 * (end)
 *
 * Extends:
 * <Jx.Field>
 *
 * Author: Ing. Axel Mendoza Pupo.
 * 
 * License:
 * Copyright (c) 2011, Ing. Axel Mendoza Pupo.
 *
 * This file is licensed under an MIT style license
 */
define("jx/field/date", function(require, exports, module){
    
    var base = require("../../base"),
        Field = require("../field"),
        DateFormatter = require("../formatter/date"),
        Flyout = require("../button/flyout"),
        DatePicker = require("../datepicker");
        
    var date = module.exports = new Class({    
        Extends: Field,
        Family: 'Jx.Field.Date',
        
        options: {
            buttonTemplate: '<a class="jxButtonContainer jxButton" href="javascript:void(0);"><img class="jxButtonIcon" src="'+base.aPixel.src+'"></a>',
            template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><span class="jxInputWrapper"><input type="text" class="jxInputText"  name="{name}"><span class="jxInputRevealer"></span></span><span class="jxInputTag"></span></span>',
            format: '%d/%m/%Y'
        },
         
        type: 'Text',
         
        /**
         * APIMethod: render
         * create a new instance of Jx.Field.Date
         */
        render: function() {
            this.classes = Object.merge({},this.classes, {
              wrapper: 'jxInputWrapper',
              revealer: 'jxInputRevealer',
              icon: 'jxInputIcon'
            });
            this.parent();
            
            this.formatter = new DateFormatter({
                format: this.options.format
            });
            
            var pickerContainer = new Element('div',{
                styles: {
                    width: 171,
                    height: 156
                }
            });
            
            var button = new Flyout({
                template: this.options.buttonTemplate,
                imageClass: 'jxInputRevealerIcon',
                positionElement: this.field,
                content: pickerContainer
            }).addTo(this.revealer);
            
            //we need to style the Flyout so grab a reference and add our class
            document.id(button.content).addClass('jxDateFieldFlyout');
            
            this.datePicker = new DatePicker({
                value: this.options.value,
                onSelect: function(value){
                    var valueNew = this.formatter.format(value);
                    this.setValue(valueNew);
                    button.hide();
                }.bind(this)
            }).addTo(pickerContainer);
            
            button.addEvent('click', function(e) {
                
                if (!button.options.enabled) {
                    return;
                }
                this.contentContainer.setStyle('visibility','hidden');
                this.contentContainer.setStyle('display','block');
                document.id(document.body).adopt(this.contentContainer);
                /* we have to size the container for IE to render the chrome correctly
                 * but just in the menu/sub menu case - there is some horrible peekaboo
                 * bug in IE related to ULs that we just couldn't figure out
                 */
                this.contentContainer.setContentBoxSize(this.subDomObj.getMarginBoxSize());
    
                this.showChrome(this.contentContainer);
    
                this.position(this.contentContainer, that.field, {
                    horizontal: ['left left', 'right right'],
                    vertical: ['bottom top', 'top bottom'],
                    offsets: this.chromeOffsets
                });
    
                this.contentContainer.setStyle('visibility','');
    
                document.addEvent('mousedown', this.bound.hide);
                document.addEvent('keyup', this.bound.keypress);
    
                //this.fireEvent('show', this);
                
                
            }.bind(this));
         }
    });
    
    if (base.global) {
        base.global.Field.Date = module.exports;
    }
    
});