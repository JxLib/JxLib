/*
---

name: Jx.Field.Spinner

description: Provide a Text Field with two buttons that fire events

license: MIT-style license.

requires:
 - Jx.Field.Text

css:
 - spinner
 

provides: [Jx.Field.Spinner]

...
 */
// $Id$
/**
 * Class: Jx.Field.Spinner
 *
 * A Jx.Widget that provides a Text Field with two buttons that fires events
 *
 * Example:
 * (code)
 *      new Jx.Field.Spinner({
 *              label: 'Spin Field',
 *              onSpinUp: function(){
 *                      alert("spin up click event");
 *              },
 *              onSpinDown: function(){
 *                      alert("spin down click event");
 *              }
 *      })
 * (end)
 *
 * Extends:
 * <Jx.Field.Text>
 *
 * Author: Ing. Axel Mendoza Pupo.
 *
 * License:
 * Copyright (c) 2011, Ing. Axel Mendoza Pupo.
 *
 * This file is licensed under an MIT style license
 */
define("jx/field/spinner", function(require, exports, module){
    
    var base = require("../../base"),
        Text = require("./text"),
        Button = require("../button");
        
    var spinner = module.exports = new Class({
        Extends: Text,
        Family: 'Jx.Field.Spinner',
        
        options: {
            buttonTemplate: '<a class="jxButtonContainer jxButton" href="javascript:void(0);"><img class="jxButtonIcon" src="'+base.aPixel.src+'"></a>',
            template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><span class="jxInputWrapper"><input type="text" class="jxInputText"  name="{name}"><span class="jxInputSpinners"></span></span><span class="jxInputTag"></span></span>'
        },
    
        render: function(){
            this.classes = Object.merge({},this.classes, {
                wrapper: 'jxInputWrapper',
                revealer: 'jxInputSpinners'
            });
            this.parent();
    
            this.buttonUp = new Button({
                template: this.options.buttonTemplate,
                imageClass: 'jxInputSpinUpIcon',
                onClick: function(){
                    this.fireEvent('spinUp', this);
                }.bind(this)
            }).addTo(this.revealer);
    
            this.buttonDown = new Button({
                template: this.options.buttonTemplate,
                imageClass: 'jxInputSpinDownIcon',
                onClick: function(){
                    this.fireEvent('spinDown', this);
                }.bind(this)
            }).addTo(this.revealer);
        }
    }); 
    
    if (base.global) {
        base.global.Field.Spinner = module.exports;
    }
    
});