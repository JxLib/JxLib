/*
---

name: Jx.Column

description: A representation of a single grid column

license: MIT-style license.

requires:
 - Jx.Widget

provides: [Jx.Column]

...
 */
// $Id$
/**
 * Class: Jx.Column
 *
 * Extends: <Jx.Object>
 *
 * The class used for defining columns for grids.
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Column = new Class({

    Extends: Jx.Widget,
    Family: 'Jx.Column',

    options: {
        /**
         * Option: renderMode
         * The mode to use in rendering this column to determine its width.
         * Valid options include
         *
         * fit - auto calculates the width for the best fit to the text. This
         *      is the default.
         * fixed - uses the value passed in the width option, doesn't
         *      auto calculate.
         * expand - uses the value in the width option as a minimum width and
         *      allows this column to expand and take up any leftover space.
         *      NOTE: there can be only 1 expand column in a grid. The
         *      Jx.Columns object will only take the first column with this
         *      option as the expanding column. All remaining columns marked
         *      "expand" will be treated as "fixed".
         */
        renderMode: 'fit',
        /**
         * Option: width
         * Determines the width of the column when using 'fixed' rendering mode
         * or acts as a minimum width when using 'expand' mode.
         */
        width: 100,

        /**
         * Option: isEditable
         * allows/disallows editing of the column contents
         */
        isEditable: false,
        /**
         * Option: isSortable
         * allows/disallows sorting based on this column
         */
        isSortable: false,
        /**
         * Option: isResizable
         * allows/disallows resizing this column dynamically
         */
        isResizable: false,
        /**
         * Option: isHidden
         * determines if this column can be shown or not
         */
        isHidden: false,
        /**
         * Option: name
         * The name given to this column
         */
        name: '',

        /**
         * Option: template
         */
        template: null,
        /**
         * Option: renderer
         * an instance of a Jx.Grid.Renderer to use in rendering the content
         * of this column or a config object for creating one like so:
         *
         * (code)
         * {
         *     name: 'Text',
         *     options: { ... renderer options ... }
         * }
         */
        renderer: null
    },

    classes: {
      domObj: 'jxGridCellContent'
    },

    /**
     * Property: grid
     * holds a reference to the grid (an instance of <Jx.Grid>)
     */
    grid: null,

    parameters: ['options','grid'],

    /**
     * Constructor: Jx.Column
     * initializes the column object
     */
    init : function () {

        this.name = this.options.name;

        //adjust header for column
        if (this.options.template === undefined || this.options.template === null) {
            this.options.template = '<span class="jxGridCellContent">' + this.name.capitalize() + '</span>';
        }

        this.parent();
        if (this.options.grid !== undefined  && this.options.grid !== null && this.options.grid instanceof Jx.Grid) {
            this.grid = this.options.grid;
        }

        //check renderer
        if (this.options.renderer === undefined || this.options.renderer === null) {
            //set a default renderer
            this.options.renderer = new Jx.Grid.Renderer.Text({
                textTemplate: '{' + this.name + '}'
            });
        } else {
            if (!(this.options.renderer instanceof Jx.Grid.Renderer)) {
                var t = Jx.type(this.options.renderer);
                if (t === 'object') {
                    if(this.options.renderer.options.textTemplate === undefined || this.options.renderer.options.textTemplate === null) {
                      this.options.renderer.options.textTemplate = '{' + this.name + '}';
                    }
                    if(this.options.renderer.name === undefined || this.options.renderer.name === null) {
                      this.options.renderer.name = 'Text';
                    }
                    this.options.renderer = new Jx.Grid.Renderer[this.options.renderer.name.capitalize()](
                            this.options.renderer.options);
                }
            }
        }

        this.options.renderer.setColumn(this);
    },

    getTemplate: function(idx) {
      return "<span class='jxGridCellContent' title='{col"+idx+"}'>{col"+idx+"}</span>";
    },

    /**
     * APIMethod: getHeaderHTML
     */
    getHeaderHTML : function () {
      if (this.isSortable() && !this.sortImage) {
        this.sortImage = new Element('img', {
            src: Jx.aPixel.src
        });
        this.sortImage.inject(this.domObj);
      } else {
        if (!this.isSortable() && this.sortImage) {
          this.sortImage.dispose();
          this.sortImage = null;
        }
      }
      return this.domObj;
    },

    setWidth: function(newWidth, asCellWidth) {
        asCellWidth = (asCellWidth !== undefined && asCellWidth !== null) ? asCellWidth : false;

        var delta = this.cellWidth - this.width;
        if (!asCellWidth) {
          this.width = parseInt(newWidth,10);
          this.cellWidth = this.width + delta;
          this.options.width = newWidth;
        } else {
            this.width = parseInt(newWidth,10) - delta;
            this.cellWidth = newWidth;
            this.options.width = this.width;
        }
      if (this.rule && parseInt(this.width,10) >= 0) {
          this.rule.style.width = parseInt(this.width,10) + "px";
      }
      if (this.cellRule && parseInt(this.cellWidth,10) >= 0) {
          this.cellRule.style.width = parseInt(this.cellWidth,10) + "px";
      }
    },

    /**
     * APIMethod: getWidth
     * return the width of the column
     */
    getWidth: function () {
      return this.width;
    },

    /**
     * APIMethod: getCellWidth
     * return the cellWidth of the column
     */
    getCellWidth: function() {
      return this.cellWidth;
    },

    /**
     * APIMethod: calculateWidth
     * returns the width of the column.
     *
     * Parameters:
     * rowHeader - flag to tell us if this calculation is for the row header
     */
    calculateWidth : function (rowHeader) {
        //if this gets called then we assume that we want to calculate the width
      rowHeader = (rowHeader !== undefined && rowHeader !== null) ? rowHeader : false;
      var maxWidth,
          maxCellWidth,
          store = this.grid.getStore(),
          t,
          s,
          oldPos,
          text,
          klass;
      store.first();
      if ((this.options.renderMode == 'fixed' ||
           this.options.renderMode == 'expand') &&
          store.valid()) {
        t = new Element('span', {
          'class': 'jxGridCellContent',
          html: 'a',
          styles: {
            width: this.options.width
          }
        });
        s = this.measure(t,'jxGridCell');
        maxWidth = s.content.width;
        maxCellWidth = s.cell.width;
      } else {
          //calculate the width
          oldPos = store.getPosition();
          maxWidth = maxCellWidth = 0;
          while (store.valid()) {
              //check size by placing text into a TD and measuring it.
              this.options.renderer.render();
              text = document.id(this.options.renderer);
              klass = 'jxGridCell';
              if (this.grid.row.useHeaders() &&
                      this.options.name === this.grid.row.getRowHeaderColumn()) {
                  klass = 'jxGridRowHead';
              }
              s = this.measure(text, klass, rowHeader, store.getPosition());
              if (s.content.width > maxWidth) {
                  maxWidth = s.content.width;
              }
              if (s.cell.width > maxCellWidth) {
                maxCellWidth = s.cell.width;
              }
              if (store.hasNext()) {
                  store.next();
              } else {
                  break;
              }
          }

          //check the column header as well (unless this is the row header)
          if (!(this.grid.row.useHeaders() &&
              this.options.name === this.grid.row.getRowHeaderColumn())) {
              klass = 'jxGridColHead';
              if (this.isEditable()) {
                  klass += ' jxColEditable';
              }
              if (this.isResizable()) {
                  klass += ' jxColResizable';
              }
              if (this.isSortable()) {
                  klass += ' jxColSortable';
              }
              s = this.measure(this.domObj.clone(), klass);
              if (s.content.width > maxWidth) {
                  maxWidth = s.content.width;
              }
              if (s.cell.width > maxCellWidth) {
                maxCellWidth = s.cell.width;
              }
          }
      }

      this.width = maxWidth;
      this.cellWidth = maxCellWidth;
      store.moveTo(oldPos);
      return this.width;
    },
    /**
     * Method: measure
     * This method does the dirty work of actually measuring a cell
     *
     * Parameters:
     * text - the text to measure
     * klass - a string indicating and extra classes to add so that
     *          css classes can be taken into account.
     * rowHeader -
     * row -
     */
    measure : function (text, klass, rowHeader, row) {
        var d = new Element('span', {
            'class' : klass
        }),
        s;
        text.inject(d);
        //d.setStyle('height', this.grid.row.getHeight(row));
        d.setStyles({
            'visibility' : 'hidden',
            'width' : 'auto'
        });

        d.inject(document.body, 'bottom');
        s = d.measure(function () {
            var el = this;
            //if not rowHeader, get size of innner span
            if (!rowHeader) {
                el = el.getFirst();
            }
            return {
              content: el.getMarginBoxSize(),
              cell: el.getMarginBoxSize()
            };
        });
        d.destroy();
        return s;
    },
    /**
     * APIMethod: isEditable
     * Returns whether this column can be edited
     */
    isEditable : function () {
        return this.options.isEditable;
    },
    /**
     * APIMethod: isSortable
     * Returns whether this column can be sorted
     */
    isSortable : function () {
        return this.options.isSortable;
    },
    /**
     * APIMethod: isResizable
     * Returns whether this column can be resized
     */
    isResizable : function () {
        return this.options.isResizable;
    },
    /**
     * APIMethod: isHidden
     * Returns whether this column is hidden
     */
    isHidden : function () {
        return this.options.isHidden;
    },
    /**
     * APIMethod: isAttached
     * returns whether this column is attached to a store.
     */
    isAttached: function () {
        return this.options.renderer.attached;
    },

    /**
     * APIMethod: getHTML
     * calls render method of the renderer object passed in.
     */
    getHTML : function () {
        this.options.renderer.render();
        return document.id(this.options.renderer);
    }

});