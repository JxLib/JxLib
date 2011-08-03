/*
---

name: Jx.Grid.Renderer.Button

description: "Renders one or more buttons in a single column.

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
Jx.Grid.Renderer.Button = new Class({

    Extends: Jx.Grid.Renderer,
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
            var button = new Jx.Button(opts);
            this.domObj.grab(document.id(button));
        },this);

    }
});