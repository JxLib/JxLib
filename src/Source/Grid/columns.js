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

    parameters: ['options','grid'],
    /**
     * Property: hasExpandable
     * 
     */
    hasExpandable: null,

    /**
     * APIMethod: init
     * Creates the class.
     */
    init : function () {
        this.parent();

        if ($defined(this.options.grid) && this.options.grid instanceof Jx.Grid) {
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
            if (c.options.renderMode === 'expand') {
                this.hasExpandable = true;
            }

        }, this);
    },
    /**
     * APIMethod: getHeaderHeight
     * returns the height of the column header row
     *
     * Parameters:
     * recalculate - determines if we should recalculate the height. Currently does nothing.
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
     * index - an integer denoting the placement of the column in the grid (zero-based)
     */
    getByGridIndex : function (index) {
        var headers = this.options.useHeaders ? 
                        this.grid.colTableBody.getFirst().getChildren() :
                        this.grid.gridTableBody.getFirst().getChildren();
        var cell = headers[index];
          var hClasses = cell.get('class').split(' ').filter(function (cls) {
            if(this.options.useHeaders)
              return cls.test('jxColHead-')
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
    getHeaders : function (list) {
        var r = this.grid.row.useHeaders();
        var hf = this.grid.row.getRowHeaderColumn();
        this.columns.each(function (col, idx) {
            if (r && hf === col.options.name) {
                //do nothing
            } else if (!col.isHidden()) {
                var th = new Element('th', {
                    'class' : 'jxGridColHead jxGridCol'+idx
                });
                th.adopt(col.getHeaderHTML());
                // th.setStyle('width', col.getWidth());
                th.addClass('jxColHead-' + col.name);
                //add other styles for different attributes
                if (col.isEditable()) {
                    th.addClass('jxColEditable');
                }
                if (col.isResizable()) {
                    th.addClass('jxColResizable');
                }
                if (col.isSortable()) {
                    th.addClass('jxColSortable');
                }
                list.add(th);
                th.store('jxCellData', {
                   column: col,
                   colHeader: true,
                   index: idx
                });
            }
        }, this);
        return list;
    },
    /**
     * APIMethod: getColumnCells
     * Appends the cells from each column for a specific row
     *
     * Parameters:
     * list - the Jx.List instance to add the cells to.
     */
    getColumnCells : function (list) {
        var r = this.grid.row;
        var f = r.getRowHeaderColumn();
        var h = r.useHeaders();
        this.columns.each(function (col, idx) {
            if (h && col.name !== f && !col.isHidden()) {
                list.add(this.getColumnCell(col, idx));
            } else if (!h && !col.isHidden()) {
                list.add(this.getColumnCell(col, idx));
            }
        }, this);
        if (!this.hasExpandable) {
            list.add(new Element('td',{
                'class': 'jxGridCellUnattached'
            }));
        }
    },
    /**
     * APIMethod: getColumnCell
     * Returns the cell (td) for a particular column.
     *
     * Paremeters:
     * col - the column to get a cell for.
     */
    getColumnCell : function (col, idx) {

        var td = new Element('td', {
            'class' : 'jxGridCell'
        });
        td.adopt(col.getHTML());
        td.addClass('jxCol-' + col.name);
        td.addClass('jxGridCol'+idx);
        //add other styles for different attributes
        if (col.isEditable()) {
            td.addClass('jxColEditable');
        }
        if (col.isResizable()) {
            td.addClass('jxColResizable');
        }
        if (col.isSortable()) {
            td.addClass('jxColSortable');
        }
        if (!col.isAttached()) {
            td.addClass('jxGridCellUnattached');
        }

        td.store('jxCellData',{
            col: col,
            index: idx, //This is the position of the column
            row: this.grid.model.getPosition()
        });

        return td;
    },
    
    calculateWidths: function () {
      //to calculate widths we loop through each column
      var expand = null;
      var totalWidth = 0;
      var rowHeaderWidth = 0;
      this.columns.each(function(col,idx){
        //are we checking the rowheader?
        var rowHeader = false;
        if (col.name == this.grid.row.options.headerColumn) {
          rowHeader = true;
        }
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
        if (!col.isHidden() && !(col.name == this.grid.row.options.headerColumn)) {
            totalWidth += Jx.getNumber(col.getCellWidth());
            if (rowHeader) {
                rowHeaderWidth = col.getWidth();
            }
        }
      },this);
      
      // width of the container
      //var containerWidth = this.grid.gridObj.getContentBoxSize();
      var gridSize = this.grid.gridObj.getContentBoxSize();
      if (gridSize.width > totalWidth) {
        //now figure the expand column
        if ($defined(expand)) {
          // var leftOverSpace = gridSize.width - totalWidth + rowHeaderWidth;
          var leftOverSpace = gridSize.width - totalWidth
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
      } //else {
      this.grid.gridTable.setContentBoxSize({'width': totalWidth});
      this.grid.colTable.setContentBoxSize({'width': totalWidth});
      // }
    },

    createRules: function(styleSheet, scope) {
        this.columns.each(function(col, idx) {
            var selector = scope+' .jxGridCol'+idx
            var dec = '';
            if (col.options.renderMode === 'fixed' || col.options.renderMode === 'expand') {
              //set the white-space to 'normal !important'
              dec = 'white-space: normal !important';
            }
            col.cellRule = Jx.Styles.insertCssRule(selector, dec, styleSheet);
            col.cellRule.style.width = col.getCellWidth() + "px";

            var selector = scope+" .jxGridCol" + idx + " .jxGridCellContent";
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
                        this.grid.gridTableBody.getFirst().getChildren();
        var c;
        var i = -1;
        var self = this;
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
