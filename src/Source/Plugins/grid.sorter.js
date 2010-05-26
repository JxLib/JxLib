/*
---

name: Jx.Plugin.Grid.Sorter

description: Enables column sorting in grids

license: MIT-style license.

requires:
 - Jx.Plugin.Grid

provides: [Jx.Plugin.Grid.Sorter]

images:
 - emblems.png
...
 */
// $Id$
/**
 * Class: Jx.Plugin.Grid.Sorter
 *
 * Extends: <Jx.Plugin>
 *
 * Grid plugin to sort the grid by a single column.
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.Grid.Sorter = new Class({

    Family: 'Jx.Plugin.Grid.Sorter',
    Extends : Jx.Plugin,
    Binds: ['sort', 'addHeaderClass'],

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
     * APIMethod: attach
     * Sets up the plugin and attaches the plugin to the grid events it
     * will be monitoring
     */
    attach: function (grid) {
        if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
            return;
        }

        this.grid = grid;

        this.grid.addEvent('gridCellSelect', this.sort);
    },
    /**
     * APIMethod: detach
     */
    detach: function() {
        if (this.grid) {
            this.grid.removeEvent('gridCellSelect', this.sort);
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

                // The grid should be listening for the sortFinished event and
                // will re-render the grid we will listen for the grid's
                // doneCreateGrid event to add the header
                this.grid.addEvent('doneCreateGrid', this.addHeaderClass);
                //sort the store
                var strategy = this.grid.getModel().getStrategy('sort');
                if (strategy) {
                  strategy.sort(this.current.name, null, this.direction);
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
        this.grid.removeEvent('doneCreateGrid', this.addHeaderClass);

        //get header TD
        var th = this.grid.colTable.rows[0].cells[this.currentGridIndex];
        th.addClass('jxGridColumnSorted' + this.direction.capitalize());
    }
});
