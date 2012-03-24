/*
---

name: Jx.Field.NumberSpinner

description: Based on Jx.Field.Spinner, this provides a way to spin numbers

license: MIT-style license.

requires:
 - Jx.Field.Spinner

provides: [Jx.Field.NumberSpinner]

...
 */
// $Id$
/**
 * Class: Jx.Field.NumberSpinner
 *
 * A Jx.Widget that provides a Text Field with two buttons that fires events
 * and will spin numbers up and down 
 *
 * Example:
 * (code)
 *      new Jx.Field.NumberSpinner({
 *          label: 'Spin Field'
 *      })
 * (end)
 *
 * Extends:
 * <Jx.Field.Spinner>
 *
 * Author: Jonathan Bomgardner
 *
 * License:
 * Copyright (c) 2011, Jonathan Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
define("jx/field/numberspinner", ['../../base','./spinner'],
       function(base, Spinner){
    
    var numberSpinner = new Class({
        Extends: Spinner,
        Family: 'Jx.Field.NumberSpinner',
        
        options: {
            allowNegative: true,
            step: 1,
            value: 0
        },
        
        init: function(){
            this.parent();
            
            this.bound = {
                up: this.onSpinUp.bind(this),
                down: this.onSpinDown.bind(this)
            }
            
            this.addEvents({
                onSpinUp: this.bound.up,
                onSpinDown: this.bound.down
            });
        },
        
        onSpinUp: function(){
            var num = this.getValue().toInt();
            num+=this.options.step;
            this.setValue(num);
        },
        
        onSpinDown: function(){
            var num = this.getValue().toInt();
            num-=this.options.step;
            if (!this.options.allowNegative && num < 0){
                num = 0;
            }
            this.setValue(num);
        }
    });
    
    if (base.global) {
        base.global.Field.NumberSpinner = numberSpinner;
    }
    
    return numberSpinner;
});