/**
 * Class: Jx.Grid.Row
 * A class defining a grid row.
 * 
 * Inspired by code in the original Jx.Grid class
 * MIT Style License
 */
Jx.Row = new Class({
    
    Extends: Jx.Object,
    
    options: {
        /* Option: useHeaders
         * defaults to false.  If set to true, then a column of row header
         * cells are displayed.
         */
        useHeaders: false,
        /* Option: alternateRowColors
         * defaults to false.  If set to true, then alternating CSS classes
         * are used for rows.
         */
        alternateRowColors: false,
        
        /* Option: rowClasses
         * object containing class names to apply to rows
         */
        rowClasses: {
            odd: 'jxGridRowOdd',
            even: 'jxGridRowEven',
            all: 'jxGridRowAll'
        },
        
        /* Option: rowHeight
         * The height of the row. Make it null or 'auto' to auto-calculate
         */
        rowHeight: 20,
        
        /* Option: headerWidth
         * The width of the row header. Make it null or 'auto' to auto-calculate
         */
        headerWidth: 20,
        
        /* Option: headerField
         * The field in the model to use as the header
         */
        headerField: 'id'
    },
    
    grid: null,
    
    /**
     * Constructor: Jx.Row
     * Creates the row object.
     */
    initialize: function(options,grid){
        this.parent(options);
        
        if ($defined(grid) && grid instanceof Jx.Grid){
            this.grid = grid;
        }
    },
    
    /**
     * APIMethod: getGridRowElement
     * Used to create the TR for the main grid row
     */
    getGridRowElement: function(){
        
        var tr = new Element('tr');
        tr.setStyle('height',this.getHeight());
        if (this.options.alternateRowColors) {
            tr.className = (this.grid.getModel().getPosition()%2) ? this.options.rowClasses.even : this.options.rowClasses.odd;
        } else {
            tr.className = this.options.rowClasses.all;
        }
        return tr;
    },
    
    /**
     * Method: getRowHeaderCell
     * creates the TH for the row's header
     */
    getRowHeaderCell: function(){
        //create element
        var th = new Element('th');  
        //get and set text for element
        var model = this.grid.getModel();
        return new Element('th', {'class':'jxGridRowHead', html:model.get(this.options.headerField)});
    },
    
    /**
     * APIMethod: getRowHeaderWidth
     * determines the row header's width.
     */
    getRowHeaderWidth: function(){
        //this can be drawn from the column for the
        //header field
        var col = this.grid.columns.getByField(this.options.headerField);
        return col.getWidth();
    },
    
    /**
     * APIMethod: getHeight
     * determines and returns the height of a row
     */
    getHeight: function(){
        //this should eventually compute a height, however, we would need
        //a fixed width to do so reliably. For right now, we use a fixed height
        //for all rows.
        return this.options.rowHeight; 
    },
    
    /**
     * APIMethod: useHeaders
     * determines and returns whether row headers should be used
     */
    useHeaders: function(){
           return this.options.useHeaders;
    },
    
    /**
     * APIMethod: getRowHeader
     * creates and returns the header for the current row
     */
    getRowHeader: function(){
        var rowHeight = this.getHeight();
        var tr = new Element('tr',{styles: {height:rowHeight}});
        var th = this.getRowHeaderCell();
        if (this.grid.model.getPosition() == 0) {
            var rowWidth = this.getRowHeaderWidth();
            th.setStyle("width",rowWidth);
        }
        tr.appendChild(th);
        return tr;
    },
    
    /**
     * APIMethod: getRowHeaderField
     * returns the name of the model field that is used for the header
     */
    getRowHeaderField: function(){
        return this.options.headerField;
    }
});