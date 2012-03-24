/*
---

name: Jx.Grid.Renderer.Text

description: Renders data as straight text.

license: MIT-style license.

requires:
 - Jx.Grid.Renderer

provides: [Jx.Grid.Renderer.Text]

...
 */
/**
 * Class: Jx.Grid.Renderer.Text
 * This is the default renderer for grid cells. It works the same as the
 * original column implementation. It needs a store, a field name, and an
 * optional formatter as well as other options.
 *
 * Extends: <Jx.Grid.Renderer>
 *
 */
define("jx/grid/renderer/text", ['../../../base','../renderer','../../formatter','require'],
       function(base, Renderer, Formatter, require){
    
    var text = new Class({

        Extends: Renderer,
        Family: 'Jx.Grid.Renderer.Text',
  
        options: {
            /**
             * Option: formatter
             * an instance of <Jx.Formatter> or one of its subclasses which
             * will be used to format the data in this column. It can also be
             * an object containing the name (This should be the part after
             * Jx.Formatter in the class name. For instance, to get a currency
             * formatter, specify 'Currency' as the name.) and options for the
             * needed formatter (see individual formatters for options).
             * (code)
             * {
             *    name: 'formatter name',
             *    options: {}
             * }
             * (end)
             */
            formatter: null,
            /**
             * Option: textTemplate
             * Will be used for creating the text that goes iside the template. Use
             * placeholders for indicating the field(s). You can add as much text
             * as you want. for example, if you wanted to display someone's full
             * name that is brokem up in the model with first and last names you
             * can write a template like '{lastName}, {firstName}' and as long as
             * the text between { and } are field names in the store they will be
             * substituted properly.
             */
            textTemplate: null,
            /**
             * Option: css
             * A string or function to use in adding classes to the text
             */
            css: null
        },
  
        store: null,
      
        columnsNeeded: null,
      
        init: function () {
            this.parent();
            var options = this.options,
                t;
            //check the formatter
            if (options.formatter !== undefined &&
                options.formatter !== null &&
                !instanceOf(options.formatter, Formatter)) {
                t = typeOf(options.formatter);
                if (t === 'object') {
                    // allow users to leave the options object blank
                    if(options.formatter.options !== undefined && 
                       options.formatter.options !== null) {
                        options.formatter.options = {};
                    }
                    var formatter = require("jx/formatter/" + options.formatter.name.toLowerCase());
                    options.formatter = new formatter(options.formatter.options);
                }
            }
        },
  
        setColumn: function (column) {
            this.parent();
    
            this.store = column.grid.getStore();
            this.attached = true;
  
            if (this.options.textTemplate !== undefined && this.options.textTemplate !== null) {
                this.columnsNeeded = this.store.parseTemplate(this.options.textTemplate);
            }
        },
  
        render: function () {
            this.parent();
        
            var text = '';
            if (this.options.textTemplate !== undefined && this.options.textTemplate !== null) {
                if ((this.columnsNeeded === undefined && this.columnsNeeded === null) || 
                    (typeOf(this.columnsNeeded) === 'array' && this.columnsNeeded.length === 0)) {
                    this.columnsNeeded = this.store.parseTemplate(this.options.textTemplate);
                }
                text = this.store.fillTemplate(null,this.options.textTemplate,this.columnsNeeded);
            }
            if (this.options.formatter !== undefined && this.options.formatter !== null) {
                text = this.options.formatter.format(text);
            }
        
            this.domObj.set('html',text);
        
            if (this.options.css !== undefined && this.options.css !== null && typeOf(this.options.css) === 'function') {
                this.domObj.addClass(this.options.css.apply(this, Array.from(text)));
            } else if (this.options.css !== undefined && this.options.css !== null && 
                        typeOf(this.options.css) === 'string'){
                this.domObj.addClass(this.options.css);
            }
      
        }
      
    });
    
    if (base.global) {
        base.global.Grid.Renderer.Text = text;
    }
    
    return text;
    
});