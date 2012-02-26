/*
---

name: Jx.Grid.Renderer

description: Base class for all renderers. Used to create the contents of column.

license: MIT-style license.

requires:
 - Jx.Grid

provides: [Jx.Grid.Renderer]

...
 */
/**
 * Class: Jx.Grid.Renderer
 * This is the base class and namespace for all grid renderers.
 * 
 * Extends: <Jx.Widget>
 * We extended Jx.Widget to take advantage of templating support.
 */
define("jx/grid/renderer", function(require, exports, module){
    
    var base = require("../../base"),
        Widget = require("../widget"),
        Column = null;
        
    var renderer = module.exports = new Class({
  
        Extends: Widget,
        Family: 'Jx.Grid.Renderer',
        
        parameters: ['options'],
        
        options: {
            deferRender: true,
            /**
             * Option: template
             * The template for rendering this cell. Will be processed as per
             * the Jx.Widget standard.
             */
            template: '<span class="jxGridCellContent"></span>'
        },
        /**
         * APIProperty: attached
         * tells whether this renderer is used in attached mode
         * or not. Should be set by renderers that get a reference to
         * the store.
         */
        attached: null,
        
        /**
         * Property: domInsert
         * boolean, indicates if the renderer needs to insert a DOM element
         * instead of just outputing some templated HTML.  Renderers that
         * do use domInsert will be slower.
         */
        domInsert: false,
      
        classes: {
            domObj: 'jxGridCellContent'
        },
      
        column: null,
      
        init: function () {
            Column = require("./column");
            
            this.parent();
            this.attached = false;
        },
        
        render: function () {
            this.parent();
        },
        
        setColumn: function (column) {
            if (column instanceof Column) {
                this.column = column;
            }
        }
        
      });
    
    if (base.global) {
        base.global.Grid.Renderer = module.exports;
    }
})