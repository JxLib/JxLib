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

	Family: 'Jx.Plugin.Grid.Selector',
    Extends : Jx.Plugin,
    
    Binds: ['select','checkSelection','checkAll'],

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
        checkAsHeader: false
    },
    /**
     * Property: selected
     * Holds arrays of selected rows and/or columns and their headers
     */
    selected: $H({
    	columns: [],
    	rows: [],
    	rowHeads: [],
    	columnHeads: []
    }),
    
    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function() {
        this.parent();
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
        this.grid.addEvent('gridCellSelect', this.select);
        if (this.options.cell) {
            this.oldSelectionClass = this.grid.selection.options.selectedClass;
            this.grid.selection.options.selectClass = "jxGridCellSelected";
            if (this.options.multiple) {
            	this.grid.selection.options.selectMode = 'multiple';
            }
        }
        
        //setup check column if needed
        if (this.options.useCheckColumn) {
        	this.checkColumn = new Jx.Column({
        		template: '<span class="jxGridCellContent jxInputContainer jxInputContainerCheck"><input class="jxInputCheck" type="checkbox" name="checkAll" id="checkAll"/></span>',
        		renderMode: 'fit',
        		renderer: new Jx.Grid.Renderer.Checkbox({
        			onChange: this.checkSelection
        		}),
        		name: 'selection'
        	}, this.grid);
        	this.grid.columns.columns.reverse();
        	this.grid.columns.columns.push(this.checkColumn);
        	this.grid.columns.columns.reverse();
        	
        	if (this.options.checkAsHeader) {
        		this.oldHeaderColumn = this.grid.row.options.headerColumn;
        		this.grid.row.options.headerColumn = 'selection';
        	} else {
        		//attach event to header
        		$(this.checkColumn).getFirst().addEvents({
        			'change': this.checkAll
        		});
        	}
        }
    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        if (this.grid) {
            this.grid.removeEvent('gridCellSelect', this.select);
            if (this.options.cell) {
                this.grid.selection.options.selectedClass = this.oldSelectionClass;
            }
        }
        if (this.options.useCheckColumn) {
        	var col = this.grid.columns.getByName('selection');
        	this.grid.columns.columns.erase(col);
        	if (this.options.checkAsHeader) {
        		this.grid.row.options.headerColumn = this.oldHeaderColumn;
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
        	
        	this.selected.get('rows').each(function(row){
        		row.removeClass('jxGridRowSelected');
        	},this);
        	this.selected.set('rows',[]);
        	
        	this.selected.get('rowHeads').each(function(rowHead){
        		rowHead.removeClass('jxGridRowHeaderSelected');
        	},this);
        	this.selected.set('rowHeads',[]);
        	
        } else {
            this.selected.get('columns').each(function(column){
                for (var i = 0; i < this.grid.gridTable.rows.length; i++) {
                    this.grid.gridTable.rows[i].cells[column].removeClass('jxGridColumnSelected');
                }
            },this);
            this.selected.set('columns',[]);
            
            this.selected.get('columnHeads').each(function(rowHead){
        		rowHead.removeClass('jxGridColumnHeaderSelected');
        	},this);
        	this.selected.set('columnHeads',[]);
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
            if (this.grid.row.useHeaders()) {
                this.selectColumn(data.index - 1);
            } else {
                this.selectColumn(data.index);
            }
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
        tr = $(tr);
        
        var rows = this.selected.get('rows');
	    if (tr.hasClass('jxGridRowSelected')) {
	        tr.removeClass('jxGridRowSelected');
	        this.setCheckField(row, false);
	        //search array and remove this item
	        rows.erase(tr);
	    } else {
	        rows.push(tr);
	        tr.addClass('jxGridRowSelected');
	        this.setCheckField(row, true);
	    }
	        
	    if (!this.options.multiple) {
	    	rows.each(function(row){
	    		if (row !== tr) {
	    			row.removeClass('jxGridRowSelected');
	    			this.setCheckField(row.retrieve('jxRowData').row,false);
	    			rows.erase(row);
	    		}
	    	},this);
        }
        	
	    this.selectRowHeader(row);

    },
    
    setCheckField: function (row, checked) {
    	if (this.options.useCheckColumn) {
    		var check;
    		if (this.options.checkAsHeader) {
    			check = $(this.grid.rowTableHead.rows[row].cells[0]).getFirst().getFirst();
    		} else {
    			var col = this.grid.columns.getIndexFromGrid(this.checkColumn.name);
    			check = $(this.grid.gridTableBody.rows[row].cells[col]).getFirst().getFirst();
    		}
        	check.retrieve('field').setValue(checked);
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
        var cell = (row >= 0 && row < this.grid.rowTableHead.rows.length) ? 
        		this.grid.rowTableHead.rows[row].cells[0] : null;

        if (!cell) {
            return;
        }
        cell = $(cell);
        var cells = this.selected.get('rowHeads');
        if (cells.contains(cell)) {
            cell.removeClass('jxGridRowHeaderSelected');
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
        if (col >= 0 && col < this.grid.gridTable.rows[0].cells.length) {
        	var cols = this.selected.get('columns');
        	
        	var m = '';
            if (cols.contains(col)) {
            	//deselect
            	m = 'removeClass';
            	cols.erase(col);
            } else {
            	//select
            	m = 'addClass';
            	cols.push(col);
            }
            for (var i = 0; i < this.grid.gridTable.rows.length; i++) {
                this.grid.gridTable.rows[i].cells[col][m]('jxGridColumnSelected');
            }
            
            if (!this.options.multiple) {
            	cols.each(function(c){
            		if (c !== col) {
            			for (var i = 0; i < this.grid.gridTable.rows.length; i++) {
                            this.grid.gridTable.rows[i].cells[c].removeClass('jxGridColumnSelected');
                        }
            			cols.erase(c);
            		}
            	},this);
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


        var cell = (col >= 0 && col < this.grid.colTableBody.rows[0].cells.length) ? 
        		this.grid.colTableBody.rows[0].cells[col] : null;
        		
        if (cell === null) {
            return;
        }

        cell = $(cell);
        cells = this.selected.get('columnHeads');
        
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
        	},this);
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
     */
    checkSelection: function (column, field) {
    	var data = $(field).getParent().retrieve('jxCellData');
    	this.selectRow(data.row);
    },
    /**
     * Method: checkAll
     * Checks all checkboxes in the column the selector inserted.
     */
    checkAll: function () {
    	var check;
    	var col;
    	var rows;
    	
    	var checked = this.checkColumn.domObj.getFirst().get('checked');
    	//checked = (checked === 'on')? true : false;
    	
		if (this.options.checkAsHeader) {
			col = 0;
			rows = this.grid.rowTableHead.rows;
		} else {
			var col = this.grid.columns.getIndexFromGrid(this.checkColumn.name);
			rows = this.grid.gridTableBody.rows;
		}
		
		$A(rows).each(function(row){
			check = row.cells[col].getFirst().getFirst();
			check.retrieve('field').setValue(checked);
		},this);
    }
});
