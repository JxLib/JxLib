// $Id$
/**
 * Class: Jx.Grid
 * 
 * Extends: <Jx.Widget>
 *
 * A tabular control that has fixed, optional, scrolling headers on the rows and columns
 * like a spreadsheet.
 *
 * Jx.Grid is a tabular control with convenient controls for resizing columns,
 * sorting, and inline editing.  It is created inside another element, typically a
 * div.  If the div is resizable (for instance it fills the page or there is a
 * user control allowing it to be resized), you must call the resize() method
 * of the grid to let it know that its container has been resized.
 *
 * When creating a new Jx.Grid, you can specify a number of options for the grid
 * that control its appearance and functionality. You can also specify plugins to 
 * load for additional functionality. Currently Jx provides the following plugins 
 * 
 * Prelighter - prelights rows, columns, and cells 
 * Selector - selects rows, columns, and cells
 *
 * Jx.Grid renders data that comes from an external source.  This external 
 * source, called the model, must be a Jx.Store or extended from it (such as 
 * Jx.Store.Remote).
 *
 *
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Grid = new Class({

    Family : 'Jx.Grid',
    Extends : Jx.Widget,

    options : {
        /* Option: parent
         * the HTML element to create the grid inside. The grid will resize
         * to fill the domObj.
         */
        parent : null,

        /* Options: columns
         * an object consisting of a columns array that defines the individuals
         * columns as well as containing any options for Jx.Grid.Columns or 
         * a Jx.Grid.Columns object itself.
         */
        columns : {
            columns : []
        },

        /* Option: row
         * Either a Jx.Grid.Row object or a json object defining options for
         * the class
         */
        row : null,

        /* Option: plugins
         * an array containing Jx.Grid.Plugin subclasses or an object 
         * that indicates the name of a predefined plugin and its options.
         */
        plugins : [],

        /* Option: model
         * An instance of Jx.Store or one of its descendants
         */
        model : null

    },

    model : null,
    columns : null,
    row : null,
    plugins : new Hash(),
    currentCell : null,

    /**
     * Constructor: Jx.Grid
     * 
     * Parameters: 
     * options - defined below
     * 
     * Options:
     *  parent - The element, or an id of one, that the grid will be inserted into.
     *  columns - A Jx.Columns object or the config object for one.
     *  row - A Jx.Row object or the config object for one.
     *  plugin - an array of Jx.Plugin descendants and/or config objects for them
     *  model - A Jx.Store or a class that descends from it.
     */
    initialize : function (options) {
        this.parent(options);

        if ($defined(this.options.model)
                && this.options.model instanceof Jx.Store) {
            this.model = this.options.model;
            this.model.addEvent('columnChanged', this.modelChanged
                    .bind(this));
            this.model.addEvent('sortFinished', this.render.bind(this));
        }

        if ($defined(this.options.columns)) {
            if (this.options.columns instanceof Jx.Columns) {
                this.columns = this.options.columns;
            } else if ($type(this.options.columns) === 'object') {
                this.columns = new Jx.Columns(this.options.columns,
                        this);
            }
        }

        //check for row
        if ($defined(this.options.row)) {
            if (this.options.row instanceof Jx.Row) {
                this.row = this.options.row;
            } else if ($type(this.options.row) === "object") {
                this.row = new Jx.Row(this.options.row, this);
            }
        } else {
            this.row = new Jx.Row({}, this);
        }

        //initialize the grid
        this.domObj = new Element('div');
        var l = new Jx.Layout(this.domObj, {
            onSizeChange : this.resize.bind(this)
        });

        if (this.options.parent) {
            this.addTo(this.options.parent);
        }

        //top left corner
        this.rowColObj = new Element('div', {
            'class' : 'jxGridContainer'
        });

        //holds the column headers
        this.colObj = new Element('div', {
            'class' : 'jxGridContainer'
        });
        this.colTable = new Element('table', {
            'class' : 'jxGridTable'
        });
        this.colTableBody = new Element('tbody');
        this.colTable.appendChild(this.colTableBody);
        this.colObj.appendChild(this.colTable);

        //hold the row headers
        this.rowObj = new Element('div', {
            'class' : 'jxGridContainer'
        });
        this.rowTable = new Element('table', {
            'class' : 'jxGridTable'
        });
        this.rowTableHead = new Element('thead');
        this.rowTable.appendChild(this.rowTableHead);
        this.rowObj.appendChild(this.rowTable);

        //The actual body of the grid
        this.gridObj = new Element('div', {
            'class' : 'jxGridContainer',
            styles : {
                overflow : 'auto'
            }
        });
        this.gridTable = new Element('table', {
            'class' : 'jxGridTable'
        });
        this.gridTableBody = new Element('tbody');
        this.gridTable.appendChild(this.gridTableBody);
        this.gridObj.appendChild(this.gridTable);

        this.domObj.appendChild(this.rowColObj);
        this.domObj.appendChild(this.rowObj);
        this.domObj.appendChild(this.colObj);
        this.domObj.appendChild(this.gridObj);

        this.gridObj.addEvent('scroll', this.onScroll.bind(this));
        this.gridObj.addEvent('click', this.onGridClick
                .bindWithEvent(this));
        this.rowObj.addEvent('click', this.onGridClick
                .bindWithEvent(this));
        this.colObj.addEvent('click', this.onGridClick
                .bindWithEvent(this));
        this.gridObj.addEvent('mousemove', this.onMouseMove
                .bindWithEvent(this));
        this.rowObj.addEvent('mousemove', this.onMouseMove
                .bindWithEvent(this));
        this.colObj.addEvent('mousemove', this.onMouseMove
                .bindWithEvent(this));

        //initialize the plugins
        if ($defined(this.options.plugins)
                && $type(this.options.plugins) === 'array') {
            this.options.plugins.each(function (plugin) {
                if (plugin instanceof Jx.Plugin) {
                    plugin.init(this);
                    this.plugins.set(plugin.name, plugin);
                } else if ($type(plugin) === 'object') {
                    var p = new Jx.Plugin[plugin.name](plugin.options);
                    p.init(this);
                    this.plugins.set(p.name, p);
                }
            }, this);
        }
    },

    /**
     * Method: onScroll
     * handle the grid scrolling by updating the position of the headers
     */
    onScroll : function () {
        this.colObj.scrollLeft = this.gridObj.scrollLeft;
        this.rowObj.scrollTop = this.gridObj.scrollTop;
    },

    /**
     * Method: onMouseMove
     * Handle the mouse moving over the grid. This determines
     * what column and row it's over and fires the gridMove event 
     * with that information for plugins to respond to.
     *
     * Parameters:
     * e - {Event} the browser event object
     */
    onMouseMove : function (e) {
        var rc = this.getRowColumnFromEvent(e);
        if (!$defined(this.currentCell)
                || (this.currentCell.row !== rc.row || this.currentCell.column !== rc.column)) {
            this.currentCell = rc;
            this.fireEvent('gridMove', rc);
        }

    },
    /**
     * Method: onGridClick
     * handle the user clicking on the grid. Fires gridClick
     * event for plugins to respond to.
     *
     * Parameters:
     * e - {Event} the browser event object
     */
    onGridClick : function (e) {
        var rc = this.getRowColumnFromEvent(e);
        this.fireEvent('gridClick', rc);
    },

    /**
     * Method: getRowColumnFromEvent
     * retrieve the row and column indexes from an event click.
     * This function is used by the grid, row header and column
     * header to safely get these numbers.
     *
     * If the event isn't valid (i.e. it wasn't on a TD or TH) then
     * the returned values will be -1, -1
     *
     * Parameters:
     * e - {Event} the browser event object
     *
     * @return Object an object with two properties, row and column,
     *         that contain the row and column that was clicked
     */
    getRowColumnFromEvent : function (e) {
        var td = e.target;
        if (td.tagName === 'SPAN') {
            td = $(td).getParent();
        }
        if (td.tagName !== 'TD' && td.tagName !== 'TH') {
            return {
                row : -1,
                column : -1
            };
        }

        var colheader = false;
        var rowheader = false;
        //check if this is a header (row or column)
        if (td.descendantOf(this.colTable)) {
            colheader = true;
        }
    
        if (td.descendantOf(this.rowTable)) {
            rowheader = true;
        }
    
        var tr = td.parentNode;
        var col = td.cellIndex;
        var row = tr.rowIndex;
        /*
         * if this is not a header cell, then increment the row and col. We do this
         * based on whether the header is shown. This way the row/col remains consistent
         * to the grid but also takes into account the headers. It also allows
         * us to refrain from having to fire a separate event for headers.
         * 
         *  Plugins/event listeners should always take into account whether headers
         *  are displayed or not.
         */
        if (this.row.useHeaders() && !rowheader) {
            col++;
        }
        if (this.columns.useHeaders() && !colheader) {
            row++;
        }
    
        if (Browser.Engine.webkit) {
            /* bug in safari (webkit) returns 0 for cellIndex - only choice seems
             * to be to loop through the row
             */
            for (var i = 0; i < tr.childNodes.length; i++) {
                if (tr.childNodes[i] === td) {
                    col = i;
                    break;
                }
            }
        }
        return {
            row : row,
            column : col
        };
    },
    
    /**
     * APIMethod: resize
     * resize the grid to fit inside its container.  This involves knowing something
     * about the model it is displaying (the height of the column header and the
     * width of the row header) so nothing happens if no model is set
     */
    resize : function () {
        if (!this.model) {
            return;
        }

        var colHeight = this.columns.useHeaders() ? this.columns
                .getHeaderHeight() : 1;
        var rowWidth = this.row.useHeaders() ? this.row
                .getRowHeaderWidth() : 1;

        var size = this.domObj.getContentBoxSize();

        //sum all of the column widths except the hidden columns and the header column
        var w = size.width - rowWidth - 1;
        var totalCols = 0;
        this.columns.columns.each(function (col) {
            if (col.options.modelField !== this.row.getRowHeaderField()
                    && !col.isHidden()) {
                totalCols += col.getWidth();
            }
        }, this);

        //TODO: if totalCol width is less than the gridwidth (w) what do we do?

        /* -1 because of the right/bottom borders */
        this.rowColObj.setStyles({
            width : rowWidth - 1,
            height : colHeight - 1
        });
        this.rowObj.setStyles({
            top : colHeight,
            left : 0,
            width : rowWidth - 1,
            height : size.height - colHeight - 1
        });

        this.colObj.setStyles({
            top : 0,
            left : rowWidth,
            width : size.width - rowWidth - 1,
            height : colHeight - 1
        });

        this.gridObj.setStyles({
            top : colHeight,
            left : rowWidth,
            width : size.width - rowWidth - 1,
            height : size.height - colHeight - 1
        });

    },

    /**
     * APIMethod: setModel
     * set the model for the grid to display.  If a model is attached to the grid
     * it is removed and the new model is displayed. However, It needs to have 
     * the same columns
     * 
     * Parameters:
     * model - {Object} the model to use for this grid
     */
    setModel : function (model) {
        this.model = model;
        if (this.model) {
            this.render();
            this.domObj.resize();
        } else {
            this.destroyGrid();
        }
    },

    /**
     * APIMethod: getModel
     * gets the model set for this grid.
     */
    getModel : function () {
        return this.model;
    },

    /**
     * APIMethod: destroyGrid
     * destroy the contents of the grid safely
     */
    destroyGrid : function () {

        var n = this.colTableBody.cloneNode(false);
        this.colTable.replaceChild(n, this.colTableBody);
        this.colTableBody = n;

        n = this.rowTableHead.cloneNode(false);
        this.rowTable.replaceChild(n, this.rowTableHead);
        this.rowTableHead = n;

        n = this.gridTableBody.cloneNode(false);
        this.gridTable.replaceChild(n, this.gridTableBody);
        this.gridTableBody = n;

    },

    /**
     * APIMethod: render
     * Create the grid for the current model
     */
    render : function () {
        this.destroyGrid();

        this.fireEvent('beginCreateGrid', this);

        if (this.model) {
            var model = this.model;
            var nColumns = this.columns.getColumnCount();
            var nRows = model.count();
            var th;
            
            /* create header if necessary */
            if (this.columns.useHeaders()) {
                this.colTableBody.setStyle('visibility', 'visible');
                var colHeight = this.columns.getHeaderHeight();
                var trBody = new Element('tr', {
                    styles : {
                        height : colHeight
                    }
                });
                this.colTableBody.appendChild(trBody);

                this.columns.getHeaders(trBody);

                /* one extra column at the end for filler */
                th = new Element('th', {
                    styles : {
                        width : 1000,
                        height : colHeight - 1
                    }
                });
                th.addClass('jxGridColHead');
                trBody.appendChild(th);

            } else {
                //hide the headers
                this.colTableBody.setStyle('visibility', 'hidden');
            }
            
            if (this.row.useHeaders()) {
                this.rowTableHead.setStyle('visibility', 'visible');
                
                var tr;
                //loop through all rows and add header
                this.model.first();
                while (this.model.valid()) {
                    tr = this.row.getRowHeader();
                    this.rowTableHead.appendChild(tr);
                    if (this.model.hasNext()) {
                        this.model.next();
                    } else {
                        break;
                    }
                }
                /* one extra row at the end for filler */
                tr = new Element('tr');
                th = new Element('th', {
                    'class' : 'jxGridRowHead',
                    styles : {
                        width : this.row.getRowHeaderWidth(),
                        height : 1000
                    }
                });
                tr.appendChild(th);
                this.rowTableHead.appendChild(tr);
            } else {
                //hide row headers
                this.rowTableHead.setStyle('visibility', 'hidden');
            }
            
            colHeight = this.columns.getHeaderHeight();
            
            //This section actually adds the rows
            this.model.first();
            while (this.model.valid()) {
                tr = this.row.getGridRowElement();
                this.gridTableBody.appendChild(tr);
        
                //Actually add the columns 
                this.columns.getColumnCells(tr);
        
                if (this.model.hasNext()) {
                    this.model.next();
                } else {
                    break;
                }
        
            }
        
        }
        this.domObj.resize();
        this.fireEvent('doneCreateGrid', this);
    },
    
    /**
     * Method: modelChanged
     */
    modelChanged : function (row, col) {
        //grab new TD
        var column = this.columns.getIndexFromGrid(col.name);
        var td = $(this.gridObj.childNodes[row].childNodes[column]);
    
        var currentRow = this.model.getPosition();
        this.model.moveTo(row);
        var newTD = this.columns.getColumnCell(this.column
                .getByName(col.name));
        newTD.replaces(td);
        this.model.moveTo(currentRow);
    
    }

});
