/*
---

name: Jx.Plugin.Grid.Selector

description: Allows selecting rows, columns, and cells in grids

license: MIT-style license.

requires:
 - Jx.Plugin.Grid

provides: [Jx.Plugin.Grid.Selector]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Grid.Selector
 *
 * Extends: <Jx.Plugin>
 *
 * Grid plugin to select rows, columns, and/or cells.
 *
 * Original selection code from Jx.Grid's original class
 *
 * License:
 * Original Copyright (c) 2008, DM Solutions Group Inc.
 * This version Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Grid.Selector = new Class({

    Extends : Jx.Plugin,
    Family: 'Jx.Plugin.Grid.Selector',
    
    name: 'Selector',

    Binds: ['select','checkSelection','checkAll','afterGridRender','onCellClick', 'sort', 'updateCheckColumn', 'updateSelectedRows'],

    options : {
        /**
         * Option: cell
         * determines if cells are selectable
         */
        cell : false,
        /**
         * Option: row
         * determines if rows are selectable
         */
        row : false,
        /**
         * Option: column
         * determines if columns are selectable
         */
        column : false,
        /**
         * Option: multiple
         * Allow multiple selections
         */
        multiple: false,
        /**
         * Option: useCheckColumn
         * Whether to use a check box column as the row header or as the
         * first column in the grid and use it for manipulating selections.
         */
        useCheckColumn: false,
        /**
         * Option: checkAsHeader
         * Determines if the check column is the header of the rows
         */
        checkAsHeader: false,
        /**
         * Option: sortableColumn
         * Determines if the check column is sortable
         */
        sortableColumn: false
    },
    
    domInsert: true,
    
    /**
     * Property: selected
     * Holds arrays of selected rows and/or columns and their headers
     */
    selected: null,

    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function() {
        this.parent();
        this.selected = {
            cells: [],
            columns: [],
            rows: [],
            rowHeads: [],
            columnHeads: []
        };
    },
    /**
     * APIMethod: attach
     * Sets up the plugin and attaches the plugin to the grid events it
     * will be monitoring
     *
     * Parameters:
     * grid - The instance of Jx.Grid to attach to
     */
    attach: function (grid) {
        if (grid === undefined || grid === null || !(grid instanceof Jx.Grid)) {
            return;
        }
        this.parent(grid);
        var options = this.options,
            template;
        this.grid = grid;
        
        this.grid.addEvent('gridSortFinished', this.updateSelectedRows);
        
        //setup check column if needed
        if (options.useCheckColumn) {
          grid.addEvent('gridDrawRow', this.updateCheckColumn);
          template = '<span class="jxGridCellContent">';
          if (options.multiple) {
            template += '<span class="jxInputContainer jxInputContainerCheck"><input class="jxInputCheck" type="checkbox" name="checkAll" id="checkAll"/></span>';
          } else {
            template += '</span>';
          }

          template += "</span>";

          this.checkColumn = new Jx.Column({
            template: template,
            renderMode: 'fixed',
            width: 20,
            renderer: null,
            name: 'selection',
            isSortable: options.sortableColumn || false,
            sort: options.sortableColumn ? this.sort : null
          }, grid);
          this.checkColumn.options.renderer = this;
          grid.columns.columns.reverse();
          grid.columns.columns.push(this.checkColumn);
          grid.columns.columns.reverse();

          if (options.checkAsHeader) {
              this.oldHeaderColumn = grid.row.options.headerColumn;
              grid.row.options.useHeaders = true;
              grid.row.options.headerColumn = 'selection';

              if (options.multiple) {
                  grid.addEvent('doneCreateGrid', this.afterGridRender);
              }
          }
          //attach event to header
          if (options.multiple) {
              document.id(this.checkColumn).getElement('input').addEvents({
                  'change': this.checkAll
              });
          }
        } else {
          grid.addEvent('gridCellClick', this.onCellClick);
        }
    },
    
    /**
     * Method: render
     * required for the renderer interface
     */
    render: function() {
      this.domObj = new Element('span', {
        'class': 'jxGridCellContent'
      });
      new Element('input', {
        'class': 'jxGridSelector',
        type: 'checkbox',
        events: {
          change: this.checkSelection
        }
      }).inject(this.domObj);
    },
    
    /**
     * Method: toElement
     * required for the Renderer interface
     */
    toElement: function() {
      return this.domObj;
    },
    
    /**
     * Method: updateCheckColumn
     * check to see if a row needs to have its checkbox updated after its been drawn
     *
     * Parameters:
     * index - {Integer} the row that was just rendered
     * record - {<Jx.Record>} the record that was rendered into that row
     */
    updateCheckColumn: function(index, record) {
      var state = this.selected.rows.contains(index),
          r = this.grid.gridTableBody.rows,
          tr = document.id((index >= 0 && index < r.length) ? r[index] : null);
      
      if (tr) {
        tr.store('jxRowData', {row: index});
        if (state) {
          tr.addClass('jxGridRowSelected');
        } else {
          tr.removeClass('jxGridRowSelected');
        }
        this.setCheckField(index, state);
      }
    },

    /**
     * Method: afterGridRender
     */
    afterGridRender: function () {
        if (this.options.checkAsHeader) {
            var chkCol = document.id(this.checkColumn).clone();
            chkCol.getElement('input').addEvent('change',this.checkAll);
            this.grid.rowColContainer.adopt(chkCol);
        }
        this.grid.removeEvent('doneCreateGrid',this.afterGridRender);
    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        var grid = this.grid,
            options = this.options,
            col;
        if (grid) {
            grid.gridTableBody.removeEvents({
              click: this.onCellClick
            });
            if (this.checkColumn) {
                grid.columns.columns.erase(this.checkColumn);
                this.checkColumn.destroy();
                this.checkColumn = null;
            }
            if (options.useCheckColumn) {
                grid.removeEvent('gridDrawRow', this.updateCheckColumn);
                if (options.checkAsHeader) {
                    grid.row.options.headerColumn = this.oldHeaderColumn;
                }
            }
        }
        this.grid.removeEvent('gridSortFinished', this.updateSelectedRows);
        
        this.grid = null;
    },
    /**
     * APIMethod: activate
     * Allows programatic access to turning selections on.
     *
     * Parameters:
     * opt - the option to turn on. One of 'cell', 'column', or 'row'
     */
    activate: function (opt) {
        this.options[opt] = true;
    },
    /**
     * APIMethod: deactivate
     * Allows programatic access to turning selections off.
     *
     * Parameters:
     * opt - the option to turn off. One of 'cell', 'column', or 'row'
     */
    deactivate: function (opt) {
        var gridTableRows = this.grid.gridTableBody.rows,
            selected = this.selected,
            i;
        this.options[opt] = false;
        if (opt === 'cell') {
            selected.cells.each(function(cell) {
              cell.removeClass('jxGridCellSelected');
            });
            selected.cells = [];
        } else if (opt === 'row') {
          this.getSelectedRows().each(function(row){
            idx = row.retrieve('jxRowData').row;
            row.removeClass('jxGridRowSelected');
            this.setCheckField(idx,false);
          }, this);
          selected.rows = [];
          selected.rowHeads.each(function(rowHead){
            rowHead.removeClass('jxGridRowHeaderSelected');
          });
          selected.rowHeads = [];
        } else {
            selected.columns.each(function(column){
                for (i = 0; i < gridTableRows.length; i++) {
                    gridTableRows[i].cells[column].removeClass('jxGridColumnSelected');
                }
            });
            selected.columns = [];

            selected.columnHeads.each(function(rowHead){
                rowHead.removeClass('jxGridColumnHeaderSelected');
            },this);
            selected.columnHeads = [];
        }
    },
    
    /**
     * Method: onCellClick
     * dispatch clicking on a table cell
     */
    onCellClick: function(cell) {
        if (cell) {
            this.select(cell);
        }
    },
    
    /**
     * Method: select
     * dispatches the grid click to the various selection methods
     */
    select : function (cell) {
        var data = cell.retrieve('jxCellData'),
            options = this.options,
            col;

        if (options.cell && 
            data.row !== undefined && 
            data.row !== null && 
            data.index !== undefined && 
            data.index !== null) {
          this.selectCell(cell);
        }
        
        if (options.row && data.row !== undefined && data.row !== null) {
            this.selectRow(data.row);
        }

        if (options.column && data.index !== undefined && data.index !== null) {
            if (this.grid.row.useHeaders()) {
                this.selectColumn(data.index - 1);
            } else {
                this.selectColumn(data.index);
            }
        }
    },
    
    /**
     * Method: selectCell
     * select a cell
     *
     * Parameters: 
     * cell - {DOMElement} the cell element to select
     */
    selectCell: function(cell) {
        if (!this.options.cell) { return; }
        var cells = this.selected.cells;
        if (cell.hasClass('jxGridCellSelected')) {
          cell.removeClass('jxGridCellSelected');
          cells.erase(cell);
          this.fireEvent('unselectCell', cell);
        } else {
          cell.addClass('jxGridCellSelected');
          cells.push(cell);
          this.fireEvent('selectCell', cell);
        }
    },
    
    updateSelectedRows: function() {
      if (!this.options.row) { return; }
      var options = this.options,
          r = this.grid.gridTableBody.rows,
          rows = [];
          
      for (var i=0; i<r.length; i++) {
        if (r[i].hasClass('jxGridRowSelected')) {
          rows.push(i);
        }
      }
      this.selected.rows = rows;
    },
    
    /**
     * Method: selectRow
     * Select a row and apply the jxGridRowSelected style to it.
     *
     * Parameters:
     * row - {Integer} the row to select
     */
    selectRow: function (row, silently) {
        if (!this.options.row) { return; }
        var options = this.options,
            r = this.grid.gridTableBody.rows,
            tr = document.id((row >= 0 && row < r.length) ? r[row] : null),
            rows = this.selected.rows,
            silently = (silently !== undefined && silently !== null) ? silently : false;
        if (tr) {
            if (tr.hasClass('jxGridRowSelected')) {
                tr.removeClass('jxGridRowSelected');
                this.setCheckField(row, false);
                if (options.multiple && options.useCheckColumn) {
                    if (options.checkAsHeader) {
                        document.id(this.grid.rowColContainer).getElement('input').removeProperty('checked');
                    } else {
                        document.id(this.checkColumn).getElement('input').removeProperty('checked');
                    }
                }
                //search array and remove this item
                rows.erase(row);
                if (!silently) {
                  this.fireEvent('unselectRow', row);
                }
            } else {
                tr.store('jxRowData', {row: row});
                rows.push(row);
                tr.addClass('jxGridRowSelected');
                this.setCheckField(row, true);
                if (!silently) {
                  this.fireEvent('selectRow', row);
                }
            }

            if (!this.options.multiple) {
                var unselected = [];
                this.getSelectedRows().each(function(row) {
                  var idx;
                  if (row !== tr) {
                    idx = row.retrieve('jxRowData').row;
                    row.removeClass('jxGridRowSelected');
                    this.setCheckField(idx,false);
                    rows.erase(row);
                    unselected.push(idx);
                    if (!silently) {
                      this.fireEvent('unselectRow', row);
                    }
                  }
                  
                }, this);
                if (unselected.length && !silently) {
                  this.fireEvent('unselectRows', [unselected]);
                }
            }
        }
        this.selectRowHeader(row);
    },

    /**
     * Method: setCheckField
     */
    setCheckField: function (row, checked) {
        var grid = this.grid,
            options = this.options,
            check,
            col,
            cell;
        if (options.useCheckColumn) {
            if (options.checkAsHeader) {
              cell = document.id(grid.rowTableBody.rows[row].cells[0]);
            } else {
              col = grid.columns.getIndexFromGrid(this.checkColumn.name);
              cell = document.id(grid.gridTableBody.rows[row].cells[col]);
            }
            check = cell.getElement('.jxGridSelector');
            check.set('checked', checked);
        }
    },
    /**
     * Method: selectRowHeader
     * Apply the jxGridRowHeaderSelected style to the row header cell of a
     * selected row.
     *
     * Parameters:
     * row - {Integer} the row header to select
     */
    selectRowHeader: function (row) {
        if (!this.grid.row.useHeaders()) {
            return;
        }
        var rows = this.grid.rowTableBody.rows,
            cell = document.id((row >= 0 && row < rows.length) ? 
                              rows[row].cells[0] : null),
            cells;

        if (!cell) {
            return;
        }
        cells = this.selected.rowHeads;
        if (cells.contains(cell)) {
            cell.removeClass('jxGridRowHeaderSelected');
            cells.erase(cell);
        } else {
          cell.addClass('jxGridRowHeaderSelected');
          cells.push(cell);
        }

        if (!this.options.multiple) {
          cells.each(function(c){
            if (c !== cell) {
              c.removeClass('jxGridRowHeaderSelected');
              cells.erase(c);
            }
          },this);
        }

    },
    /**
     * Method: selectColumn
     * Select a column.
     * This deselects a previously selected column.
     *
     * Parameters:
     * col - {Integer} the column to select
     */
    selectColumn: function (col) {
        var gridTable = this.grid.gridTableBody,
            cols = this.selected.columns,
            m = '',
            i;
        if (col >= 0 && col < gridTable.rows[0].cells.length) {
            if (cols.contains(col)) {
                //deselect
                m = 'removeClass';
                cols.erase(col);
                this.fireEvent('unselectColumn', col);
            } else {
                //select
                m = 'addClass';
                cols.push(col);
                this.fireEvent('selectColumn', col);
            }
            for (i = 0; i < gridTable.rows.length; i++) {
                gridTable.rows[i].cells[col][m]('jxGridColumnSelected');
            }

            if (!this.options.multiple) {
                cols.each(function(c){
                  if (c !== col) {
                      for (i = 0; i < gridTable.rows.length; i++) {
                          gridTable.rows[i].cells[c].removeClass('jxGridColumnSelected');
                      }
                      cols.erase(c);
                      this.fireEvent('unselectColumn', c);
                  }
                }, this);
            }
            this.selectColumnHeader(col);
        }
    },
    /**
     * method: selectColumnHeader
     * Apply the jxGridColumnHeaderSelected style to the column header cell of a
     * selected column.
     *
     * Parameters:
     * col - {Integer} the column header to select
     */
    selectColumnHeader: function (col) {
        var rows = this.grid.colTableBody;
        if (rows.length === 0 || !this.grid.row.useHeaders()) {
            return;
        }

        var cell = (col >= 0 && col < rows[0].cells.length) ?
            rows[0].cells[col] : null;

        if (cell === null) {
            return;
        }

        cell = document.id(cell);
        cells = this.selected.columnHeads;

        if (cells.contains(cell)) {
            cell.removeClass('jxGridColumnHeaderSelected');
            cells.erase(cell);
        } else {
          cell.addClass('jxGridColumnHeaderSelected');
          cells.push(cell);
        }

        if (!this.options.multiple) {
          cells.each(function(c){
            if (c !== cell) {
              c.removeClass('jxGridColumnHeaderSelected');
              cells.erase(c);
            }
          });
        }
    },
    /**
     * Method: checkSelection
     * Checks whether a row's check box is/isn't checked and modifies the
     * selection appropriately.
     *
     * Parameters:
     * column - <Jx.Column> that created the checkbox
     * field - <Jx.Field.Checkbox> instance that was checked/unchecked
     * created the checkbox
     */
    checkSelection: function (event) {
      var cell =  event.target.getParent('tr'),
          row;
      if (cell) {
        row = cell.getParent().getChildren().indexOf(cell);
        this.selectRow(row);
      }
    },
    /**
     * Method: checkAll
     * Checks all checkboxes in the column the selector inserted.
     */
    checkAll: function () {
        var grid = this.grid,
            col,
            rows,
            selection = [],
            checked = this.options.checkAsHeader ? 
                          grid.rowColContainer.getElement('input').get('checked') :
                          this.checkColumn.domObj.getElement('input').get('checked'),
            event = checked ? 'selectRows' : 'unselectRows';

        if (this.options.checkAsHeader) {
            col = 0;
            rows = grid.rowTableBody.rows;
        } else {
            col = grid.columns.getIndexFromGrid(this.checkColumn.name);
            rows = grid.gridTableBody.rows;
        }

        Array.from(rows).each(function(row, idx) {
            var check = row.cells[col].getElement('input');
            if (check !== undefined && check !== null) {
                var rowChecked = check.get('checked');
                if (rowChecked !== checked) {
                    this.selectRow(idx, true);
                    selection.push(idx);
                }
            }
        }, this);
        
        this.fireEvent(event, [selection]);
    },
    
    sort: function(dir) {
      var grid = this.grid,
          store = grid.store,
          data = store.data,
          gridTableBody= grid.gridTableBody,
          gridParent = gridTableBody.getParent(),
          useHeaders = grid.row.useHeaders(),
          rowTableBody = grid.rowTableBody,
          rowParent = rowTableBody.getParent(),
          selected = this.getSelectedRows();
      
      // sorting only works for rows and when more than zero are selected
      // in fact it is probably only useful if multiple selections are also enabled
      // but that is not a hard rule for this method
      if (!this.options.row || selected.length == 0) {
        console.log('not sorting by selection, nothing to sort');
        return;
      }
      
      store.each(function(record, index) {
        record.dom = {
          cell: gridTableBody.childNodes[index],
          row: useHeaders ? rowTableBody.childNodes[index] : null
        };
      });

      gridTableBody.dispose();
      if (useHeaders) {
        rowTableBody.dispose();
      }
      selected.sort(function(a,b) {
        return a.retrieve('jxRowData').row - b.retrieve('jxRowData').row;
      }).each(function(row) {
        console.log('moving row ' + row.retrieve('jxRowData').row + ' to beginning of array');
        data.unshift(data.splice(row.retrieve('jxRowData').row,1)[0]);
      });

      if (dir == 'desc') {
        data.reverse();
      }

      store.each(function(record, index) {
        record.dom.cell.inject(gridTableBody);
        record.dom.cell.store('jxRowData', {row: index});
        if (useHeaders) {
          record.dom.row.inject(rowTableBody);
        }
      });

      if (gridParent) {
        gridParent.adopt(gridTableBody);
      }
      if (useHeaders && rowParent) {
        rowParent.adopt(rowTableBody);
      }
    },
    
    getSelectedRows: function() {
      var rows = [],
          selected = this.selected.rows,
          r = this.grid.gridTableBody.rows;
      selected.each(function(row) {
        var tr = document.id((row >= 0 && row < r.length) ? r[row] : null);
        if (tr) {
          rows.push(tr);
        }
      });
      return rows;
    }
});
