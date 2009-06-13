/**
 * Class: Jx.Plugin.Selector
 * Grid plugin to select rows, columns, and/or cells.
 * 
 * Original selection code from Jx.Grid's original class
 * MIT style license
 */
Jx.Plugin.Selector = new Class({
    
    Extends: Jx.Plugin,
    
    options: {
        /* Option: cell
         * determines if cells are selectable
         */
        cell: false,
        
        /* Option: row
         * determines if rows are selectable
         */
        row: false,
        
        /* Option: column
         * determines if columns are selectable
         */
        column: false
    },
    
    /**
     * APIMethod: init
     * Sets up the plugin and attaches the plugin to the grid events it 
     * will be monitoring
     */
    init: function(grid){
        if (!$defined(grid) && !(grid instanceof Jx.Grid)){
            return;
        }
        
        this.grid = grid;
        
        this.grid.addEvent('gridClick',this.select.bind(this));
    },
    
    /**
     * Method: select
     * dispatches the grid click to the various selection methods
     */
    select: function(rc){
        if ($defined(rc) && rc.column != -1 && rc.row != -1) {
            var row = rc.row;
            if (this.grid.columns.useHeaders()){
                row--;
            }
            var column = rc.column;
            if (this.grid.row.useHeaders()){
                column--;
            }
            if (this.options.cell){
                this.selectCell(row,column);
            }
            if (this.options.row){
                this.selectRow(row);
            }
            if (this.options.column){
                this.selectColumn(column);
            }
        }
    },
    
    /** 
     * Method: selectCell
     * Select a cell and apply the jxGridCellSelected style to it.
     * This deselects a previously selected cell.
     *
     * If the model supports cell selection, it should implement
     * a cellSelected function to receive notification of the selection.
     *
     * Parameters:
     * row - {Integer} the row of the cell to select
     * col - {Integer} the column of the cell to select
     */
    selectCell: function(row, col) {
        var td = (row >=0 && col >=0 && row < this.grid.gridTableBody.rows.length && col < this.grid.gridTableBody.rows[row].cells.length) ? this.grid.gridTableBody.rows[row].cells[col] : null;
        if (!td) {
            return;
        }
         
        if (this.selectedCell) {
            this.selectedCell.removeClass('jxGridCellSelected');
        }
        this.selectedCell = td;
        this.selectedCell.addClass('jxGridCellSelected');
    },
    
    /** 
     * Method: selectRow
     * Select a row and apply the jxGridRowSelected style to it.
     *
     * Parameters:
     * row - {Integer} the row to select
     */
    selectRow: function(row) {
        var tr = (row >= 0 && row < this.grid.gridTableBody.rows.length) ? this.grid.gridTableBody.rows[row] : null;
        if (this.selectedRow != tr) {
            if (this.selectedRow) {
                this.selectedRow.removeClass('jxGridRowSelected');
            }
            this.selectedRow = tr;
            this.selectedRow.addClass('jxGridRowSelected');
            this.selectRowHeader(row);
        }
    },
    
    /** 
     * Method: selectRowHeader
     * Apply the jxGridRowHea}derSelected style to the row header cell of a
     * selected row.
     *
     * Parameters:
     * row - {Integer} the row header to select
     */
    selectRowHeader: function(row) {
        if (!this.grid.row.useHeaders()){
           return;
        }
        var cell = (row >= 0 && row < this.grid.rowTableHead.rows.length) ? this.grid.rowTableHead.rows[row].cells[0] : null;
        if (!cell) {
            return;
        }
        if (this.selectedRowHead != cell) {
            if (this.selectedRowHead){
                this.selectedRowHead.removeClass('jxGridRowHeaderSelected');
            }
            this.selectedRowHead = cell;
            cell.addClass('jxGridRowHeaderSelected');
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
    selectColumn: function(col, selected) {
        if (col >= 0 && col < this.grid.gridTable.rows[0].cells.length) {
            if (col != this.selectedCol){
                if ($defined(this.selectedCol)){
                    for (var i=0; i<this.grid.gridTable.rows.length; i++) {
                        this.grid.gridTable.rows[i].cells[this.selectedCol].removeClass('jxGridColumnSelected');
                    }  
                }
                this.selectedCol = col;
                for (var i=0; i<this.grid.gridTable.rows.length; i++) {
                    this.grid.gridTable.rows[i].cells[col].addClass('jxGridColumnSelected');
                }
                this.selectColumnHeader(col, selected);
            }
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
    selectColumnHeader: function(col) {
        if (this.grid.colTableBody.rows.length == 0 || !this.grid.row.useHeaders()) {
            return;
        }
        
        var cell = (col >= 0 && col < this.grid.colTableBody.rows[0].cells.length) ? this.grid.colTableBody.rows[0].cells[col] : null;
        if (cell == null) { 
            return; 
        }
        
        if (this.selectedColHead != cell) {
            if (this.selectedColHead){
                this.selectedColHead.removeClass('jxGridColumnHeaderSelected');
            }
            this.selectedColHead = cell;
            cell.addClass('jxGridColumnHeaderSelected');
        } 
    }
});