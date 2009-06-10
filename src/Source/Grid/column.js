/**
 * Class: Jx.Grid.Column
 * The class for defining columns for grids.
 *
 */
Jx.Column = new Class({
    
    Extends: Jx.Object,
    
    options: {
        header: null,
        modelField: null,
        width: null,
        isEditable: false,
        isSortable: false,
        isResizable: false,
        isHidden: false,
        cssClass: '',
        formatter: null,
        name: '',
        dataType: 'alphanumeric',
        
        templates: {
            header: '{text}',
            cell: '{text}'
        }
            
    },
    
    model: null,
    
    initialize: function(options, grid){
        this.parent(options);
        if ($defined(grid) && grid instanceof Jx.Grid){
            this.grid = grid;
        }
        this.name = this.options.name;
    },
    
    getHeaderHTML: function(){
        var text = this.options.header ? this.options.header : this.options.modelField;
        var obj = {"text": text};
        return this.options.templates.header.substitute(obj);
    },
    
    getWidth: function(recalculate){
        //check for null width or for "auto" setting and measure all contents in this column
        //in the entire model as well as the header (really only way to do it).
        if (!$defined(this.width) || recalculate) {
            if (this.options.width !== null && this.options.width !== 'auto') {
                this.width = Jx.getNumber(this.options.width);
            } else {
                //calculate the width
                var model = this.grid.getModel();
                var oldPos = model.getPosition();
                var maxWidth = 0;
                model.first();
                while (model.valid()){
                    //check size by placing text into a TD and measuring it.
                    //TODO: this should add .jxGridRowHead/.jxGridColHead if 
                    //      this is a header to get the correct measurement.
                    var text = model.get(this.name);
                    var klass = 'jxGridCell';
                    if (this.grid.row.useHeaders() && this.options.modelField == this.grid.row.getRowHeaderField()){
                        klass = 'jxGridRowHead';
                    }
                    s = this.measure(text,klass);
                    if (s.width > maxWidth) {
                        maxWidth = s.width;
                    }
                    if (model.hasNext()){
                        model.next();
                    } else {
                        break;
                    }
                }
                
                //check the column header as well (unless this is the row header)
                if (!(this.grid.row.useHeaders() && this.options.modelField == this.grid.row.getRowHeaderField())){
                    s = this.measure(this.options.header,'jxGridColHead');
                    if (s.width > maxWidth) {
                        maxWidth = s.width;
                    }
                }
                this.width = maxWidth;
                model.moveTo(oldPos);
            }
        }
        return this.width;
    },
    
    measure: function(text,klass){
        var d = new Element('span',{
            'class': klass,
            'html': text
        });
        d.setStyle('height',this.grid.row.getHeight());
        d.setStyles({'visibility':'hidden','width':'auto','font-family':'Arial'});
        d.inject(document.body,'bottom');
        var s = d.measure(function(){
            return this.getMarginBoxSize();
        });
        d.destroy();
        return s;
    },
    isEditable: function(){
        return this.options.isEditable;
    },
    
    isSortable: function(){
        return this.options.isSortable;
    },
    
    isResizable: function(){
        return this.options.isResizable;
    },
    
    isHidden: function(){
        return this.options.isHidden;
    },
    
    getHTML: function(){
        var obj ={"text": this.grid.getModel().get(this.options.modelField)};
        return this.options.templates.cell.substitute(obj);
    }
    
});