/*
---

name: Jx.Columns

description: A container for defining and holding individual columns

license: MIT-style license.

requires:
 - Jx.Column
 - Jx.Object

provides: [Jx.Columns]

...
 */
// $Id$
/**
 * Class: Jx.Columns
 *
 * Extends: <Jx.Object>
 *
 * This class is the container for all columns needed for a grid. It
 * consolidates many functions that didn't make sense to put directly
 * in the column class. Think of it as a model for columns.
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Columns = new Class({

  Family: 'Jx.Columns',
    Extends : Jx.Object,

    options : {
        /**
         * Option: headerRowHeight
         * the default height of the header row. Set to null or 'auto' to
         * have this class attempt to figure out a suitable height.
         */
        headerRowHeight : 20,
        /**
         * Option: useHeaders
         * Determines if the column headers should be displayed or not
         */
        useHeaders : false,
        /**
         * Option: columns
         * an array holding all of the column instances or objects containing
         * configuration info for the column
         */
        columns : []
    },
    /**
     * Property: columns
     * an array holding the actual instantiated column objects
     */
    columns : [],
    
    /**
     * Property: rowTemplate
     * a string holding a template for a single row of cells to be populated
     * when rendering the store into a grid.  The template is constructed from
     * the individual column templates once the store has been loaded.
     */
    rowTemplate: null,

    parameters: ['options','grid'],
    /**
     * Property: hasExpandable
     * boolean indicates whether any of the columns are expandable or not,
     * which affects some calculations for column widths
     */
    hasExpandable: null,

    /**
     * APIMethod: init
     * Creates the class.
     */
    init : function () {
        this.parent();

        if ($defined(this.options.grid) && 
            this.options.grid instanceof Jx.Grid) {
          this.grid = this.options.grid;
        }

        this.hasExpandable = false;

        this.options.columns.each(function (col) {
            //check the column to see if it's a Jx.Grid.Column or an object
            if (col instanceof Jx.Column) {
                this.columns.push(col);
            } else if (Jx.type(col) === "object") {
                this.columns.push(new Jx.Column(col,this.grid));
            }
            var c = this.columns[this.columns.length - 1 ];
        }, this);
        
        this.buildTemplates();
    },
    
    /**
     * APIMethod: addColumns
     * add new columns to the columns object after construction.  Causes
     * the template to change.
     * 
     * Parameters:
     * columns - {Array} an array of columns to add
     */
    addColumns: function(columns) {
      this.columns.extend(columns);
      this.buildTemplates();
    },
    
    /**
     * Method: buildTemplates
     * create the row template based on the current columns
     */
    buildTemplates: function() {
      if (!this.grid) {
        return;
      }
      var rowTemplate = '',
          hasExpandable = false,
          grid = this.grid,
          row = grid.row,
          rhc = grid.row.useHeaders() ? this.getByName(row.options.headerColumn) : null,
          colTemplate;
      
      this.columns.each(function(col, idx) {
        var colTemplate = '';
        if (!col.isHidden() && col != rhc) {
          hasExpandable |= col.options.renderMode == 'expand';
          if (!col.options.renderer || !col.options.renderer.domInsert) {
            colTemplate = col.getTemplate(idx);
          }
          rowTemplate += "<td class='jxGridCell jxGridCol"+idx+" jxGridCol"+col.options.name+"'>" + colTemplate + "</td>";
        }
      });
      if (!hasExpandable) {
        rowTemplate += "<td><span class='jxGridCellUnattached'></span></td>";
      }
      this.rowTemplate = rowTemplate;
      this.hasExpandable = hasExpandable;
    },
    /**
     * APIMethod: getHeaderHeight
     * returns the height of the column header row
     *
     * Parameters:
     * recalculate - determines if we should recalculate the height. Currently
     * does nothing.
     */
    getHeaderHeight : function (recalculate) {
        if (!$defined(this.height) || recalculate) {
            if ($defined(this.options.headerRowHeight)
                    && this.options.headerRowHeight !== 'auto') {
                this.height = this.options.headerRowHeight;
            } //else {
                //figure out a height.
            //}
        }
        return this.height;
    },
    /**
     * APIMethod: useHeaders
     * returns whether the grid is/should display headers or not
     */
    useHeaders : function () {
        return this.options.useHeaders;
    },
    /**
     * APIMethod: getByName
     * Used to get a column object by the name of the column
     *
     * Parameters:
     * colName - the name of the column
     */
    getByName : function (colName) {
        var ret;
        this.columns.each(function (col) {
            if (col.name === colName) {
                ret = col;
            }
        }, this);
        return ret;
    },
    /**
     * APIMethod: getByField
     * Used to get a column by the model field it represents
     *
     *  Parameters:
     *  field - the field name to search by
     */
    getByField : function (field) {
        var ret;
        this.columns.each(function (col) {
            if (col.options.modelField === field) {
                ret = col;
            }
        }, this);
        return ret;
    },
    /**
     * APIMethod: getByGridIndex
     * Used to get a column when all you know is the cell index in the grid
     *
     * Parameters:
     * index - an integer denoting the placement of the column in the grid
     * (zero-based)
     */
    getByGridIndex : function (index) {
        var headers = this.options.useHeaders ? 
                        this.grid.colTableBody.getFirst().getChildren() :
                        this.grid.gridTableBody.getFirst().getChildren();
        var cell = headers[index];
          var hClasses = cell.get('class').split(' ').filter(function (cls) {
            if(this.options.useHeaders)
              return cls.test('jxColHead-');
            else
              return cls.test('jxCol-');
          }.bind(this));
        var parts = hClasses[0].split('-');
        return this.getByName(parts[1]);
    },

    /**
     * APIMethod: getHeaders
     * Returns a row with the headers in it.
     *
     * Parameters:
     * row - the row to add the headers to.
     */
    getHeaders : function (tr) {
      var grid = this.grid,
          row = grid.row,
          rhc = grid.row.useHeaders() ? this.getByName(row.options.headerColumn) : null;
      if (this.useHeaders()) {
        this.columns.each(function(col, idx) {
          if (!col.isHidden() && col != rhc) {
            var classes = ['jxGridColHead', 'jxGridCol'+idx, 'jxCol-'+col.options.name, 'jxColHead-'+col.options.name],
                th;
            if (col.isEditable()) { classes.push('jxColEditable'); }
            if (col.isResizable()) { classes.push('jxColResizable'); }
            if (col.isSortable()) { classes.push('jxColSortable'); }
            th = new Element('th', {
              'class': classes.join(' ')
            });
            th.store('jxCellData', {
              column: col,
              colHeader: true,
              index: idx
            });
            th.adopt(col.getHeaderHTML());
            th.inject(tr);
          }
        });
        if (!this.hasExpandable) {
          new Element('th', {
            'class': 'jxGridColHead jxGridCellUnattached'
          }).inject(tr);
        }
      }
    },
    
    /**
     * Method: getRow
     * create a single row in the grid for a single record and populate
     * the DOM elements for it.
     *
     * Parameters:
     * tr - {DOMElement} the TR element to insert the row into
     * record - {<Jx.Record>} the record to create the row for
     */
    getRow: function(tr, record) {
      var data = {},
          grid = this.grid,
          store = grid.store,
          row = grid.row,
          rhc = grid.row.useHeaders() ? 
                     this.getByName(row.options.headerColumn) : null,
          domInserts = [],
          i = 0;
      this.columns.each(function(column, index) {
        if (!column.isHidden() && column != rhc) {
          if (column.options.renderer && column.options.renderer.domInsert) {
            domInserts.push({column: column, index: i});
          } else {
            var renderer = column.options.renderer,
                formatter = renderer.options.formatter,
                text = '';
            if (renderer.options.textTemplate) {
              text = store.fillTemplate(null, renderer.options.textTemplate, renderer.columnsNeeded);
            } else {
              text = record.data.get(column.name);
            }
            if (formatter) {
              text = formatter.format(text);
            }
            data['col'+index] = text;
          }
          i++;
        }
      });
      tr.set('html', this.rowTemplate.substitute(data));
      domInserts.each(function(obj) {
        tr.childNodes[obj.index].adopt(obj.column.getHTML());
      });
    },

    /**
     * APIMethod: calculateWidths
     * force calculation of column widths.  For columns with 'fit' this will
     * cause the column to test every value in the store to compute the
     * optimal width of the column.  Columns marked as 'expand' will get
     * any extra space left over between the column widths and the width
     * of the grid container (if any).
     */
    calculateWidths: function () {
      //to calculate widths we loop through each column
      var expand = null,
          totalWidth = 0,
          rowHeaderWidth = 0,
          gridSize = this.grid.contentContainer.getContentBoxSize(),
          leftOverSpace = 0;
      this.columns.each(function(col,idx){
        //are we checking the rowheader?
        var rowHeader = false;
        // if (col.name == this.grid.row.options.headerColumn) {
        //   rowHeader = true;
        // }
        //if it's fixed, set the width to the passed in width
        if (col.options.renderMode == 'fixed') {
          col.calculateWidth(); //col.setWidth(col.options.width);
          
        } else if (col.options.renderMode == 'fit') {
          col.calculateWidth(rowHeader);
        } else if (col.options.renderMode == 'expand' && !$defined(expand)) {
          expand = col;
        } else {
          //treat it as fixed if has width, otherwise as fit
          if ($defined(col.options.width)) {
            col.setWidth(col.options.width);
          } else {
            col.calculateWidth(rowHeader);
          }
        }
        if (!col.isHidden() /* && !(col.name == this.grid.row.options.headerColumn) */) {
            totalWidth += Jx.getNumber(col.getCellWidth());
            if (rowHeader) {
                rowHeaderWidth = col.getWidth();
            }
        }
      },this);
      
      // width of the container
      if (gridSize.width > totalWidth) {
        //now figure the expand column
        if ($defined(expand)) {
          // var leftOverSpace = gridSize.width - totalWidth + rowHeaderWidth;
          leftOverSpace = gridSize.width - totalWidth;
          //account for right borders in firefox...
          if (Browser.Engine.gecko) {
            leftOverSpace -= this.getColumnCount(true);
          } else {
            // -2 is for the right hand border on the cell and the table for all other browsers
            leftOverSpace -= 2;
          }
          if (leftOverSpace >= expand.options.width) {
            //in order for this to be set properly the cellWidth must be the
            //leftover space. we need to figure out the delta value and
            //subtract it from the leftover width
            expand.options.width = leftOverSpace;
            expand.calculateWidth();
            expand.setWidth(leftOverSpace, true);
            totalWidth += leftOverSpace;
          } else {
            expand.setWidth(expand.options.width);
          }
        }
      }
      this.grid.gridObj.setContentBoxSize({'width': totalWidth});
      this.grid.colObj.setContentBoxSize({'width': totalWidth});
    },

    /**
     * Method: createRules
     * create CSS rules for the current grid object
     */
    createRules: function(styleSheet, scope) {
      var autoRowHeight = this.grid.row.options.rowHeight == 'auto';
      this.columns.each(function(col, idx) {
        var selector = scope+' .jxGridCol'+idx,
            dec = '';
        if (autoRowHeight) {
          //set the white-space to 'normal !important'
          dec = 'white-space: normal !important';
        }
        col.cellRule = Jx.Styles.insertCssRule(selector, dec, styleSheet);
        col.cellRule.style.width = col.getCellWidth() + "px";

        selector = scope+" .jxGridCol" + idx + " .jxGridCellContent";
        col.rule = Jx.Styles.insertCssRule(selector, dec, styleSheet);
        col.rule.style.width = col.getWidth() + "px";
      }, this);
    },

    updateRule: function(column) {
        var col = this.getByName(column);
        if (col.options.renderMode === 'fit') {
          col.calculateWidth();
        }
        col.rule.style.width = col.getWidth() + "px";
        col.cellRule.style.width = col.getCellWidth() + "px";
    },
    
    /**
     * APIMethod: getColumnCount
     * returns the number of columns in this model (including hidden).
     */
    getColumnCount : function (noHidden) {
        noHidden = $defined(noHidden) ? false : true;
        var total = this.columns.length;
        if (noHidden) {
            this.columns.each(function(col){
                if (col.isHidden()) {
                    total -= 1;
                }
            },this);
        }
        return total;
    },
    /**
     * APIMethod: getIndexFromGrid
     * Gets the index of a column from its place in the grid.
     *
     * Parameters:
     * name - the name of the column to get an index for
     */
    getIndexFromGrid : function (name) {
        var headers = this.options.useHeaders ? 
                        this.grid.colTableBody.getFirst().getChildren() :
                        this.grid.gridTableBody.getFirst().getChildren(),
            c,
            i = -1,
            self = this;
        headers.each(function (h) {
            i++;
            var hClasses = h.get('class').split(' ').filter(function (cls) {
                if(self.options.useHeaders)
                  return cls.test('jxColHead-');
                else
                  return cls.test('jxCol-');
            });
            hClasses.each(function (cls) {
                if (cls.test(name)) {
                    c = i;
                }
            });
        }, this);
        return c;
    }

});
