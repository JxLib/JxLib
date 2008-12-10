// $Id$
/**
 * Class: Jx.Grid
 * A tabular control that has fixed scrolling headers on the rows and columns
 * like a spreadsheet.
 *
 * Jx.Grid is a tabular control with convenient controls for resizing columns,
 * sorting, and inline editing.  It is created inside another element, typically a
 * div.  If the div is resizable (for instance it fills the page or there is a
 * user control allowing it to be resized), you must call the resize() method
 * of the grid to let it know that its container has been resized.
 *
 * When creating a new Jx.Grid, you can specify a number of options for the grid
 * that control its appearance and functionality.
 *
 * Jx.Grid renders data that comes from an external source.  This external 
 * source, called the model, must implement the following interface.
 *
 *
 * Example:
 * (code)
 * (end)
 *
 * Implements:
 * Options - MooTools Class.Extras
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Grid = new Class({
    Implements: [Options, Events, Jx.Addable],
    domObj : null,
    model : null,
    options: {
        alternateRowColors: false,
        rowHeaders: false,
        columnHeaders: false,
        rowSelection: false,
        columnSelection: false,
        cellPrelight: false,
        rowPrelight: false,
        columnPrelight: false,
        rowHeaderPrelight: false,
        columnHeaderPrelight: false,
        cellSelection: false
    },
    /**
     * Constructor: Jx.Grid
     * construct a new instance of Jx.Grid within the domObj
     *
     * Parameters:
     * options - you can specify some options as attributes of a
     * generic object.
     *
     * Options:
     * parent - {HTMLElement} the HTML element to create the grid inside.
     *          The grid will resize to fill the domObj.
     * alternateRowColors - defaults to false.  If set to true, then
     *      alternating CSS classes are used for rows
     * rowHeaders - defaults to false.  If set to true, then a column
     *      of row header cells are displayed.
     * columnHeaders - defaults to false.  If set to true, then a column
     *      of row header cells are displayed.
     * rowSelection - defaults to false.  If set to true, allow the
     *      user to select rows.
     * columnSelection - defaults to false.  If set to true, allow the
     *      user to select columns.
     * cellSelection - defaults to false.  If set to true, allow the
     *      user to select cells.
     * cellPrelight - defaults to false.  If set to true, the cell under
     *      the mouse is highlighted as the mouse moves.
     * rowPrelight - defaults to false.  If set to true, the row under
     *      the mouse is highlighted as the mouse moves.
     * columnPrelight - defaults to false.  If set to true, the column
     *      under the mouse is highlighted as the mouse moves.
     */
    initialize : function( options ) {
        this.setOptions(options);

        this.domObj = new Element('div');
        new Jx.Layout(this.domObj, {
            onSizeChange: this.resize.bind(this)
        });
        
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }        
        
        this.rowColObj = new Element('div', {'class':'jxGridContainer'});
        
        this.colObj = new Element('div', {'class':'jxGridContainer'});
        this.colTable = new Element('table', {'class':'jxGridTable'});
        this.colTableHead = new Element('thead');
        this.colTable.appendChild(this.colTableHead);
        this.colTableBody = new Element('tbody');
        this.colTable.appendChild(this.colTableBody);
        this.colObj.appendChild(this.colTable);
        
        this.rowObj = new Element('div', {'class':'jxGridContainer'});
        this.rowTable = new Element('table', {'class':'jxGridTable'});
        this.rowTableHead = new Element('thead');
        this.rowTable.appendChild(this.rowTableHead);
        this.rowObj.appendChild(this.rowTable);
        
        this.gridObj = new Element('div', {'class':'jxGridContainer',styles:{overflow:'scroll'}});
        this.gridTable = new Element('table', {'class':'jxGridTable'});
        this.gridTableBody = new Element('tbody');
        this.gridTable.appendChild(this.gridTableBody);
        this.gridObj.appendChild(this.gridTable);
        
        this.domObj.appendChild(this.rowColObj);
        this.domObj.appendChild(this.rowObj);
        this.domObj.appendChild(this.colObj);
        this.domObj.appendChild(this.gridObj);
                        
        this.gridObj.addEvent('scroll', this.onScroll.bind(this));
        this.gridObj.addEvent('click', this.onClickGrid.bindWithEvent(this));
        this.rowObj.addEvent('click', this.onClickRowHeader.bindWithEvent(this));
        this.colObj.addEvent('click', this.onClickColumnHeader.bindWithEvent(this));
        this.gridObj.addEvent('mousemove', this.onMouseMoveGrid.bindWithEvent(this));
        this.rowObj.addEvent('mousemove', this.onMouseMoveRowHeader.bindWithEvent(this));
        this.colObj.addEvent('mousemove', this.onMouseMoveColumnHeader.bindWithEvent(this));
    },
    
    /**
     * Method: onScroll
     * handle the grid scrolling by updating the position of the headers
     */
    onScroll: function() {
        this.colObj.scrollLeft = this.gridObj.scrollLeft;
        this.rowObj.scrollTop = this.gridObj.scrollTop;        
    },
    
    /**
     * Method: resize
     * resize the grid to fit inside its container.  This involves knowing something
     * about the model it is displaying (the height of the column header and the
     * width of the row header) so nothing happens if no model is set
     */
    resize: function() {
        if (!this.model) {
            return;
        }
        
        /* TODO: Jx.Grid.resize
         * if not showing column or row, should we handle the resize differently
         */
        var colHeight = this.options.columnHeaders ? this.model.getColumnHeaderHeight() : 1;
        var rowWidth = this.options.rowHeaders ? this.model.getRowHeaderWidth() : 1;
        
        var size = Element.getContentBoxSize(this.domObj);
        
        /* -1 because of the right/bottom borders */
        this.rowColObj.setStyles({
            width: rowWidth-1, 
            height: colHeight-1
        });
        this.rowObj.setStyles({
            top:colHeight,
            left:0,
            width:rowWidth-1,
            height:size.height-colHeight-1
        });

        this.colObj.setStyles({
            top: 0,
            left: rowWidth,
            width: size.width - rowWidth - 1,
            height: colHeight - 1
        });

        this.gridObj.setStyles({
            top: colHeight,
            left: rowWidth,
            width: size.width - rowWidth - 1,
            height: size.height - colHeight - 1 
        });
    },
    
    /**
     * Method: setModel
     * set the model for the grid to display.  If a model is attached to the grid
     * it is removed and the new model is displayed.
     * 
     * Parameters:
     * model - {Object} the model to use for this grid
     */
    setModel: function(model) {
        this.model = model;
        if (this.model) {
            if (this.domObj.resize) {
                this.domObj.resize();
            }
            this.createGrid();
            this.resize();
        } else {
            this.destroyGrid();
        }
    },
    
    /**
     * Method: destroyGrid
     * destroy the contents of the grid safely
     */
    destroyGrid: function() {
        var n = this.colTableHead.cloneNode(false);
        this.colTable.replaceChild(n, this.colTableHead);
        this.colTableHead = n;
        
        n = this.colTableBody.cloneNode(false);
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
     * Method: createGrid
     * create the grid for the current model
     */
    createGrid: function() {
        this.destroyGrid();
        if (this.model) {
            var model = this.model;
            var nColumns = model.getColumnCount();
            var nRows = model.getRowCount();
            
            /* create header if necessary */
            if (this.options.columnHeaders) {
                var colHeight = model.getColumnHeaderHeight();
                var trHead = new Element('tr');
                this.colTableHead.appendChild(trHead);
                var trBody = new Element('tr');
                this.colTableBody.appendChild(trBody);
                
                var th = new Element('th', {styles:{width:0,height:0}});
                trHead.appendChild(th);
                th = th.cloneNode(true);
                th.setStyle('height',colHeight);
                trBody.appendChild(th);
                for (var i=0; i<nColumns; i++) {
                    var colWidth = model.getColumnWidth(i);
                    th = new Element('th', {'class':'jxGridColHeadHide',styles:{width:colWidth}});
                    var p = new Element('p', {styles:{height:0,width:colWidth}});
                    th.appendChild(p);
                    trHead.appendChild(th);
                    th = new Element('th', {
                        'class':'jxGridColHead', 
                        html:model.getColumnHeaderHTML(i)
                    });
                    trBody.appendChild(th);
                }
                /* one extra column at the end for filler */
                var th = new Element('th',{styles:{width:1000,height:0}});
                trHead.appendChild(th);
                th = th.cloneNode(true);
                th.setStyle('height',colHeight - 1);
                th.className = 'jxGridColHead';
                trBody.appendChild(th);
                
            }
            
            if (this.options.rowHeaders) {
                var rowWidth = model.getRowHeaderWidth();
                var tr = new Element('tr');
                var td = new Element('td', {styles:{width:0,height:0}});
                tr.appendChild(td);
                var th = new Element('th', {styles:{width:rowWidth,height:0}});
                tr.appendChild(th);
                this.rowTableHead.appendChild(tr);
                for (var i=0; i<nRows; i++) {
                    var rowHeight = model.getRowHeight(i);
                    var tr = new Element('tr');
                    var td = new Element('td', {'class':'jxGridRowHeadHide', styles:{width:0,height:rowHeight}});
                    var p = new Element('p', {styles:{width:0,height:rowHeight}});
                    td.appendChild(p);
                    tr.appendChild(td);
                    var th = new Element('th', {'class':'jxGridRowHead', html:model.getRowHeaderHTML(i)});
                    tr.appendChild(th);
                    this.rowTableHead.appendChild(tr);
                }
                /* one extra row at the end for filler */
                var tr = new Element('tr');
                var td = new Element('td',{
                    styles:{
                        width:0,
                        height:1000
                    }
                });
                tr.appendChild(td);
                var th = new Element('th',{
                    'class':'jxGridRowHead',
                    styles:{
                        width:rowWidth,
                        height:1000
                    }
                });
                tr.appendChild(th);
                this.rowTableHead.appendChild(tr);
            }
            
            var colHeight = model.getColumnHeaderHeight();
            var trBody = new Element('tr');
            this.gridTableBody.appendChild(trBody);
            
            var td = new Element('td', {styles:{width:0,height:0}});
            trBody.appendChild(td);
            for (var i=0; i<nColumns; i++) {
                var colWidth = model.getColumnWidth(i);
                td = new Element('td', {'class':'jxGridColHeadHide', styles:{width:colWidth}});
                var p = new Element('p', {styles:{width:colWidth,height:0}});
                td.appendChild(p);
                trBody.appendChild(td);
            }
            
            for (var j=0; j<nRows; j++) {
                var rowHeight = model.getRowHeight(j);
                var actualRowHeight = rowHeight;
                var tr = new Element('tr');
                this.gridTableBody.appendChild(tr);
                
                var td = new Element('td', {
                    'class':'jxGridRowHeadHide',
                    styles: {
                        width: 0,
                        height:rowHeight
                    }
                });
                var p = new Element('p',{styles:{height:rowHeight}});
                td.appendChild(p);
                tr.appendChild(td);
                for (var i=0; i<nColumns; i++) {
                    var colWidth = model.getColumnWidth(i);
                    td = new Element('td', {'class':'jxGridCell'});
                    td.innerHTML = model.getValueAt(j,i);
                    tr.appendChild(td);
                    var tdSize = td.getSize();
                    if (tdSize.height > actualRowHeight) {
                        actualRowHeight = tdSize.height;
                    }
                }
                /* some notes about row sizing
                 * In Safari, the height of a TR is always returned as 0
                 * In Safari, the height of any given TD is the height it would
                 * render at, not the actual height of the row
                 * In IE, the height is returned 1px bigger than any other browser
                 * Firefox just works
                 *
                 * So, for Safari, we have to measure every TD and take the highest one
                 * and if its IE, we subtract 1 from the overall height, making all
                 * browsers identical
                 *
                 * Using document.all is not a good hack for this
                 */
                if (document.all) {
                    actualRowHeight -= 1;
                }
                if (this.options.rowHeaders) {
                    this.setRowHeaderHeight(j, actualRowHeight);                    
                }
                /* if we apply the class before adding content, it
                 * causes a rendering error in IE (off by 1) that is 'fixed'
                 * when another class is applied to the row, causing dynamic
                 * shifting of the row heights
                 */
                if (this.options.alternateRowColors) {
                    tr.className = (j%2) ? 'jxGridRowOdd' : 'jxGridRowEven';
                } else {
                    tr.className = 'jxGridRowAll';
                }
            }
            
        }
    },
    
    /**
     * Method: setRowHeaderHeight
     * set the height of a row.  This is used internally to adjust the height of
     * the row header when cell contents wrap.  A limitation of the table structure
     * is that overflow: hidden on a td will work horizontally but not vertically
     *
     * Parameters:
     * row - {Integer} the row to set the height for
     * height - {Integer} the height to set the row (in pixels)
     */
    setRowHeaderHeight: function(row, height) {
        //this.rowTableHead.childNodes[row+1].childNodes[0].style.height = (height) + 'px';
        this.rowTableHead.childNodes[row+1].childNodes[0].childNodes[0].style.height = (height) + 'px';
    },
    
    /**
     * Method: gridChanged
     * called through the grid listener interface when data has changed in the
     * underlying model
     *
     * Parameters:
     * model - {Object} the model that changed
     * row - {Integer} the row that changed
     * col - {Integer} the column that changed
     * value - {Mixed} the new value
     */
    gridChanged: function(model, row, col, value) {
        if (this.model == model) {
            this.gridObj.childNodes[row].childNodes[col].innerHTML = value;
        }
    },
    
    /** 
     * Method: prelightRowHeader
     * apply the jxGridRowHeaderPrelight style to the header cell of a row.
     * This removes the style from the previously pre-lit row header.
     * 
     * Parameters:
     * row - {Integer} the row to pre-light the header cell of
     */
    prelightRowHeader: function(row) {
        var cell = (row >= 0 && row < this.rowTableHead.rows.length-1) ? this.rowTableHead.rows[row+1].cells[1] : null;
        if (this.prelitRowHeader != cell) {
            if (this.prelitRowHeader) {
                this.prelitRowHeader.removeClass('jxGridRowHeaderPrelight');
            }
            this.prelitRowHeader = cell;
            if (this.prelitRowHeader) {
                this.prelitRowHeader.addClass('jxGridRowHeaderPrelight');
            }
        }
    },
    
    /** 
     * Method: prelightColumnHeader
     * apply the jxGridColumnHeaderPrelight style to the header cell of a column.
     * This removes the style from the previously pre-lit column header.
     * 
     * Parameters:
     * col - {Integer} the column to pre-light the header cell of
     */
    prelightColumnHeader: function(col) {
        if (this.colTableBody.rows.length == 0) {
            return;
        }
        var cell = (col >= 0 && col < this.colTableBody.rows[0].cells.length-1) ? this.colTableBody.rows[0].cells[col+1] : null;
        if (this.prelitColumnHeader != cell) {
            if (this.prelitColumnHeader) {
                this.prelitColumnHeader.removeClass('jxGridColumnHeaderPrelight');
            }
            this.prelitColumnHeader = cell;
            if (this.prelitColumnHeader) {
                this.prelitColumnHeader.addClass('jxGridColumnHeaderPrelight');
            }
        }
    },
    
    /** 
     * Method: prelightRow
     * apply the jxGridRowPrelight style to row.
     * This removes the style from the previously pre-lit row.
     * 
     * Parameters:
     * row - {Integer} the row to pre-light
     */
    prelightRow: function(row) {
        var tr = (row >= 0 && row < this.gridTableBody.rows.length-1) ? this.gridTableBody.rows[row+1] : null;
        
        if (this.prelitRow != row) {
            if (this.prelitRow) {
                this.prelitRow.removeClass('jxGridRowPrelight');
            }
            this.prelitRow = tr;
            if (this.prelitRow) {
                this.prelightRowHeader(row);
                this.prelitRow.addClass('jxGridRowPrelight');
            }
        }
    },
    
    /** 
     * Method: prelightColumn
     * apply the jxGridColumnPrelight style to a column.
     * This removes the style from the previously pre-lit column.
     * 
     * Parameters:
     * col - {Integer} the column to pre-light
     *
     * TODO: Jx.Grid.prelightColumn
     * Not Yet Implemented.
     */
    prelightColumn: function(col) {
        /* TODO: Jx.Grid.prelightColumn
         * implement column prelighting (possibly) 
         */
        if (col >= 0 && col < this.gridTable.rows[0].cells.length) {
            if ($chk(this.prelitColumn)) {
                for (var i=0; i<this.gridTable.rows.length; i++) {
                    this.gridTable.rows[i].cells[this.prelitColumn + 1].removeClass('jxGridColumnPrelight');
                }
            }
            this.prelitColumn = col;
            for (var i=0; i<this.gridTable.rows.length; i++) {
                this.gridTable.rows[i].cells[col + 1].addClass('jxGridColumnPrelight');
            }            
        }
        
        this.prelightColumnHeader(col);
    },
    
    /** 
     * Method: prelightCell
     * apply the jxGridCellPrelight style to a cell.
     * This removes the style from the previously pre-lit cell.
     *
     * Parameters:
     * row - {Integer} the row of the cell to pre-light
     * col - {Integer} the column of the cell to pre-light
     */
    prelightCell: function(row, col) {
         var td = (row >=0 && col >=0 && row < this.gridTableBody.rows.length - 1 && col < this.gridTableBody.rows[row+1].cells.length - 1) ? this.gridTableBody.rows[row+1].cells[col+1] : null;
        if (this.prelitCell != td) {
            if (this.prelitCell) {
                this.prelitCell.removeClass('jxGridCellPrelight');
            }
            this.prelitCell = td;
            if (this.prelitCell) {
                this.prelitCell.addClass('jxGridCellPrelight');
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
         var td = (row >=0 && col >=0 && row < this.gridTableBody.rows.length - 1 && col < this.gridTableBody.rows[row+1].cells.length - 1) ? this.gridTableBody.rows[row+1].cells[col+1] : null;
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
     * Method: selectRowHeader
     * Apply the jxGridRowHeaderSelected style to the row header cell of a
     * selected row.
     *
     * Parameters:
     * row - {Integer} the row header to select
     * selected - {Boolean} the new state of the row header
     */
    selectRowHeader: function(row, selected) {
        var cell = (row >= 0 && row < this.rowTableHead.rows.length-1) ? this.rowTableHead.rows[row+1].cells[1] : null;
        if (!cell) {
            return;
        }
        if (selected) {
            cell.addClass('jxGridRowHeaderSelected');
        } else {
            cell.removeClass('jxGridRowHeaderSelected');
        }
    },
    
    /** 
     * Method: selectRow
     * Select a row and apply the jxGridRowSelected style to it.
     *
     * If the model supports row selection, it should implement
     * a rowSelected function to receive notification of the selection.
     *
     * Parameters:
     * row - {Integer} the row to select
     * selected - {Boolean} the new state of the row
     */
    selectRow: function(row, selected) {
        var tr = (row >= 0 && row < this.gridTableBody.rows.length - 1) ? this.gridTableBody.rows[row+1] : null;
        if (tr) {
            if (selected) {
                tr.addClass('jxGridRowSelected');
            } else {
                tr.removeClass('jxGridRowSelected');
            }
            this.selectRowHeader(row, selected);
        }
    },
    
    /** 
     * method: selectColumnHeader
     * Apply the jxGridColumnHeaderSelected style to the column header cell of a
     * selected column.
     *
     * Parameters:
     * col - {Integer} the column header to select
     * selected - {Boolean} the new state of the column header
     */
    selectColumnHeader: function(col, selected) {
        if (this.colTableBody.rows.length == 0) {
            return;
        }
        var cell = (col >= 0 && col < this.colTableBody.rows[0].cells.length-1) ? this.colTableBody.rows[0].cells[col+1] : null;
        if (cell == null) { 
            return; 
        }
        
        if (selected) {
            cell.addClass('jxGridColumnHeaderSelected');
        } else {
            cell.removeClass('jxGridColumnHeaderSelected');
        }
    },
    
    /** 
     * Method: selectColumn
     * Select a column.
     * This deselects a previously selected column.
     *
     * Parameters:
     * col - {Integer} the column to select
     * selected - {Boolean} the new state of the column
     */
    selectColumn: function(col, selected) {
        /* todo: implement column selection */
        if (col >= 0 && col < this.gridTable.rows[0].cells.length) {
            if (selected) {
                for (var i=0; i<this.gridTable.rows.length; i++) {
                    this.gridTable.rows[i].cells[col + 1].addClass('jxGridColumnSelected');
                }
            } else {
                for (var i=0; i<this.gridTable.rows.length; i++) {
                    this.gridTable.rows[i].cells[col + 1].removeClass('jxGridColumnSelected');
                }   
            }
            this.selectColumnHeader(col, selected);
        }
    },
    
    /**
     * Method: onMouseMoveGrid
     * handle the mouse moving over the main grid.  This pre-lights the cell,
     * and subsquently the row and column (and headers).
     *
     * Parameters:
     * e - {Event} the browser event object
     */
    onMouseMoveGrid: function(e) {
        var rc = this.getRowColumnFromEvent(e);
        if (this.options.cellPrelight) {
            this.prelightCell(rc.row, rc.column);            
        }
        if (this.options.rowPrelight) {
            this.prelightRow(rc.row);            
        }
        if (this.options.rowHeaderPrelight) {
            this.prelightRowHeader(rc.row);            
        }
        if (this.options.columnPrelight) {
            this.prelightColumn(rc.column);
        }        
        if (this.options.columnHeaderPrelight) {
            this.prelightColumnHeader(rc.column);
        }        
    },
    
    /**
     * Method: onMouseMoveRowHeader
     * handle the mouse moving over the row header cells.  This pre-lights
     * the row and subsequently the row header.
     *
     * Parameters:
     * e - {Event} the browser event object
     */
    onMouseMoveRowHeader: function(e) {
        if (this.options.rowPrelight) {
            var rc = this.getRowColumnFromEvent(e);
            this.prelightRow(rc.row);            
        }
    },

    /**
     * Method: onMouseMoveColumnHeader
     * handle the mouse moving over the column header cells.  This pre-lights
     * the column and subsequently the column header.
     *
     * Parameters:
     * e - {Event} the browser event object
     */
    onMouseMoveColumnHeader: function(e) {
        if (this.options.columnPrelight) {
            var rc = this.getRowColumnFromEvent(e);
            this.prelightColumn(rc.column);
        }
    },
    
    /**
     * Method: onClickGrid
     * handle the user clicking on the grid.  This triggers an
     * event to the model (if a cellSelected function is provided).
     *
     * The following is an example of a function in the model that selects
     * a row when the cellSelected function is called and deselects any rows
     * that are currently selected.
     *
     * (code)
     * cellSelected: function(grid, row,col) { 
     *    if (this.selectedRow != null) {
     *        grid.selectRow(this.selectedRow, false);
     *    }
     *    this.selectedRow = row;
     *    grid.selectRow(row, true);
     * }
     *
     * Parameters:
     * e - {Event} the browser event object
     */
    onClickGrid: function(e) {
        var rc = this.getRowColumnFromEvent(e);
        
        if (this.options.cellSelection && this.model.cellSelected) {
            this.model.cellSelected(this, rc.row, rc.column);
        }
        if (this.options.rowSelection && this.model.rowSelected) {
            this.model.rowSelected(this, rc.row);
        }
        if (this.options.columnSelection && this.model.columnSelected) {
            this.model.columnSelected(this, rc.column);
        }
        
    },
    
    /**
     * Method: onClickRowHeader
     * handle the user clicking on the row header.  This triggers an
     * event to the model (if a rowSelected function is provided) which
     * can then select the row if desired.  
     *
     * The following is an example of a function in the model that selects
     * a row when the rowSelected function is called and deselects any rows
     * that are currently selected.  More complex code could be written to 
     * allow the user to select multiple rows.
     *
     * (code)
     * rowSelected: function(grid, row) {
     *    if (this.selectedRow != null) {
     *        grid.selectRow(this.selectedRow, false);
     *    }
     *    this.selectedRow = row;
     *    grid.selectRow(row, true);
     * }
     * (end)
     *
     * Parameters:
     * e - {Event} the browser event object
     */
    onClickRowHeader: function(e) {
        var rc = this.getRowColumnFromEvent(e);
        
        if (this.options.rowSelection && this.model.rowSelected) {
            this.model.rowSelected(this, rc.row);
        }
    },
    
    /**
     * Method: onClickColumnHeader
     * handle the user clicking on the column header.  This triggers column
     * selection and column (and header) styling changes and an
     * event to the model (if a columnSelected function is provided)
     *
     * The following is an example of a function in the model that selects
     * a column when the columnSelected function is called and deselects any 
     * columns that are currently selected.  More complex code could be written
     * to allow the user to select multiple columns.
     *
     * (code)
     * colSelected: function(grid, col) {
     *    if (this.selectedColumn != null) {
     *        grid.selectColumn(this.selectedColumn, false);
     *    }
     *    this.selectedColumn = col;
     *    grid.selectColumn(col, true);
     * }
     * (end)
     *
     * Parameters:
     * e - {Event} the browser event object
     */
    onClickColumnHeader: function(e) {
        var rc = this.getRowColumnFromEvent(e);
        
        if (this.options.columnSelection && this.model.columnSelected) {
            this.model.columnSelected(this, rc.column);
        }
    },
    
    /**
     * method: getRowColumnFromEvent
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
    getRowColumnFromEvent: function(e) {
        var td = e.target;
        if (td.tagName != 'TD' && td.tagName != 'TH') {
            return {row:-1,column:-1};
        }
        var tr = td.parentNode;
        var col = td.cellIndex - 1; /* because of hidden spacer column */
        var row = tr.rowIndex - 1; /* because of hidden spacer row */
        
        if (col == -1) { 
            /* bug in safari returns 0 for cellIndex - only choice seems
             * to be to loop through the row
             */
            for (var i=0; i<tr.childNodes.length; i++) {
                if (tr.childNodes[i] == td) {
                    col = i - 1;
                    break;
                }
            }
        }
        return {row:row,column:col};
    }
});