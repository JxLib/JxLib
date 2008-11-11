/*
 * Jx.Grid Model Interface:
 *
 * addGridListener(l) - mandatory
 * mandatory.  This function accepts one argument, l, which is the listener
 * to add.  The model can then call the gridChanged() method on the grid
 * listener object when something in the model changes.
 * 
 * removeGridListener(l) - mandatory
 * mandatory.  This function accepts one argument, l, which is the listener
 * to remove.  The listener should have been previously added using
 * addGridListener.
 * 
 * getColumnCount() - mandatory
 * mandatory.  This function returns the number of columns of data in the 
 * model as an integer value.
 * 
 * getColumnHeaderHTML(column) - mandatory
 * mandatory. This function returns an HTML string to be placed in the
 * column header for the given column index.
 * 
 * getColumnHeaderHeight() - mandatory
 * mandatory.  This function returns an integer which is the height of the
 * column header row in pixels.
 * 
 * getColumnWidth(column) - mandatory
 * mandatory.  This function returns an integer which is the width of the
 * given column in pixels.
 * 
 * getRowHeaderHTML(row) - mandatory
 * mandatory.  This function returns an HTML string to be placed in the row
 * header for the given row index
 * 
 * getRowHeaderWidth() - mandatory
 * mandatory.  This function returns an integer which is the width of the row
 * header column in pixels.
 * 
 * getRowHeight(row) - mandatory
 * mandatory.  This function returns an integer which is the height of the
 * given row in pixels.
 * 
 * getRowCount() - mandatory
 * mandatory.  This function returns the number of rows of data in the model
 * as an integer value.
 * 
 * getValueAt(row, column) - mandatory
 * mandatory.  This function returns an HTML string which is the text to place
 * in the cell at the given row and column.
 * 
 * isCellEditable(row, column) - mandatory
 * mandatory.  This function returns a boolean value to indicate if a given
 * cell is editable by the user.
 *
 * *Optional Functions*
 *  
 * setColumnWidth(column, width) - optional
 * optional.  This function is called with a column index and width in pixels
 * when a column is resized.  This function is only required if the grid
 * allows resizeable columns.
 * 
 * setValueAt(row, column, value) - optional
 * optional.  This function is called with the row and column of a cell and a
 * new value for the cell.  It is mandatory to provide this function if any of
 * the cells in the model are editable.
 * 
 * rowSelected(row) - optional
 * optional.  This function is called by the grid to indicate that the user
 * has selected a row by clicking on the row header.
 * 
 * columnSelected(column) - optional
 * optional.  This function is called by the grid to indicate that the user
 * has selected a column by clicking on the column header.
 * 
 * cellSelected(row, column) - optional
 * optional.  This function is called by the grid to indicate that the user
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
        grid.selectCol(col, true);
        this.fireEvent('select-column', col);
    },
    cellSelected: function(grid, row,col) { 
        grid.selectCell(row, col);
        this.fireEvent('select-cell', [row, col]);
    
    }
});
