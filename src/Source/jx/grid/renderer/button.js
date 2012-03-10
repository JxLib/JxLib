/*
---

name: Jx.Grid.Renderer.Button

description: Renders one or more buttons in a single column.

license: MIT-style license.

requires:
 - Jx.Grid.Renderer
 - Jx.Button


provides: [Jx.Grid.Renderer.Button]

...
 */
/**
 * Class: Jx.Grid.Renderer.Button
 * Renders a <Jx.Button> into the cell. You can add s many buttons as you'd like per column by passing button configs
 * in as an array option to options.buttonOptions
 *
 * Extends: <Jx.Grid.Renderer>
 *
 */
define("jx/grid/renderer/button", function(require, exports, module){
    
    var base = require("../../../base"),
        Renderer = require("../renderer"),
        Button = require("../../button");
        
    var buttonRenderer = module.exports = new Class({

        Extends: Renderer,
        Family: 'Jx.Grid.Renderer.Button',
    
        Binds: [],
    
        options: {
            template: '<span class="buttons"></span>',
            /**
             * Option: buttonOptions
             * an array of option configurations for <Jx.Button>
             */
            buttonOptions: null
        },
        
        domInsert: true,
    
        classes:  {
            domObj: 'buttons'
        },
    
        init: function () {
            this.parent();
        },
    
        render: function () {
            this.parent();
    
            Array.from(this.options.buttonOptions).each(function(opts){
                var button = new Button(opts);
                this.domObj.grab(document.id(button));
            },this);
    
        }
    });
    
    if (base.global) {
        base.global.Grid.Renderer.Button = module.exports;
    }
    
});