// $Id: $
/**
 * Class: Jx.Plugin.Sorter
 * 
 * Extends: <Jx.Plugin>
 * 
 * Grid plugin to sort the grid by a single column.
 * 
 * Original selection code from Jx.Grid's original class
 * 
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Sorter = new Class({

    Extends : Jx.Plugin,

    options : {},
    /**
     * Property: current
     * refernce to the currently sorted column
     */
    current : null,
    /**
     * Property: direction
     * tell us what direction the sort is in (either 'asc' or 'desc')
     */
    direction : null,
    /**
     * Property: currentGridIndex
     * Holds the index of the column in the grid
     */
    currentGridIndex : null,
    /**
     * APIMethod: init
     * Sets up the plugin and attaches the plugin to the grid events it 
     * will be monitoring
     */
    init : function (grid) {
        if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
            return;
        }

        this.grid = grid;

        this.grid.addEvent('gridClick', this.sort.bind(this));
        this.boundAddHeader = this.addHeaderClass.bind(this);
    },
    /**
     * Method: sort
     * called when a grid header is clicked.
     * 
     * Parameters:
     * rc - an object holding the row and column indexes for the clicked header
     */
    sort : function (rc) {
        if ($defined(rc) && rc.column !== -1 && rc.row !== -1) {
            //check to find the header
            if (rc.row === 0) {
                if (this.grid.row.useHeaders()) {
                    rc.column--;
                }
                var column = this.grid.columns.getByGridIndex(rc.column);
                if (column.isSortable()) {
                    if (column === this.current) {
                        //reverse sort order
                        this.direction = (this.direction === 'asc') ? 'desc' : 'asc';
                    } else {
                        this.current = column;
                        this.direction = 'asc';
                        this.currentGridIndex = rc.column;
                    }
    
                    //The grid should be listening for the sortFinished event and will re-render the grid
                    //we will listen for the grid's doneCreateGrid event to add the header
                    this.grid.addEvent('doneCreateGrid', this.boundAddHeader);
                    //sort the store
                    var model = this.grid.getModel();
                    model.sort(this.current.name, null, this.direction);
                }
        
            }
        }
    },
    /**
     * Method: addHeaderClass
     * Event listener that adds the proper sorted column class to the
     * column we sorted by so that the sort arrow shows 
     */
    addHeaderClass : function () {
        this.grid.removeEvent('doneCreateGrid', this.boundAddHeader);
        
        //get header TD
        var th = this.grid.colTable.rows[0].cells[this.currentGridIndex];
        th.addClass('jxGridColumnSorted' + this.direction.capitalize());
    }
});
