/**
 * Class: Jx.Grid.Row
 * A class defining a grid row.
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
        
        rowClasses: {
            odd: 'jxGridRowOdd',
            even: 'jxGridRowEven',
            all: 'jxGridRowAll'
        },
        
        rowHeight: 20,
        
        headerWidth: 20,
        
        headerField: 'id'
    },
    
    grid: null,
    
    initialize: function(options,grid){
        this.parent(options);
        
        if ($defined(grid) && grid instanceof Jx.Grid){
            this.grid = grid;
        }
    },
    
    getGridRowElement: function(){
        
        var tr = new Element('tr');
        tr.setStyle('height',this.getHeight());
        /* if we apply the class before adding content, it
         * causes a rendering error in IE (off by 1) that is 'fixed'
         * when another class is applied to the row, causing dynamic
         * shifting of the row heights
         */
        if (this.options.alternateRowColors) {
            tr.className = (this.grid.getModel().getPosition()%2) ? this.options.rowClasses.odd : this.options.rowClasses.even;
        } else {
            tr.className = this.options.rowClasses.all;
        }
        return tr;
    },
    
    getRowHeaderCell: function(){
        //create element
        var th = new Element('th');  
        //get and set text for element
        var model = this.grid.getModel();
        return new Element('th', {'class':'jxGridRowHead', html:model.get(this.options.headerField)});
    },
    
    getRowHeaderWidth: function(){
        //this can be drawn from the column for the
        //header field
        var col = this.grid.columns.getByField(this.options.headerField);
        return col.getWidth();
    },
    
    getHeight: function(){
        //this should eventually compute a height, however, we would need
        //a fixed width to do so reliably. For right now, we use a fixed height
        //for all rows.
        return this.options.rowHeight; 
    },
    
    useHeaders: function(){
           return this.options.useHeaders;
    },
    
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
    
    getRowHeaderField: function(){
        return this.options.headerField;
    }
});