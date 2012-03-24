/*
---

name: Jx.Grid

description: A tabular control that has fixed scrolling headers on the rows and columns like a spreadsheet.

license: MIT-style license.

requires:
 - Jx.Widget
 - Jx.Styles
 - Jx.Layout
 - Jx.Plugin.Grid
 - Jx.Store
 - Jx.List

provides: [Jx.Grid]

css:
 - grid

images:
 - table_col.png
 - table_row.png

...
 */
// $Id$
/**
 * Class: Jx.Grid
 *
 * Extends: <Jx.Widget>
 *
 * A tabular control that has fixed, optional, scrolling headers on the rows
 * and columns like a spreadsheet.
 *
 * Jx.Grid is a tabular control with convenient controls for resizing columns,
 * sorting, and inline editing.  It is created inside another element,
 * typically a div.  If the div is resizable (for instance it fills the page
 * or there is a user control allowing it to be resized), you must call the
 * resize() method of the grid to let it know that its container has been
 * resized.
 *
 * When creating a new Jx.Grid, you can specify a number of options for the
 * grid that control its appearance and functionality. You can also specify
 * plugins to load for additional functionality. Currently Jx provides the
 * following plugins
 *
 * Prelighter - prelights rows, columns, and cells
 * Selector - selects rows, columns, and cells
 * Sorter - sorts rows by specific column
 * Editor - allows editing of cells if the column permits editing
 *
 * Jx.Grid renders data that comes from an external source.  This external
 * source, called the store, must be a Jx.Store or extended from it.
 *
 * Events:
 * gridCellEnter(cell, list) - called when the mouse enters a cell
 * gridCellLeave(cell, list) - called when the mouse leaves a cell
 * gridCellClick(cell) - called when a cell is clicked
 * gridRowEnter(cell, list) - called when the mouse enters a row header
 * gridRowLeave(cell, list) - called when the mouse leaves a row header
 * gridRowClick(cell) - called when a row header is clicked
 * gridColumnEnter(cell, list) - called when the mouse enters a column header
 * gridColumnLeave(cell, list) - called when the mouse leaves a column header
 * gridColumnClick(cell) - called when a column header is clicked
 * gridMouseLeave() - called when the mouse leaves the grid at any point.
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 * This version Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
define("jx/grid", ['../base','./widget','./store','./layout','./list',
                   './grid/rowmodel','./grid/columnmodel','./grid/renderer/text',
                   './grid/column','require'],
       function(base, Widget, Store, Layout, List, RowModel, ColumnModel, TextRenderer, Column, require){
    
    var grid = new Class({
        
        Extends: Widget,
        Family : 'Jx.Grid',
        Binds: ['storeLoaded', 'clickColumnHeader', 'moveColumnHeader', 'clickRowHeader', 'moveRowHeader', 'clickCell', 'dblclickCell', 'moveCell', 'leaveGrid', 'resize', 'drawStore', 'scroll', 'addRow', 'removeRow', 'removeRows', 'updateRow', 'storeChangesCompleted'],
      
        /**
         * Property: pluginNamespace
         * the required variable for plugins
         */
        pluginNamespace: 'Grid',
        
        options: {
            /**
             * Option: parent
             * the HTML element to create the grid inside. The grid will resize
             * to fill the domObj.
             */
            parent: null,
          
            template: "<div class='jxWidget'><div class='jxGridContainer jxGridRowCol'></div><div class='jxGridContainer jxGridColumnsContainer'><table class='jxGridTable jxGridHeader jxGridColumns'><thead class='jxGridColumnHead'></thead></table></div><div class='jxGridContainer jxGridHeader jxGridRowContainer'><table class='jxGridTable jxGridRows'><thead class='jxGridRowBody'></thead></table></div><div class='jxGridContainer jxGridContentContainer'><table class='jxGridTable jxGridContent'><tbody class='jxGridTableBody'></tbody></table></div></div>",
          
            /**
             * Options: columnModel
             * an object consisting of a columns array that defines the individuals
             * columns as well as containing any options for Jx.Grid.ColumnModel or
             * a Jx.Grid.ColumnModel object itself.
             */
            columnModel: null,
          
            /**
             * Option: row
             * Either a Jx.Grid.RowModel object or a json object defining options for
             * the class
             */
            rowModel : null,
      
            /**
             * Option: store
             * An instance of Jx.Store
             */
            store: null
        },
         
        classes: {
            domObj: 'jxWidget',
            columnContainer: 'jxGridColumnsContainer',
            colObj: 'jxGridColumns',
            colTableBody: 'jxGridColumnHead',
            rowContainer: 'jxGridRowContainer',
            rowObj: 'jxGridRows',
            rowColContainer: 'jxGridRowCol',
            rowTableBody: 'jxGridRowBody',
            contentContainer: 'jxGridContentContainer',
            gridObj: 'jxGridContent',
            gridTableBody: 'jxGridTableBody'
        },
        
        /**
         * Property: columns
         * holds a reference to the columns object
         */
        columnModel: null,
        
        /**
         * Property: row
         * Holds a reference to the row object
         */
        rowModel: null,
        
        parameters: ['options'],
        
        /**
         * Property: store
         * holds a reference to the <Jx.Store> that is the store for this
         * grid
         */
        store: null,
        
        /**
         * Property: styleSheet
         * the name of the dynamic style sheet to use for manipulating styles
         */
        styleSheet: 'JxGridStyles',
        
        /**
         * Property: hooks
         * an Object of event names for tracking which events have actually been attached
         * to the grid.
         */
        hooks: null,
        
        /**
         * Property: uniqueId
         * an auto-generated id that is assigned as a class name to the grid's
         * container for scoping generated CSS rules to just this grid
         */
        uniqueId: null,
        
        /**
         * Constructor: Jx.Grid
         */
        init: function() {
            //in Global mode, anything under the .Grid namespace isn't loaded yet...
            //get it all now
            if (base.global &&  RowModel === undefined) {
                RowModel = require('jx/grid/rowmodel');
            }
            if (base.global &&  ColumnModel === undefined) {
                ColumnModel = require('jx/grid/columnmodel');
            }
            if (base.global &&  TextRenderer === undefined) {
                TextRenderer = require('jx/grid/renderer/text');
            }
            if (base.global &&  Column === undefined) {
                Column = require('jx/grid/column');
            }
            
            this.uniqueId = this.generateId('jxGrid_');
            this.store = this.options.store;
            var options = this.options,
                opts;
      
            if (options.rowModel !== undefined && options.rowModel !== null) {
                if (instanceOf(options.rowModel, RowModel)) {
                    this.rowModel = options.rowModel;
                    this.rowModel.grid = this;
                } else if (typeOf(options.rowModel) == 'object') {
                    this.rowModel = new RowModel(Object.append({grid: this}, options.rowModel));
                }
            } else {
                this.rowModel = new RowModel({grid: this});
            }
      
            if (options.columnModel !== undefined && options.columnModel !== undefined) {
                if (instanceOf(options.columnModel, ColumnModel)) {
                    this.columnModel = options.columnModel;
                    this.columnModel.grid = this;
                } else if (typeOf(options.columnModel) === 'object') {
                    this.columnModel = new ColumnModel(Object.append({grid:this}, options.columnModel));
                }
            } else {
                this.columnModel = new ColumnModel({grid: this});
            }
          
            this.hooks = {
                'gridScroll': false,
                'gridColumnEnter': false,
                'gridColumnLeave': false,
                'gridColumnClick': false,
                'gridRowEnter': false,
                'gridRowLeave': false,
                'gridRowClick': false,
                'gridCellClick': false,
                'gridCellDblClick': false,
                'gridCellEnter': false,
                'gridCellLeave': false,
                'gridMouseLeave': false
            };
          
            this.storeEvents = {
                'storeDataLoaded': this.storeLoaded,
                // 'storeSortFinished': this.drawStore,
                'storeRecordAdded': this.addRow,
                'storeColumnChanged': this.updateRow,
                'storeRecordRemoved': this.removeRow,
                'storeMultipleRecordsRemoved': this.removeRows,
                'storeChangesCompleted': this.storeChangesCompleted
            };
          
            this.parent();
        },
        
        wantEvent: function(eventName) {
            var hook = this.hooks[eventName];
            if (hook === false) {
                switch(eventName) {
                case 'gridColumnEnter':
                case 'gridColumnLeave':
                    this.colObj.addEvent('mousemove', this.moveColumnHeader);
                    this.hooks = Object.merge(this.hooks,{
                        'gridColumnEnter': true,
                        'gridColumnLeave': true
                    });
                    break;
                case 'gridColumnClick':
                    this.colObj.addEvent('click', this.clickColumnHeader);
                    this.hooks.gridColumnClick = true;
                    break;
                case 'gridRowEnter':
                case 'gridRowLeave':
                    this.rowObj.addEvent('mousemove', this.moveRowHeader);
                    this.hooks = Object.merge(this.hooks,{
                        'gridRowEnter': true,
                        'gridRowLeave': true
                    });
                    break;
                case 'gridRowClick':
                    this.rowObj.addEvent('click', this.clickRowHeader);
                    this.hooks.gridRowClick = true;
                    break;
                case 'gridCellEnter':
                case 'gridCellLeave':
                    this.gridObj.addEvent('mousemove', this.moveCell);
                    this.hooks = Object.merge(this.hooks, {
                        'gridCellEnter': true,
                        'gridCellLeave': true
                    });
                    break;
                case 'gridCellClick':
                    this.gridObj.addEvent('click', this.clickCell);
                    this.hooks.gridCellClick = true;
                    break;
                case 'gridCellDblClick':
                    this.gridObj.addEvent('dblclick', this.dblclickCell);
                    this.hooks.gridCellDblClick = true;
                    break;
                case 'gridMouseLeave':
                    this.rowObj.addEvent('mouseleave', this.leaveGrid);
                    this.colObj.addEvent('mouseleave', this.leaveGrid);
                    this.gridObj.addEvent('mouseleave', this.leaveGrid);
                    this.hooks.gridMouseLeave = true;
                    break;
                case 'gridScroll':
                    this.contentContainer.addEvent('scroll', this.scroll);
                    break;
                default:
                    break;
                }
            }
        },
        
        /**
         * Method: scroll
         * handle the grid scrolling by updating the position of the headers
         */
        scroll : function () {
            this.columnContainer.scrollLeft = this.contentContainer.scrollLeft;
            this.rowContainer.scrollTop = this.contentContainer.scrollTop;
        },
        
        /**
         * APIMethod: render
         * Create the grid for the current model
         */
        render: function() {
            if (this.domObj) {
                this.redraw();
                return;
            }
            this.parent();
            var store = this.store;
          
            this.domObj.addClass(this.uniqueId);
            new Layout(this.domObj, {
                onSizeChange: this.resize
            });
          
            if (instanceOf(store, Store)) {
                store.addEvents(this.storeEvents);
                if (store.loaded) {
                    this.storeLoaded(store);
                }
            }
            if (!this.columnModel.useHeaders()) {
                this.columnContainer.dispose();
            } else {
                this.wantEvent('gridScroll');
            }
          
            if (!this.rowModel.useHeaders()) {
                this.rowContainer.dispose();
            } else {
                this.wantEvent('gridScroll');
            }
      
            this.contentContainer.setStyle('overflow', 'auto');
          
            // todo: very hacky!  can plugins 'wantEvent' between init and render?
            //YES! made a change to the order of things so we can call wantEvent from
            //the plugin's attach method. Woo!!
            /*
            Object.each(this.hooks, function(value, key) {
                if (value) {
                    this.hooks[key] = false;
                    this.wantEvent(key);
                }
            }, this);
            */
          
            if (this.options.parent !== undefined &&
                this.options.parent !== null &&
                typeOf(this.options.parent) != 'function') {
                this.resize();
            }
        },
        
        /**
         * APIMethod: resize
         * resize the grid to fit inside its container.  This involves knowing
         * something about the model it is displaying (the height of the column
         * header and the width of the row header) so nothing happens if no model is
         * set
         */
        resize: function() {
            var p = this.domObj.getParent(),
                parentSize = p.getSize(),
                colHeaderHeight = 0,
                rowHeaderWidth = 0;
          
            if (this.columnModel.useHeaders()) {
                colHeaderHeight = this.columnModel.getHeaderHeight();
            }
          
            if (this.rowModel.useHeaders()) {
                rowHeaderWidth = this.rowModel.getRowHeaderWidth();
            }
          
            this.rowColContainer.setBorderBoxSize({
                width : rowHeaderWidth,
                height : colHeaderHeight
            });
          
            this.columnContainer.setStyles({
                top: 0,
                left: rowHeaderWidth
            }).setBorderBoxSize({
                width: parentSize.x - rowHeaderWidth,
                height: colHeaderHeight
            });
      
            this.rowContainer.setStyles({
                top: colHeaderHeight,
                left: 0
            }).setBorderBoxSize({
                width: rowHeaderWidth,
                height: parentSize.y - colHeaderHeight
            });
      
            this.contentContainer.setStyles({
                top: colHeaderHeight,
                left: rowHeaderWidth
            }).setBorderBoxSize({
                width: parentSize.x - rowHeaderWidth,
                height: parentSize.y - colHeaderHeight
            });
        },
        
        /**
         * APIMethod: setStore
         * set the store for the grid to display.  If a store is attached to the
         * grid it is removed and the new store is displayed.
         *
         * Parameters:
         * store - {Object} the store to use for this grid
         */
        setStore: function(store) {
            if (this.store) {
                this.store.removeEvents(this.storeEvents);
            }
            if (instanceOf(store, Store)) {
                this.store = store;
                store.addEvents(this.storeEvents);
                if (store.loaded) {
                    this.storeLoaded(store);
                }
                this.render();
                this.domObj.resize();
            } else {
                this.destroyGrid();
            }
        },
        
        /**
         * APIMethod: getStore
         * gets the store set for this grid.
         */
        getStore: function() { 
            return this.store;
        },
        
        storeLoaded: function(store) {
            this.redraw();
        },
        
        /**
         */
        storeChangesCompleted: function(results) {
            if (results && results.successful) {
                //TODO: What goes here?????
            }
        },
        
        redraw: function() {
            var store = this.store,
                template = '',
                tr,
                columns = [],
                useRowHeaders = this.rowModel.useHeaders();
            this.fireEvent('beginCreateGrid');
          
            this.gridObj.getElement('tbody').empty();
            
            this.hoverColumn = this.hoverRow = this.hoverCell = null;
            
            // TODO: consider moving whole thing into Jx.Columns ??
            // create a suitable column representation for everything
            // in the store that doesn't already have a representation
            store.options.fields.each(function(col, index) {
                if (!this.columnModel.getByName(col.name)) {
                    var renderer = new TextRenderer(),
                        format = (col.format !== undefined && col.format !== null) ? col.format : null,
                        template = "<span class='jxGridCellContent'>"+ ((col.label !== undefined && col.label !== null) ? col.label : col.name).capitalize() + "</span>",
                        column;
                    if (col.renderer !== undefined) {
                        if (typeOf(col.renderer) == 'string') {
                            var r = require("./grid/renderer/" + col.renderer);
                            if (r) {
                                renderer = new r();
                            }
                        } else if (typeOf(col.renderer) == 'object' &&
                                   col.renderer.type !== undefined &&
                                   col.renderer.type !== null) {
                            var r = require("./grid/renderer/" + col.renderer.type);
                            if (r) {
                                renderer = new r(col.renderer);
                            }
                        }
                        if (format) {
                            t = typeOf(format);
                            if (t == 'string') {
                                var f = require("./formatter/" + format);    
                                if (f) {
                                    renderer.options.formatter = new f();
                                }
                            } else if (t == 'object' &&
                                   format.type !== undefined &&
                                   format.type !== null) {
                                var f = require("./formatter/" + format.type);
                                if (f) {
                                    renderer.options.formatter = new f(format);
                                }
                            }
                        }
                    }
                    column = new JColumn({
                        grid: this,
                        template: template,
                        renderMode: (col.renderMode !== undefined && col.renderMode !== null) ?
                                      col.renderMode :
                                      (col.width !== undefined && col.width !== undefined) ? 'fixed' : 'fit',
                        width: (col.width !== undefined && col.width !== null) ? col.width : null,
                        isEditable: (col.editable !== undefined && col.editable !== null) ? col.editable : false,
                        isSortable: (col.sortable !== undefined && col.sortable !== null) ? col.sortable : false,
                        isResizable: (col.resizable !== undefined && col.resizable !== null) ? col.resizable : false,
                        isHidden: true,
                        name: col.name || '',
                        renderer: renderer
                    });
                    columns.push(column);
                }
            }, this);
            this.columnModel.addColumns(columns);
            if (this.columnModel.useHeaders()) {
                tr = new Element('tr');
                this.columnModel.getHeaders(tr);
                tr.adopt(new Element('th', {
                    'class': 'jxGridColHead',
                    'html': '&nbsp',
                    styles: {
                        width: 1000
                    }
                }));
                this.colObj.getElement('thead').empty().adopt(tr);
            }
            this.columnModel.calculateWidths();
            this.columnModel.createRules(this.styleSheet+'Columns', '.'+this.uniqueId);
            this.drawStore();
            this.fireEvent('doneCreateGrid');
        },
        
        /**
         * APIMethod: addRow
         * Adds a row to the table. Can add to either the beginning or the end 
         * based on passed flag
         */
        addRow: function (store, record, position) {
            if (this.store.loaded) {
                if (position === 'bottom') {
                    this.store.last();
                } else {
                    this.store.first();
                }
                this.drawRow(record, this.store.index, position);
            }
        },
        
        /**
         * APIMethod: updateRow
         * update a single row in the grid
         *
         * Parameters:
         * index - the row to update
         */
        updateRow: function(index) {
            var record = this.store.getRecord(index);
            this.drawRow(record, index, 'replace');
        },
        
        /**
         * APIMethod: removeRow
         * remove a single row from the grid
         *
         * Parameters:
         * store
         * index
         */
        removeRow: function (store, index) {
            this.gridObj.deleteRow(index);
            this.rowObj.deleteRow(index);
        },
        
        /**
         * APIMethod: removeRows
         * removes multiple rows from the grid
         *
         * Parameters:
         * store
         * index
         */
        removeRows: function (store, first, last) {
            for (var i = first; i <= last; i++) {
                this.removeRow(store, first);
            }
        },
        
        /**
         * APIMethod: setColumnWidth
         * set the width of a column in pixels
         *
         * Parameters:
         * column
         * width
         */
        setColumnWidth: function(column, width) {
            if (column) {
                column.width = width;
                if (column.rule) {
                    column.rule.style.width = width + 'px';
                }
                if (column.cellRule) {
                    column.cellRule.style.width = width + 'px';
                }
            }
        },
        
        /**
         * Method: drawStore
         * clears the grid and redraws the store.  Does not draw the column headers,
         * that is handled by the render() method
         */
        drawStore: function() {
            var useHeaders = this.rowModel.useHeaders(), 
                blank;
            this.domObj.resize();
            this.gridTableBody.empty();
            if (useHeaders) {
                this.rowTableBody.empty();
            }
            this.store.each(function(record,index) {
                this.store.index = index;
                this.drawRow(record, index);
            }, this);
            if (useHeaders) {
                blank = new Element('tr', {
                    styles: { height: 1000 }
                });
                blank.adopt(new Element('th', {
                    'class':'jxGridRowHead', 
                    html: '&nbsp'
                }));
                this.rowTableBody.adopt(blank);
            } 
        },
        
        /**
         * Method: drawRow
         * this method does the heavy lifting of drawing a single record into the
         * grid
         *
         * Parameters:
         * record - {Jx.Record} the record to render
         * index - {Integer} the row index of the record in the store
         * position - {String} 'top' or 'bottom' (default 'bottom') position to put
         *     the new row in the grid.
         */
        drawRow: function(record, index, position) {
            var columns = this.columnModel,
                body = this.gridTableBody,
                row = this.rowModel,
                store = this.store,
                rowHeaders = row.useHeaders(),
                autoRowHeight = row.options.rowHeight == 'auto',
                rowBody = this.rowTableBody,
                rowHeaderColumn,
                rowHeaderColumnIndex,
                renderer,
                formatter, 
                getData,
                tr,
                th,
                text = index + 1,
                rh;
            if (position === undefined || position === null || !['top','bottom','replace'].contains(position)) {
                position = 'bottom';
            }
            tr = row.getGridRowElement(index, '');
            if (position == 'replace' && index < body.childNodes.length) {
                tr.inject(body.childNodes[index], 'after');
                body.childNodes[index].dispose();
            } else {
                tr.inject(body, position);
            }
            columns.getRow(tr, record);
            if (rowHeaders) {
                if (row.options.headerColumn) {
                    rowHeaderColumn = columns.getByName(row.options.headerColumn);
                    renderer = rowHeaderColumn.options.renderer;
                    if (!renderer.domInsert) {
                        formatter = rowHeaderColumn.options.formatter;
                        rowHeaderColumnIndex = columns.columns.indexOf(rowHeaderColumn);
                        getData = function(record) {
                            var data = {},
                            text = '';
                            if (renderer.options.textTemplate) {
                                text = store.fillTemplate(null, renderer.options.textTemplate, renderer.columnsNeeded);
                            } else {
                                text = record.data.get(rowHeaderColumn.name);
                            }
                            data['col'+rowHeaderColumnIndex] = text;
                            return data;
                        };
                        text = rowHeaderColumn.getTemplate(rowHeaderColumnIndex).substitute(getData(record));
                    } else {
                        text = '';
                    }
                }
                th = row.getRowHeaderCell(text);
                if (row.options.headerColumn && renderer.domInsert) {
                    th.adopt(rowHeaderColumn.getHTML());
                }
                rh = new Element('tr').adopt(th);
                if (position == 'replace' && index < rowBody.childNodes.length) {
                    rh.inject(rowBody.childNodes[index], 'after');
                    rowBody.childNodes[index].dispose();
                } else {
                    rh.inject(rowBody, position);
                }
                if (autoRowHeight) {
                    // th.setBorderBoxSize({height: tr.childNodes[0].getBorderBoxSize().height});
                    rh.setBorderBoxSize({height: tr.getBorderBoxSize().height});
                }
            }
            this.fireEvent('gridDrawRow', [index, record]);
        },
        
        /**
         * Method: clickColumnHeader
         * handle clicks on the column header
         */
        clickColumnHeader: function(e) {
            var target = e.target;
            if (target.getParent('thead')) {
                target = target.tagName == 'TH' ? target : target.getParent('th');
                this.fireEvent('gridColumnClick', target);
            }
        },
        
        /**
         * Method: moveColumnHeader
         * handle the mouse moving over the column header
         */
        moveColumnHeader: function(e) {
            var target = e.target;
            target = target.tagName == 'TH' ? target : target.getParent('th.jxGridColHead');
            if (target) {
                if (this.hoverColumn != target) {
                    if (this.hoverColumn) {
                        this.fireEvent('gridColumnLeave', this.hoverColumn);
                    }
                    if (!target.hasClass('jxGridColHead')) {
                        this.leaveGrid(e);
                    } else {
                        this.hoverColumn = target;
                        this.fireEvent('gridColumnEnter', target);
                    }
                }
            }
        },
      
        /**
         * Method: clickRowHeader
         * handle clicks on the row header
         */
        clickRowHeader: function(e) {
            var target = e.target;
            if (target.getParent('tbody')) {
                target = target.tagName == 'TH' ? target : target.getParent('th');
                this.fireEvent('gridRowClick', target);
            }
        },
        
        /**
         * Method: moveRowHeader
         * handle the mouse moving over the row header
         */
        moveRowHeader: function(e) {
            var target = e.target;
            target = target.tagName == 'TH' ? target : target.getParent('th.jxGridRowHead');
            if (target) {
                if (this.hoverRow != target) {
                    if (this.hoverRow) {
                        this.fireEvent('gridRowLeave', this.hoverRow);
                    }
                    if (!target.hasClass('jxGridRowHead')) {
                        this.leaveGrid(e);
                    } else {
                        this.hoverRow = target;
                        this.fireEvent('gridRowEnter', target);
                    }
                }
            }
        },
        
        /**
         * Method: clickCell
         * handle clicks on cells in the grid
         */
        clickCell: function(e) {
            var target = e.target;
            if (target.getParent('tbody')) {
                target = target.tagName == 'TD' ? target : target.getParent('td');
                this.fireEvent('gridCellClick', target);
            }
        },
        
        /**
         * Method: dblclickCell
         * handle doubleclicks on cells in the grid
         */
        dblclickCell: function(e) {
            var target = e.target;
            if (target.getParent('tbody')) {
                target = target.tagName == 'TD' ? target : target.getParent('td');
                this.fireEvent('gridCellDblClick', target);
            }
        },
        
        /**
         * Method: moveCell
         * handle the mouse moving over cells in the grid
         */
        moveCell: function(e) {
            var target = e.target,
                data,
                body,
                row,
                index,
                column;
            target = target.tagName == 'TD' ? target : target.getParent('td.jxGridCell');
            if (target) {
                if (this.hoverCell != target) {
                    if (this.hoverCell) {
                        this.fireEvent('gridCellLeave', this.hoverCell);
                    }
                    if (!target.hasClass('jxGridCell')) {
                        this.leaveGrid(e);
                    } else {
                        this.hoverCell = target;
                        this.getCellData(target);
                        this.fireEvent('gridCellEnter', target);
                    }
                }
            }
        },
        
        getCellData: function(cell) {
            var data = null,
                index,
                column,
                row;
            if (!cell.hasClass('jxGridCell')) {
                cell = cell.getParent('td.jxGridCell');
            }
            if (cell) {
                body = this.gridTableBody;
                row = body.getChildren().indexOf(cell.getParent('tr'));
                this.columnModel.columns.some(function(col,idx){
                    if (cell.hasClass('jxGridCol'+idx)) {
                        index = idx;
                        column = col;
                        return true;
                    }
                    return false;
                });
                data = {
                    row: row,
                    column: column,
                    index: index
                };
                cell.store('jxCellData', data);
            }
            return data;
        },
        
        /**
         * Method: leaveGrid
         * handle the mouse leaving the grid
         */
        leaveGrid: function(e) {
            this.hoverCell = null;
            this.fireEvent('gridMouseLeave');
        },
        
        /**
         * Method: changeText
         * rerender the grid when the language changes
         */
        changeText : function(lang) {
            this.parent();
            this.render();
        },
        
        /**
         * Method: addEvent
         * override default addEvent to also trigger wanting the event
         * which will then cause the underlying events to be registered
         */
        addEvent: function(name, fn) {
            this.wantEvent(name);
            this.parent(name, fn);
        }
    });
    
    if (base.global) {
        base.global.Grid = grid;
    }
    
    return grid;
    
});
