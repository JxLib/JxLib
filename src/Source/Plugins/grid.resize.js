/*
---

name: Jx.Plugin.Grid.Resize

description: Enables column resizing in grids

license: MIT-style license.

requires:
- Jx.Plugin.Grid

provides: [Jx.Plugin.Grid.Resize]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Grid.Resize
 *
 * Extends: <Jx.Plugin>
 *
 * Grid plugin to enable dynamic resizing of column width and row height
 *
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Grid.Resize = new Class({

    Extends : Jx.Plugin,
    Binds: ['createHandles','removeHandles'],
    options: {
        /**
         * Option: column
         * set to true to make column widths resizeable
         */
        column: false,
        /**
         * Option: row
         * set to true to make row heights resizeable
         */
        row: false,
        /**
         * Option: tooltip
         * the tooltip to display for the draggable portion of the
         * cell header, localized with MooTools.lang.get('Jx','plugin.resize').tooltip for default
         */
        tooltip: ''
    },
    /**
     * Property: els
     * the DOM elements by which the rows/columns are resized.
     */
    els: {
      column: [],
      row: []
    },

    /**
     * Property: drags
     * the Drag instances
     */
    drags: {
      column: [],
      row: []
    },

    /**
     * APIMethod: attach
     * Sets up the plugin and connects it to the grid
     */
    attach: function (grid) {
        if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
            return;
        }
        this.grid = grid;
        this.grid.addEvent('doneCreateGrid', this.createHandles);
        this.grid.addEvent('beginCreateGrid', this.removeHandles);
        this.createHandles();
    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        if (this.grid) {
            this.grid.removeEvent('doneCreateGrid', this.createHandles);
            this.grid.removeEvent('beginCreateGrid', this.removeHandles);
        }
        this.grid = null;
    },

    activate: function(option) {
        if ($defined(this.options[option])) {
          this.options[option] = true;
        }
        this.createHandles();
    },
    
    deactivate: function(option) {
        if ($defined(this.options[option])) {
          this.options[option] = false;
        }
        this.createHandles();
    },
    /**
     * Method: removeHandles
     * clean up any handles we created
     */
    removeHandles: function() {
        ['column','row'].each(function(option) {
          this.els[option].each(function(el) { el.dispose(); } );
          this.els[option] = [];
          this.drags[option].each(function(drag){ drag.detach(); });
          this.drags[option] = [];
        }, this);
    },
    /**
     * Method: createHandles
     * create handles that let the user drag to resize columns and rows
     */
    createHandles: function() {
        this.removeHandles();
        if (this.options.column && this.grid.columns.useHeaders()) {
            var hf = this.grid.row.getRowHeaderColumn();
            this.grid.columns.columns.each(function(col, idx) {
                if (col.options.name != hf && 
                    col.isResizable() && 
                    col.domObj) {
                    var el = new Element('div', {
                        'class':'jxGridColumnResize',
                        title: this.options.tooltip == '' ? this.getText({set:'Jx',key:'plugin.resize',value:'tooltip'}) : this.getText(this.options.tooltip),
                        events: {
                            dblclick: function() {
                                col.options.renderMode = 'fit';
                                col.options.width = 'auto';
                                col.setWidth(col.getWidth(true));
                            }
                        }
                    }).inject(col.domObj);
                    el.store('col', col);
                    this.els.column.push(el);
                    this.drags.column.push(new Drag(el, {
                        limit: {y:[0,0]},
                        snap: 2,
                        onBeforeStart: function(el) {
                          var l = el.getPosition(el.parentNode).x.toInt();
                          el.setStyles({
                            left: l,
                            right: null
                          });
                          
                        },
                        onStart: function(el) {
                          var l = el.getPosition(el.parentNode).x.toInt();
                          el.setStyles({
                            left: l,
                            right: null
                          });
                        },
                        onDrag: function(el) {
                            var col = el.retrieve('col');
                            col.options.renderMode = 'fixed';
                            var w = el.getPosition(el.parentNode).x.toInt();
                            col.setWidth(w);
                        },
                        onComplete: function(el) {
                          el.setStyle('left', null);
                          col.grid.resizeRowsCols("rows");
                        }
                    }));
                }
            }, this);
        }

        //if (this.options.row && this.grid.row.useHeaders()) {}
    },
    /**
     * Method: createText
     * respond to a language change by updating the tooltip
     */
    changeText: function (lang) {
      this.parent();
      var txt = this.options.tooltip == '' ? this.getText({set:'Jx',key:'plugin.resize',value:'tooltip'}) : this.getText(this.options.tooltip);
      ['column','row'].each(function(option) {
        this.els[option].each(function(el) { el.set('title',txt); } );
      }, this);
    }
});
