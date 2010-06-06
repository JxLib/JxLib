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

	Family: 'Jx.Plugin.Grid.Selector',
    Extends : Jx.Plugin,
    
    Binds: ['select','checkSelection','checkAll','afterGridRender'],

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
    selected: null,
    
    /**
     * APIMethod: init
     * construct a new instance of the plugin.  The plugin must be attached
     * to a Jx.Grid instance to be useful though.
     */
    init: function() {
        this.parent();
        this.selected = $H({
            columns: [],
            rows: [],
            rowHeads: [],
            columnHeads: []
        });
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
        	
        	var template = '<span class="jxGridCellContent">';
        	
        	if (this.options.multiple) {
        		template += '<span class="jxInputContainer jxInputContainerCheck"><input class="jxInputCheck" type="checkbox" name="checkAll" id="checkAll"/></span>';
        	} else {
        		template += '</span>';
        	}
        	
        	template += "</span>";
        	
        	this.checkColumn = new Jx.Column({
        		template: template,
        		renderMode: 'fit',
        		renderer: new Jx.Grid.Renderer.Checkbox({
        		//	onChange: this.checkSelection
        		}),
        		name: 'selection'
        	}, this.grid);
        	this.grid.columns.columns.reverse();
        	this.grid.columns.columns.push(this.checkColumn);
        	this.grid.columns.columns.reverse();
        	
        	if (this.options.checkAsHeader) {
        		this.oldHeaderColumn = this.grid.row.options.headerColumn;
        		this.grid.row.options.headerColumn = 'selection';
        		
        		if (this.options.multiple) {
                    this.grid.addEvent('doneCreateGrid', this.afterGridRender);
        		}
        	}
            //attach event to header
            if (this.options.multiple) {
                var ch = document.id(this.checkColumn).getElement('input');
                ch.addEvents({
                    'change': this.checkAll
                });
            }

        }
    },

    afterGridRender: function () {
        if (this.options.checkAsHeader) {
            var chkCol = document.id(this.checkColumn).clone();
            chkCol.getElement('input').addEvent('change',this.checkAll);
            this.grid.rowColObj.adopt(chkCol);
            //document.id(this.checkColumn).inject(this.grid.rowColObj);
        }
        this.grid.removeEvent('doneCreateGrid',this.afterGridRender);
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

        // console.log('select method');
        var data = cell.retrieve('jxCellData');
        // console.log(data);

        if (this.options.row && $defined(data.row)) {
            this.selectRow(data.row);
        }

        if (this.options.column && $defined(data.index)) {
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
        tr = document.id(tr);
        
        var rows = this.selected.get('rows');
	    if (tr.hasClass('jxGridRowSelected')) {
	        tr.removeClass('jxGridRowSelected');
	        this.setCheckField(row, false);

            if (this.options.multiple && this.options.useCheckColumn) {
                if (this.options.checkAsHeader) {
                    document.id(this.grid.rowColObj).getElement('input').removeProperty('checked');
                } else {
                    document.id(this.checkColumn).getElement('input').removeProperty('checked');
                }
            }

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
    			check = document.id(this.grid.rowTableHead.rows[row].cells[0]).getFirst().getFirst();
    		} else {
    			var col = this.grid.columns.getIndexFromGrid(this.checkColumn.name);
    			check = document.id(this.grid.gridTableBody.rows[row].cells[col]).getFirst().getFirst();
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
        cell = document.id(cell);
        var cells = this.selected.get('rowHeads');
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

        cell = document.id(cell);
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
    	var data = document.id(field).getParent().retrieve('jxCellData');
    	this.selectRow(data.row);
    },
    /**
     * Method: checkAll
     * Checks all checkboxes in the column the selector inserted.
     */
    checkAll: function () {
        var col;
        var rows;
        var checked;

        checked = this.options.checkAsHeader ? this.grid.rowColObj.getElement('input').get('checked') :
                this.checkColumn.domObj.getElement('input').get('checked');

        if (this.options.checkAsHeader) {
            col = 0;
            rows = this.grid.rowTableHead.rows;
        } else {
            col = this.grid.columns.getIndexFromGrid(this.checkColumn.name);
            rows = this.grid.gridTableBody.rows;
        }

        $A(rows).each(function(row, idx) {
            var check = row.cells[col].getElement('input');
            if ($defined(check)) {
                var rowChecked = check.get('checked');
                if (rowChecked !== checked) {
                    this.selectRow(idx);
                }
            }
        }, this);
    }
});
