// $Id$
/**
 * Class: Jx.Plugin.Selector
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
        column : false
    },
    /**
     * Property: bound
     * storage for bound methods useful for working with events
     */
    bound: {},
    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function() {
        this.parent();
        this.bound.select = this.select.bind(this);
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
        if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
            return;
        }
        this.grid = grid;
        this.grid.addEvent('gridCellSelect', this.bound.select);
        if (this.options.cell) {
            this.oldSelectionClass = this.grid.selection.options.selectedClass;
            this.grid.selection.options.selectClass = "jxGridCellSelected";
        }
    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        if (this.grid) {
            this.grid.removeEvent('gridCellSelect', this.bound.select);
            if (this.options.cell) {
                this.grid.selection.options.selectedClass = this.oldSelectionClass;
            }
        }
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
        if (opt === 'cell') {
            this.oldSelectionClass = this.grid.selection.options.selectedClass;
            this.grid.selection.options.selectClass = "jxGridCellSelected";
        }
    },
    /**
     * APIMethod: deactivate
     * Allows programatic access to turning selections off.
     * 
     * Parameters:
     * opt - the option to turn off. One of 'cell', 'column', or 'row'
     */
    deactivate: function (opt) {
        this.options[opt] = false;
        if (opt === 'cell') {
            this.grid.selection.selected().each(function(cell){
                this.grid.selection.unselect(cell);
            },this);
            this.grid.selection.options.selectClass = this.oldSelectionClass;
            
        } else if (opt === 'row') {
            this.selectedRow.removeClass('jxGridRowSelected');
            this.selectedRow = null;
            this.selectedRowHead.removeClass('jxGridRowHeaderSelected');
            this.selectedRowHead = null;
        } else {
            if ($defined(this.selectedCol)) {
                for (var i = 0; i < this.grid.gridTable.rows.length; i++) {
                    this.grid.gridTable.rows[i].cells[this.selectedCol].removeClass('jxGridColumnSelected');
                }
            }
            this.selectedColHead.removeClass('jxGridColumnHeaderSelected');
            this.selectedColHead = null;
            this.selectedCol = null;
        }
    },
    /**
     * Method: select
     * dispatches the grid click to the various selection methods
     */
    select : function (cell) {

        console.log('select method');
        var data = cell.retrieve('jxCellData');
        console.log(data);

        if (this.options.row) {
            this.selectRow(data.row);
        }

        if (this.options.column) {
            this.selectColumn(data.index - 1);
        }

    },
    /**
     * Method: selectRow
     * Select a row and apply the jxGridRowSelected style to it.
     *
     * Parameters:
     * row - {Integer} the row to select
     */
    selectRow: function (row) {
        if (!this.options.row) { return; }

        var tr = (row >= 0 && row < this.grid.gridTableBody.rows.length) ? this.grid.gridTableBody.rows[row] : null;

        if (tr.hasClass('jxGridRowSelected')) {
            this.selectedRow.removeClass('jxGridRowSelected');
            this.selectedRow = null;
        } else {
            if (this.selectedRow) {
                this.selectedRow.removeClass('jxGridRowSelected');
            }
            this.selectedRow = $(tr);
            this.selectedRow.addClass('jxGridRowSelected');
        }
        this.selectRowHeader(row);

    },
    /**
     * Method: selectRowHeader
     * Apply the jxGridRowHea}derSelected style to the row header cell of a
     * selected row.
     *
     * Parameters:
     * row - {Integer} the row header to select
     */
    selectRowHeader: function (row) {
        if (!this.grid.row.useHeaders()) {
            return;
        }
        var cell = (row >= 0 && row < this.grid.rowTableHead.rows.length) ? this.grid.rowTableHead.rows[row].cells[0] : null;

        if (!cell) {
            return;
        }
        if (this.selectedRowHead) {
            this.selectedRowHead.removeClass('jxGridRowHeaderSelected');
        }
        if (this.selectedRowHead !== cell) {
            this.selectedRowHead = $(cell);
            cell.addClass('jxGridRowHeaderSelected');
        } else if (cell.hasClass('jxgridRowHeaderSelected')) {
            this.selectedRowHead = null;
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
        if (col >= 0 && col < this.grid.gridTable.rows[0].cells.length) {
            if ($defined(this.selectedCol)) {
                for (var i = 0; i < this.grid.gridTable.rows.length; i++) {
                    this.grid.gridTable.rows[i].cells[this.selectedCol].removeClass('jxGridColumnSelected');
                }
            }
            if (col !== this.selectedCol) {
                this.selectedCol = col;
                for (i = 0; i < this.grid.gridTable.rows.length; i++) {
                    this.grid.gridTable.rows[i].cells[col].addClass('jxGridColumnSelected');
                }
            } else {
                this.selectedCol = null;
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
        if (this.grid.colTableBody.rows.length === 0
                || !this.grid.row.useHeaders()) {
            return;
        }


        var cell = (col >= 0 && col < this.grid.colTableBody.rows[0].cells.length) ? this.grid.colTableBody.rows[0].cells[col]
                                                                                                                          : null;
        if (cell === null) {
            return;
        }

        if (this.selectedColHead) {
            this.selectedColHead.removeClass('jxGridColumnHeaderSelected');
        }
        if (this.selectedColHead !== cell) {
            this.selectedColHead = $(cell);
            cell.addClass('jxGridColumnHeaderSelected');
        } else {
            this.selectedColHead = null;
        }

    }
});
