Jx.Grid.Model = new Class({
    Implements: [Events, Options],
    options: {
        colHeaderHeight: 28,
        rowHeaderWidth: 28,
        colWidth: 50,
        rowHeight: 20
    },
    data: null,
    initialize: function(data, options) {
        this.data = data || [];
        this.setOptions(options);
    },
    getColumnCount: function() { return (this.data && this.data[0]) ? this.data[0].length : 0; },
    getColumnHeaderHTML: function(col) { return col; },
    getColumnHeaderHeight: function() { return this.options.colHeaderHeight; },
    getColumnWidth: function(col) { return this.options.colWidth; },
    getRowHeaderHTML: function(row) { return row; },
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
