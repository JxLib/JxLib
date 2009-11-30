// $Id$
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
Jx.Plugin.Grid.Sorter = new Class({

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
        this.bound.sort = this.sort.bind(this);
        this.bound.addHeaderClass = this.addHeaderClass.bind(this);
    },
    /**
     * APIMethod: attach
     * Sets up the plugin and attaches the plugin to the grid events it
     * will be monitoring
     */
    attach: function (grid) {
        if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
            return;
        }

        this.grid = grid;

        this.grid.addEvent('gridCellSelect', this.bound.sort);
        this.boundAddHeader = this.addHeaderClass.bind(this);
    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        if (this.grid) {
            this.grid.removeEvent('gridCellSelect', this.bound.sort);
        }
        this.grid = null;
    },
    /**
     * Method: sort
     * called when a grid header is clicked.
     *
     * Parameters:
     * cell - The cell clicked
     */
    sort : function (cell) {
        var data = cell.retrieve('jxCellData');
        if (data.colHeader) {
            var column = data.column;
            if (column.isSortable()) {
                if (column === this.current) {
                    //reverse sort order
                    this.direction = (this.direction === 'asc') ? 'desc' : 'asc';
                } else {
                    this.current = column;
                    this.direction = 'asc';
                    this.currentGridIndex = data.index - 1;
                }

                //The grid should be listening for the sortFinished event and will re-render the grid
                //we will listen for the grid's doneCreateGrid event to add the header
                this.grid.addEvent('doneCreateGrid', this.bound.addHeaderClass);
                //sort the store
                var strategy = this.grid.getModel().getStrategy('sort');
                strategy.sort(this.current.name, null, this.direction);
            }

        }
    },
    /**
     * Method: addHeaderClass
     * Event listener that adds the proper sorted column class to the
     * column we sorted by so that the sort arrow shows
     */
    addHeaderClass : function () {
        this.grid.removeEvent('doneCreateGrid', this.bound.addHeaderClass);

        //get header TD
        var th = this.grid.colTable.rows[0].cells[this.currentGridIndex];
        th.addClass('jxGridColumnSorted' + this.direction.capitalize());
    }
});
