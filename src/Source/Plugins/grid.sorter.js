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
  Extends: Jx.Plugin,
  Family: 'Jx.Plugin.Grid.Sorter',
  name: 'Sorter',

  Binds: ['sort', 'modifyHeaders'],

  /**
   * Property: current
   * refernce to the currently sorted column
   */
  current: null,

  /**
   * Property: direction
   * tell us what direction the sort is in (either 'asc' or 'desc')
   */
  direction: null,

  options: {
    sortableClass: 'jxColSortable',
    ascendingClass: 'jxGridColumnSortedAsc',
    descendingClass: 'jxGridColumnSortedDesc'
  },

  /**
   * APIMethod: attach
   * Sets up the plugin and attaches the plugin to the grid events it
   * will be monitoring
   */
  attach: function(grid) {
    if (grid === undefined || grid === null || !(grid instanceof Jx.Grid)) {
        return;
    }
    this.parent(grid);

    this.grid = grid;

    // this.grid.wantEvent('gridColumnClick');
    this.grid.addEvent('gridColumnClick', this.sort);
    this.grid.addEvent('doneCreateGrid', this.modifyHeaders);
  },

  /**
   * APIMethod: detach
   */
  detach: function() {
    if (this.grid) {
        this.grid.removeEvent('gridColumnClick', this.sort);
    }
    this.grid = null;
  },

  /**
   * Method: modifyHeaders
   */
  modifyHeaders: function() {
    var grid = this.grid,
        columnTable = grid.colObj,
        store = grid.store,
        c = this.options.sortableClass;
    if (grid.columns.useHeaders()) {
      grid.columns.columns.each(function(col, index) {
        if (!col.isHidden() && col.isSortable()) {
          var th = columnTable.getElement('.jxGridCol'+index);
          th.addClass(c);
        }
      });
    }
  },

  /**
   * Method: sort
   * called when a grid header is clicked.
   *
   * Parameters:
   * cell - The cell clicked
   */
  sort: function(el) {
    var current = this.current,
        grid = this.grid,
        gridTableBody = grid.gridTableBody,
        gridParent = gridTableBody.getParent(),
        rowTableBody = grid.rowTableBody,
        rowParent = rowTableBody.getParent(),
        useHeaders = grid.row.useHeaders(),
        store = grid.store,
        sorter = store.getStrategy('sort'),
        data = el.retrieve('jxCellData'),
        dir = 'asc',
        opt = this.options;
    
    if (data.column !== undefined && data.column !== null && data.column.isSortable()){
      if (el.hasClass(opt.ascendingClass)) {
        el.removeClass(opt.ascendingClass).addClass(opt.descendingClass);
        dir = 'desc';
      } else if (el.hasClass(opt.descendingClass)) {
        el.removeClass(opt.descendingClass).addClass(opt.ascendingClass);
      } else {
        el.addClass(opt.ascendingClass);
      }
      if (current && el != current) {
        current.removeClass(opt.ascendingClass).removeClass(opt.descendingClass);
      }
      this.current = el;
      
      this.grid.fireEvent('gridSortStarting');
      
      if (data.column.options.sort !== undefined && data.column.options.sort !== null && Jx.type(data.column.options.sort) == 'function') {
        data.column.options.sort(dir);
      } else {
        if (sorter) {
          gridTableBody.dispose();
          if (useHeaders) {
            rowTableBody.dispose();
          }
          store.each(function(record, index) {
            record.dom = {
              cell: gridTableBody.childNodes[index],
              row: useHeaders ? rowTableBody.childNodes[index] : null
            };
          });
    
          sorter.sort(data.column.name, null, dir);
    
          store.each(function(record, index) {
            record.dom.cell.inject(gridTableBody);
            if (useHeaders) {
              record.dom.row.inject(rowTableBody);
            }
          });
    
          if (gridParent) {
            gridParent.adopt(gridTableBody);
          }
          if (useHeaders && rowParent) {
            rowParent.adopt(rowTableBody);
          }
        }
      }
      this.grid.fireEvent('gridSortFinished');
    }
  }
});