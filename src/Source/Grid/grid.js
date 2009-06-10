// $Id$
/**
 * Class: Jx.Grid
 * 
 * Extends: <Jx.Widget>
 *
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
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Grid = new Class({

    Family: 'Jx.Grid',
    Extends: Jx.Widget,

    options: {
        /* Option: parent
         * the HTML element to create the grid inside. The grid will resize
         * to fill the domObj.
         */
        parent: null,
        
        /* Options: columns
         * an object consisting of a columns array that defines the individuals
         * columns as well as containing any options for Jx.Grid.Columns or 
         * a Jx.Grid.Columns object itself.
         */
        columns: {
            columns: []
        },
        
        /* Option: row
         * Either a Jx.Grid.Row object or a json object defining options for
         * the class
         */
        row: null,
        
        /* Option: plugins
         * an array containing Jx.Grid.Plugin subclasses or a key:value pair 
         * that indicates the name of a predefined plugin and it's options.
         */
        plugins: [],
        
        model: null

    },
    
    model: null,
    columns: null,
    row: null,
    plugins: new Hash(),
    currentCell: null,
    
    initialize: function(options){
        this.parent(options);
        
        if ($defined(this.options.model) && this.options.model instanceof Jx.Store) {
            this.model = this.options.model;
        }
        
        if ($defined(this.options.columns)){
            if (this.options.columns instanceof Jx.Columns){
                this.columns = this.options.columns;
            } else if ($type(this.options.columns) === 'object') {
                this.columns = new Jx.Columns(this.options.columns, this);
            }
        }
        
        //check for row
        if ($defined(this.options.row)) {
            if (this.options.row instanceof Jx.Row) {
                this.row = this.options.row;
            } else if ($type(this.options.row) === "object"){
                this.row = new Jx.Row(this.options.row,this);
            }
        } else {
            this.row = new Jx.Row({},this);
        }
        
        //initialize the grid
        this.domObj = new Element('div');
        new Jx.Layout(this.domObj, {
            onSizeChange: this.resize.bind(this)
        });
        
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }        
        
        //top left corner
        this.rowColObj = new Element('div', {'class':'jxGridContainer'});
        
        //holds the column headers
        this.colObj = new Element('div', {'class':'jxGridContainer'});
        this.colTable = new Element('table', {'class':'jxGridTable'});
        //this.colTableHead = new Element('thead');
        //this.colTable.appendChild(this.colTableHead);
        this.colTableBody = new Element('tbody');
        this.colTable.appendChild(this.colTableBody);
        this.colObj.appendChild(this.colTable);
    
        //hold the row headers
        this.rowObj = new Element('div', {'class':'jxGridContainer'});
        this.rowTable = new Element('table', {'class':'jxGridTable'});
        this.rowTableHead = new Element('thead');
        this.rowTable.appendChild(this.rowTableHead);
        this.rowObj.appendChild(this.rowTable);
    
        //The actual body of the grid
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
        this.gridObj.addEvent('click', this.onGridClick.bindWithEvent(this));
        this.rowObj.addEvent('click', this.onGridClick.bindWithEvent(this));
        this.colObj.addEvent('click', this.onGridClick.bindWithEvent(this));
        this.gridObj.addEvent('mousemove', this.onMouseMove.bindWithEvent(this));
        this.rowObj.addEvent('mousemove', this.onMouseMove.bindWithEvent(this));
        this.colObj.addEvent('mousemove', this.onMouseMove.bindWithEvent(this));
        
        //initialize the plugins
        if ($defined(this.options.plugins) && $type(this.options.plugins)==='Array'){
            this.options.plugins.each(function(plugin){
                if (plugin instanceof Jx.Plugin) {
                    plugin.init(this);
                    this.plugins.set(plugin.name,plugin);
                } else if ($type(plugin) === 'object') {
                   var p = new Jx.Plugin[plugin.name](plugin.options);
                   p.init(this);
                   this.plugins.set(p.name,p);
                }
            },this);
        }
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
     * Method: onMouseMove
     * Handle the mouse moving over the grid. This determines
     * what column and row it's over and fires the gridMove event 
     * with that information for plugins to respond to.
     *
     * Parameters:
     * e - {Event} the browser event object
     */
    onMouseMove: function(e) {
        var rc = this.getRowColumnFromEvent(e);
        if (!$defined(this.currentCell) || (this.currentCell.row !== rc.row || this.currentCell.column !== rc.column)){
            this.currentCell = rc;
            this.fireEvent('gridMove',rc);
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
    onGridClick: function(e) {
        var rc = this.getRowColumnFromEvent(e);
        this.fireEvent('gridClick',rc);
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
    getRowColumnFromEvent: function(e) {
        var td = e.target;
        if (td.tagName != 'TD' && td.tagName != 'TH') {
            return {row:-1,column:-1};
        }
        
        var colheader = false;
        var rowheader = false;
        //check if this is a header (row or column)
        if (td.descendantOf(this.colTable)){
            colheader = true;
        }
        
        if (td.descendantOf(this.rowTable)){
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
        if (this.row.useHeaders() && !rowheader){
            col++;
        }
        if (this.columns.useHeaders() && !colheader){
            row++;
        }
        
        if (Browser.Engine.webkit) { 
            /* bug in safari (webkit) returns 0 for cellIndex - only choice seems
             * to be to loop through the row
             */
            for (var i=0; i<tr.childNodes.length; i++) {
                if (tr.childNodes[i] == td) {
                    col = i;
                    break;
                }
            }
        }
        return {row:row,column:col};
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
        var colHeight = this.columns.useHeaders() ? this.columns.getHeaderHeight() : 1;
        var rowWidth = this.row.useHeaders() ? this.row.getRowHeaderWidth() : 1;
        
        var size = this.domObj.getContentBoxSize();
        
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
     * it is removed and the new model is displayed. However, It needs to have 
     * the same columns
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
    
    getModel: function(){
        return this.model;
    },
    
    /**
     * Method: destroyGrid
     * destroy the contents of the grid safely
     */
    destroyGrid: function() {
        
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
     * Method: render
     * Create the grid for the current model
     */
    render: function() {
        this.destroyGrid();
        
        this.fireEvent('beginCreateGrid',this);
        
        if (this.model) {
            var model = this.model;
            var nColumns = this.columns.getColumnCount();
            var nRows = model.count();
            
            /* create header if necessary */
            if (this.columns.useHeaders()) {
                this.colTableBody.setStyle('visibility','visible');
                var colHeight = this.columns.getHeaderHeight();
                var trBody = new Element('tr',{styles:{height:colHeight}});
                this.colTableBody.appendChild(trBody);
                
                this.columns.getHeaders(trBody);
                
                /* one extra column at the end for filler */
                var th = new Element('th',{styles:{width:1000,height:colHeight - 1}});
                th.addClass('jxGridColHead');
                trBody.appendChild(th);
                
            } else {
                //hide the headers
                this.colTableBody.setStyle('visibility','hidden');
            }
            
            if (this.row.useHeaders()) {
                this.rowTableHead.setStyle('visibility','visible');
                
                //loop through all rows and add header
                this.model.first();
                while (this.model.valid()){
                    tr = this.row.getRowHeader();
                    this.rowTableHead.appendChild(tr);
                    if (this.model.hasNext()) { 
                        this.model.next();
                    } else {
                        break;
                    }
                }
                /* one extra row at the end for filler */
                var tr = new Element('tr');
                var th = new Element('th',{
                    'class':'jxGridRowHead',
                    styles:{
                        width:this.row.getRowHeaderWidth(),
                        height:1000
                    }
                });
                tr.appendChild(th);
                this.rowTableHead.appendChild(tr);   
            } else {
                //hide row headers
                this.rowTableHead.setStyle('visibility','hidden');
            }
            
            var colHeight = this.columns.getHeaderHeight();
           
            //This section actually adds the rows
            this.model.first();
            while (this.model.valid()) {
                tr = this.row.getGridRowElement();
                this.gridTableBody.appendChild(tr);
                
                //Actually add the columns 
                this.columns.getColumnCells(tr);
                
                if (this.model.hasNext()){
                    this.model.next();
                } else {
                    break;
                }
               
            }
            
        }
        this.domObj.resize();
        this.fireEvent('doneCreateGrid',this);
    }
    
});