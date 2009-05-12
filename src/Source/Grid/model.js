/**
 * Class: Jx.Grid.Model
 *
 * Extends: Object
 *
 * Implements: Options, Events
 *
 * A Jx.Grid.Model is the source of data for a <Jx.Grid> instance.  The
 * default implementation of the grid model works with two-dimensional
 * arrays of data and acts as a convenient base class for custom models
 * based on other sources of data.
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Grid.Model = new Class({
    Family: 'Jx.Grid.Model',
    Implements: [Events, Options],
    options: {
        /* Option: colHeaderHeight
         * default 28, the height of the column header row
         */
        colHeaderHeight: 28,
        /* Option: colHeaderHeight
         * default 28, the height of the column header row
         */
        rowHeaderWidth: 28,
        /* Option: rowHeaderWidth
         * default 28, the width of the row header column.
         */
        colWidth: 50,
        /* Option: colWidth
         * default 50, the width of columns
         */
        rowHeight: 20,
        /* Option: rowHeight
         * default 20, the height of rows
         */
        rowHeaders: null,
        /* Option: columnHeaders
         * optional column headers, defaults to null
         */
        columnHeaders: null
    },
    data: null,
    /**
     * Constructor: Jx.Grid.Model
     * create a new grid model
     *
     * Parameters:
     * data - array of data to display in the grid
     * options - <Jx.Grid.Model.Options>
     */
    initialize: function(data, options) {
        this.data = data || [];
        this.setOptions(options);
    },
    /** 
     * Method: getColumnCount
     * This function returns the number of columns of data in the 
     * model as an integer value.
     */ 
    getColumnCount: function() { return (this.data && this.data[0]) ? this.data[0].length : 0; },
    /* Method: getColumnHeaderHTML
     * This function returns an HTML string to be placed in the
     * column header for the given column index.
     */ 
    getColumnHeaderHTML: function(col) { 
        return this.options.columnHeaders?this.options.columnHeaders[col]:col+1;
     },
     /* Method: getColumnHeaderHeight
      * This function returns an integer which is the height of the
      * column header row in pixels.
      */ 
    getColumnHeaderHeight: function() { return this.options.colHeaderHeight; },
    /* Method: getColumnWidth
     * This function returns an integer which is the width of the
     * given column in pixels.
     */ 
    getColumnWidth: function(col) { return this.options.colWidth; },
    /* Method: getRowHeaderHTML
     * This function returns an HTML string to be placed in the row
     * header for the given row index
     */ 
    getRowHeaderHTML: function(row) { 
        return this.options.rowHeaders?this.options.rowHeaders[row]:row+1; 
    },
    /* Method: getRowHeaderWidth
     * This function returns an integer which is the width of the row
     * header column in pixels.
     */ 
    getRowHeaderWidth: function() { return this.options.rowHeaderWidth; },
    /* Method: getRowHeight
     * This function returns an integer which is the height of the
     * given row in pixels.
     */ 
    getRowHeight: function(row) { return this.options.rowHeight; },
    /* Method: getRowCount
     * This function returns the number of rows of data in the model
     * as an integer value.
     */ 
    getRowCount: function() { return this.data.length },
    /* Method: getValueAt
     * This function returns an HTML string which is the text to place
     * in the cell at the given row and column.
     */ 
    getValueAt: function(row, col) { return (this.data && $chk(this.data[row])) ? this.data[row][col] : ''; },
    /* Method: setColumnWidth
     * This function is called with a column index and width in pixels
     * when a column is resized.  This function is only required if the grid
     * allows resizeable columns.
     */
    setColumnWidth: function() {},
    /* Method: isCellEditable
     * This function returns a boolean value to indicate if a given
     * cell is editable by the user.
     */ 
    isCellEditable: function() { return false },
    /* Method: setValueAt
     * This function is called with the row and column of a cell and a
     * new value for the cell.  It is mandatory to provide this function if any of
     * the cells in the model are editable.
     */ 
    setValueAt: function(row, col, value) {},
    /* Method: rowSelected
     * This function is called by the grid to indicate that the user
     * has selected a row by clicking on the row header.
     */ 
    rowSelected: function(grid, row) {
        if (this.selectedRow != null) {
            grid.selectRow(this.selectedRow, false);
        }
        this.selectedRow = row;
        grid.selectRow(row, true);
        this.fireEvent('select-row', row);
    },
    /* Method: columnSelected
     * This function is called by the grid to indicate that the user
     * has selected a column by clicking on the column header.
     */ 
    columnSelected: function(grid, col) {
        if (this.selectedCol != null) {
            grid.selectColumn(this.selectedCol, false);
        }
        this.selectedCol = col;
        grid.selectColumn(col, true);
        this.fireEvent('select-column', col);
    },
    /* Method: cellSelected
     * This function is called by the grid to indicate that the user
     * has selected a cell by clicking on the cell in the grid.
     */
    cellSelected: function(grid, row,col) { 
        grid.selectCell(row, col);
        this.fireEvent('select-cell', [row, col]);
    
    }
});
