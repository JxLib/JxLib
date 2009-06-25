
Jx.Plugin.Sorter = new Class({

    Extends : Jx.Plugin,

    options : {

    },

    current : null,
    direction : null,
    currentGridIndex : null,

    init : function (grid) {
        if (!$defined(grid) && !(grid instanceof Jx.Grid)) {
            return;
        }

        this.grid = grid;

        this.grid.addEvent('gridClick', this.sort.bind(this));
        this.boundAddHeader = this.addHeaderClass.bind(this);
    },

    sort : function (rc) {
        if ($defined(rc) && rc.column !== -1 && rc.row !== -1) {
            //check to find the header
            if (rc.row === 0) {
                if (this.grid.row.useHeaders()) {
                    rc.column--;
                }
                var column = this.grid.columns.getByGridIndex(rc.column);
                if (column.isSortable()) {
                    if (column === this.current) {
                        //reverse sort order
                        this.direction = (this.direction === 'asc') ? 'desc' : 'asc';
                    } else {
                        this.current = column;
                        this.direction = 'asc';
                        this.currentGridIndex = rc.column;
                    }
    
                    //The grid should be listening for the sortFinished event and will re-render the grid
                    //we will listen for the grid's doneCreateGrid event to add the header
                    this.grid.addEvent('doneCreateGrid', this.boundAddHeader);
                    //sort the store
                    var model = this.grid.getModel();
                    model.sort(this.current.name, null, this.direction);
                }
        
            }
        }
    },

    addHeaderClass : function () {
        this.grid.removeEvent('doneCreateGrid', this.boundAddHeader);
        
        //get header TD
        var th = this.grid.colTable.rows[0].cells[this.currentGridIndex];
        th.addClass('jxGridColumnSorted' + this.direction.capitalize());
    }
});
