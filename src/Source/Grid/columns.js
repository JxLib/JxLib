/**
 * Class: Jx.Columns
 * 
 * 
 * copyright 2009 by Jonathan Bomgardner
 * MIT style license
 */
Jx.Columns = new Class({

    Extends : Jx.Object,

    options : {
        /* Option: headerRowHeight
         * the default height of the header row. Set to null or 'auto' to
         * have this class attempt to figure out a suitable height.
         */
        headerRowHeight : 20,
        /* Option: useHeaders
         * Determines if the column headers should be displayed or not
         */
        useHeaders : false,

        columns : []
    },

    columns : [],

    initialize : function (options, grid) {
        this.parent(options);

        if ($defined(grid) && grid instanceof Jx.Grid) {
            this.grid = grid;
        }

        this.options.columns.each(function (col) {
            //check the column to see if it's a Jx.Grid.Column or an object
                if (col instanceof Jx.Column) {
                    this.columns.push(col);
                } else if ($type(col) === "object") {
                    this.columns.push(new Jx.Column(col, grid));
                }

            }, this);
    },

    getHeaderHeight : function (recalculate) {
        if (!$defined(this.height) || recalculate) {
            if ($defined(this.options.headerRowHeight)
                    && this.options.headerRowHeight !== 'auto') {
                this.height = this.options.headerRowHeight;
            } else {
                //figure out a height.
            }
        }
        return this.height;
    },

    useHeaders : function () {
        return this.options.useHeaders;
    },

    getByName : function (colName) {
        var ret;
        this.columns.each(function (col) {
            if (col.name === colName) {
                ret = col;
            }
        }, this);
        return ret;
    },

    getByField : function (field) {
        var ret;
        this.columns.each(function (col) {
            if (col.options.modelField === field) {
                ret = col;
            }
        }, this);
        return ret;
    },

    getByGridIndex : function (index) {
        var headers = this.grid.colTableBody.getFirst().getChildren();
        var cell = headers[index];
        var hClasses = cell.get('class').split(' ').filter(function (cls) {
            return cls.test('jxColHead-');
        });
        var parts = hClasses[0].split('-');
        return this.getByName(parts[1]);
    },

    getHeaders : function (row) {
        var r = this.grid.row.useHeaders();
        var hf = this.grid.row.getRowHeaderField();
        this.columns.each(function (col) {
            if (r && hf === col.options.modelField) {
                //do nothing
            } else if (!col.isHidden()) {
                var th = new Element('th', {
                    'class' : 'jxGridColHead'
                });
                th.adopt(col.getHeaderHTML());
                th.setStyle('width', col.getWidth());
                th.addClass('jxColHead-' + col.options.modelField);
                //add other styles for different attributes
                if (col.isEditable()) {
                    th.addClass('jxColEditable');
                }
                if (col.isResizable()) {
                    th.addClass('jxColResizable');
                }
                if (col.isSortable()) {
                    th.addClass('jxColSortable');
                }
                row.appendChild(th);
            }
        }, this);
        return row;
    },

    getColumnCells : function (row) {
        var r = this.grid.row;
        var f = r.getRowHeaderField();
        var h = r.useHeaders();
        this.columns.each(function (col) {
            if (h && col.options.modelField !== f && !col.isHidden()) {
                row.appendChild(this.getColumnCell(col));
            } else if (!h && !col.isHidden()) {
                row.appendChild(this.getColumnCell(col));
            }
        }, this);
        return row;
    },

    getColumnCell : function (col) {

        var td = new Element('td', {
            'class' : 'jxGridCell'
        });
        td.adopt(col.getHTML());
        td.addClass('jxCol-' + col.options.modelField);
        if (this.grid.model.getPosition() === 0) {
            var colWidth = col.getWidth();
            td.setStyle('width', colWidth);
        }

        return td;
    },

    getColumnCount : function () {
        return this.columns.length;
    },

    getIndexFromGrid : function (name) {
        var headers = this.grid.colTableBody.getFirst().getChildren();
        var c;
        var i = -1;
        headers.each(function (h) {
            i++;
            var hClasses = h.get('class').split(' ').filter(function (cls) {
                return cls.test('jxGridColHead-');
            });
            hClasses.each(function (cls) {
                if (cls.test(name)) {
                    c = i;
                }
            });
        }, this);
        return c;
    }

});
