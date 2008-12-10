/**
 * Class: Jx.Grid.Model
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
/** 
 * Method: getColumnCount
 * This function returns the number of columns of data in the 
 * model as an integer value.
 * 
 * Method: getColumnHeaderHTML
 * This function returns an HTML string to be placed in the
 * column header for the given column index.
 * 
 * Method: getColumnHeaderHeight
 * This function returns an integer which is the height of the
 * column header row in pixels.
 * 
 * Method: getColumnWidth
 * This function returns an integer which is the width of the
 * given column in pixels.
 * 
 * Method: getRowHeaderHTML
 * This function returns an HTML string to be placed in the row
 * header for the given row index
 * 
 * Method: getRowHeaderWidth
 * This function returns an integer which is the width of the row
 * header column in pixels.
 * 
 * Method: getRowHeight
 * This function returns an integer which is the height of the
 * given row in pixels.
 * 
 * Method: getRowCount
 * This function returns the number of rows of data in the model
 * as an integer value.
 * 
 * Method: getValueAt
 * This function returns an HTML string which is the text to place
 * in the cell at the given row and column.
 * 
 * Method: isCellEditable
 * This function returns a boolean value to indicate if a given
 * cell is editable by the user.
 *
 * Method: setColumnWidth
 * This function is called with a column index and width in pixels
 * when a column is resized.  This function is only required if the grid
 * allows resizeable columns.
 * 
 * Method: setValueAt
 * This function is called with the row and column of a cell and a
 * new value for the cell.  It is mandatory to provide this function if any of
 * the cells in the model are editable.
 * 
 * Method: rowSelected
 * This function is called by the grid to indicate that the user
 * has selected a row by clicking on the row header.
 * 
 * Method: columnSelected
 * This function is called by the grid to indicate that the user
 * has selected a column by clicking on the column header.
 * 
 * Method: cellSelected
 * This function is called by the grid to indicate that the user
 * has selected a cell by clicking on the cell in the grid.
 */
Jx.Grid.Model = new Class({
    Implements: [Events, Options],
    options: {
        colHeaderHeight: 28,
        rowHeaderWidth: 28,
        colWidth: 50,
        rowHeight: 20,
        rowHeaders: null,
        columnHeaders: null
    },
    data: null,
    initialize: function(data, options) {
        this.data = data || [];
        this.setOptions(options);
    },
    getColumnCount: function() { return (this.data && this.data[0]) ? this.data[0].length : 0; },
    getColumnHeaderHTML: function(col) { 
        return this.options.columnHeaders?this.options.columnHeaders[col]:col+1;
     },
    getColumnHeaderHeight: function() { return this.options.colHeaderHeight; },
    getColumnWidth: function(col) { return this.options.colWidth; },
    getRowHeaderHTML: function(row) { 
        return this.options.rowHeaders?this.options.rowHeaders[row]:row+1; 
    },
    getRowHeaderWidth: function() { return this.options.rowHeaderWidth; },
    getRowHeight: function(row) { return this.options.rowHeight; },
    getRowCount: function() { return this.data.length },
    getValueAt: function(row, col) { return (this.data && $chk(this.data[row])) ? this.data[row][col] : ''; },
    isCellEditable: function() { return false },
    setValueAt: function(row, col, value) {},
    rowSelected: function(grid, row) {
        if (this.selectedRow != null) {
            grid.selectRow(this.selectedRow, false);
        }
        this.selectedRow = row;
        grid.selectRow(row, true);
        this.fireEvent('select-row', row);
    },
    columnSelected: function(grid, col) {
        if (this.selectedCol != null) {
            grid.selectColumn(this.selectedCol, false);
        }
        this.selectedCol = col;
        grid.selectColumn(col, true);
        this.fireEvent('select-column', col);
    },
    cellSelected: function(grid, row,col) { 
        grid.selectCell(row, col);
        this.fireEvent('select-cell', [row, col]);
    
    }
});
