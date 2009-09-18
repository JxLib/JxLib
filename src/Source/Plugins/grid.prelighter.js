// $Id: $
/**
 * Class: Jx.Plugin.Prelighter
 * 
 * Extends: <Jx.Plugin>
 * 
 * Grid plugin to prelight rows, columns, and cells
 * 
 * Inspired by the original code in Jx.Grid
 * 
 * License: 
 * Original Copyright (c) 2008, DM Solutions Group Inc.
 * This version Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Grid.Prelighter = new Class({

    Extends : Jx.Plugin,

    options : {
        /**
         * Option: cell
         * defaults to false.  If set to true, the cell under the mouse is
         * highlighted as the mouse moves.
         */
        cell : false,
        /**
         * Option: row
         * defaults to false.  If set to true, the row under the mouse is
         * highlighted as the mouse moves.
         */
        row : false,
        /**
         * Option: column
         * defaults to false.  If set to true, the column under the mouse is
         * highlighted as the mouse moves.
         */
        column : false,
        /**
         * Option: rowHeader
         * defaults to false.  If set to true, the row header of the row under
         * the mouse is highlighted as the mouse moves.
         */
        rowHeader : false,
        /**
         * Option: columnHeader
         * defaults to false.  If set to true, the column header of the column
         * under the mouse is highlighted as the mouse moves.
         */
        columnHeader : false
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
        this.bound.prelight = this.prelight.bind(this);
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
        this.grid.addEvent('gridMove', this.bound.prelight);
    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        if (this.grid) {
            this.grid.removeEvent('gridMove', this.bound.prelight);
        }
        this.grid = null;
    },
    /**
     * Method: prelight
     * dispatches the event to the various prelight methods.
     */
    prelight : function (rc) {
        if ($defined(rc) && rc.column !== -1 && rc.row !== -1) {

            var row = rc.row;
            if (this.grid.columns.useHeaders()) {
                row--;
            }
            var column = rc.column;
            if (this.grid.row.useHeaders()) {
                column--;
            }

            if (this.options.cell) {
                this.prelightCell(row, column);
            }
            if (this.options.row) {
                this.prelightRow(row);
            }
            if (this.options.column) {
                this.prelightColumn(column);
            }
            if (this.options.rowHeader) {
                this.prelightRowHeader(row);
            }
            if (this.options.columnHeader) {
                this.prelightColumnHeader(column);
            }
        }
    },
    /** 
     * Method: prelightRowHeader
     * apply the jxGridRowHeaderPrelight style to the header cell of a row.
     * This removes the style from the previously pre-lit row header.
     * 
     * Parameters:
     * row - {Integer} the row to pre-light the header cell of
     */
    prelightRowHeader : function (row) {
        var cell = (row >= 0 && row < this.grid.rowTableHead.rows.length) ? this.grid.rowTableHead.rows[row].cells[0]
                : null;
        if (this.prelitRowHeader !== cell) {
            if (this.prelitRowHeader) {
                this.prelitRowHeader
                        .removeClass('jxGridRowHeaderPrelight');
            }
            this.prelitRowHeader = cell;
            if (this.prelitRowHeader) {
                this.prelitRowHeader
                        .addClass('jxGridRowHeaderPrelight');
            }
        }
    },
    /** 
     * Method: prelightColumnHeader
     * apply the jxGridColumnHeaderPrelight style to the header cell of a column.
     * This removes the style from the previously pre-lit column header.
     * 
     * Parameters:
     * col - {Integer} the column to pre-light the header cell of
     */
    prelightColumnHeader : function (col) {
        if (this.grid.colTableBody.rows.length === 0) {
            return;
        }

        var cell = (col >= 0 && col < this.grid.colTableBody.rows[0].cells.length) ? this.grid.colTableBody.rows[0].cells[col]
                : null;
        if (this.prelitColumnHeader !== cell) {
            if (this.prelitColumnHeader) {
                this.prelitColumnHeader
                        .removeClass('jxGridColumnHeaderPrelight');
            }
            this.prelitColumnHeader = cell;
            if (this.prelitColumnHeader) {
                this.prelitColumnHeader
                        .addClass('jxGridColumnHeaderPrelight');
            }
        }
    },
    /** 
     * Method: prelightRow
     * apply the jxGridRowPrelight style to row.
     * This removes the style from the previously pre-lit row.
     * 
     * Parameters:
     * row - {Integer} the row to pre-light
     */
    prelightRow : function (row) {
        var tr = (row >= 0 && row < this.grid.gridTableBody.rows.length) ? this.grid.gridTableBody.rows[row]
                : null;

        if (this.prelitRow !== row) {
            if (this.prelitRow) {
                this.prelitRow.removeClass('jxGridRowPrelight');
            }
            this.prelitRow = tr;
            if (this.prelitRow) {
                this.prelightRowHeader(row);
                this.prelitRow.addClass('jxGridRowPrelight');
            }
        }
    },
    /** 
     * Method: prelightColumn
     * apply the jxGridColumnPrelight style to a column.
     * This removes the style from the previously pre-lit column.
     * 
     * Parameters:
     * col - {Integer} the column to pre-light
     */
    prelightColumn : function (col) {
        if (col >= 0 && col < this.grid.gridTable.rows[0].cells.length) {
            if ($chk(this.prelitColumn)) {
                for (var i = 0; i < this.grid.gridTable.rows.length; i++) {
                    this.grid.gridTable.rows[i].cells[this.prelitColumn]
                            .removeClass('jxGridColumnPrelight');
                }
            }
            this.prelitColumn = col;
            for (i = 0; i < this.grid.gridTable.rows.length; i++) {
                this.grid.gridTable.rows[i].cells[col]
                        .addClass('jxGridColumnPrelight');
            }
            this.prelightColumnHeader(col);
        }
    },
    /** 
     * Method: prelightCell
     * apply the jxGridCellPrelight style to a cell.
     * This removes the style from the previously pre-lit cell.
     *
     * Parameters:
     * row - {Integer} the row of the cell to pre-light
     * col - {Integer} the column of the cell to pre-light
     */
    prelightCell : function (row, col) {
        var td = (row >= 0 && col >= 0
                && row < this.grid.gridTableBody.rows.length && col < this.grid.gridTableBody.rows[row].cells.length) ? this.grid.gridTableBody.rows[row].cells[col]
                : null;
        if (this.prelitCell !== td) {
            if (this.prelitCell) {
                this.prelitCell.removeClass('jxGridCellPrelight');
            }
            this.prelitCell = td;
            if (this.prelitCell) {
                this.prelitCell.addClass('jxGridCellPrelight');
            }
        }
    }
});
