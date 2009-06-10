


Jx.Columns = new Class({
    
    Extends: Jx.Object,
    
    options: {
        /* Option: headerRowHeight
         * the default height of the header row. Set to null or 'auto' to
         * have this class attempt to figure out a suitable height.
         */
        headerRowHeight: 20,
        /* Option: useHeaders
         * Determines if the column headers should be displayed or not
         */
        useHeaders: false,
        
        columns: []
    },
    
    columns: [],
    
    initialize: function(options,grid){
        this.parent(options);
        
        if ($defined(grid) && grid instanceof Jx.Grid) {
            this.grid = grid;
        }
        
        this.options.columns.each(function(col){
            //check the column to see if it's a Jx.Grid.Column or an object
            if (col instanceof Jx.Column) {
                this.columns.push(col);
            } else if ($type(col) === "object") {
                this.columns.push(new Jx.Column(col, grid));
            }
            
        },this);
    },
    
    getHeaderHeight: function(recalculate){
        if (!$defined(this.height) || recalculate) {
            if ($defined(this.options.headerRowHeight) && this.options.headerRowHeight !== 'auto') {
                this.height = this.options.headerRowHeight;
            } else {
                //figure out a height.
            }
        }
        return this.height;
    },
    
    useHeaders: function(){
        return this.options.useHeaders;
    },
    
    getByName: function(colName){
        this.columns.each(function(col){
            if (col.name === colName) {
                return col;
            }
        },this);
    },
    
    getByField: function(field){
        var ret;
        this.columns.each(function(col){
            if (col.options.modelField == field) {
                ret = col;
            }
        },this);
        return ret;
    },
    
    getHeaders: function(row){
        r = this.grid.row.useHeaders();
        hf = this.grid.row.getRowHeaderField();
        this.columns.each(function(col){
            if ( r && hf == col.options.modelField) {
                //do nothing
            } else if (!col.isHidden()) {
                th = new Element('th', {
                    'class':'jxGridColHead', 
                    html: col.getHeaderHTML()
                });
                th.setStyle('width',col.getWidth());
                row.appendChild(th);
            }
        },this);
        return row;
    },
    
    getColumnCells: function(row){
        r = this.grid.row;
        f = r.getRowHeaderField();
        h = r.useHeaders();
        this.columns.each(function(col){
            if (h && col.options.modelField !== f && !col.isHidden()) {
                this.getColumnCell(col,row);
            } else if (!h && !col.isHidden()) {
                this.getColumnCell(col,row);
            }
        },this);
        return row;
    },
    
    getColumnCell: function(col,row){
       
        td = new Element('td', {'class':'jxGridCell'});
        td.innerHTML = col.getHTML();
        row.appendChild(td); 
        if (this.grid.model.getPosition() == 0){
            var colWidth = col.getWidth();
            td.setStyle('width',colWidth);
        }
    },
    
    getColumnCount: function(){
        return this.columns.length;
    }

});