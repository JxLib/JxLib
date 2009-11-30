// $Id$
/**
 * Class: Jx.Row
 *
 * Extends: <Jx.Object>
 *
 * A class defining a grid row.
 *
 * Inspired by code in the original Jx.Grid class
 *
 * License:
 * Original Copyright (c) 2008, DM Solutions Group Inc.
 * This version Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Row = new Class({

    Extends : Jx.Object,

    options : {
        /**
         * Option: useHeaders
         * defaults to false.  If set to true, then a column of row header
         * cells are displayed.
         */
        useHeaders : false,
        /**
         * Option: alternateRowColors
         * defaults to false.  If set to true, then alternating CSS classes
         * are used for rows.
         */
        alternateRowColors : false,
        /**
         * Option: rowClasses
         * object containing class names to apply to rows
         */
        rowClasses : {
            odd : 'jxGridRowOdd',
            even : 'jxGridRowEven',
            all : 'jxGridRowAll'
        },
        /**
         * Option: rowHeight
         * The height of the row. Make it null or 'auto' to auto-calculate
         */
        rowHeight : 20,
        /**
         * Option: headerWidth
         * The width of the row header. Make it null or 'auto' to auto-calculate
         */
        headerWidth : 20,
        /**
         * Option: headerField
         * The field in the model to use as the header
         */
        headerField : 'id',
        /**
         * Option: templates
         * objects used to determine the type of tag and css class to
         * assign to a header cell. The css class can
         * also be a function that returns a string to assign as the css
         * class. The function will be passed the text to be formatted.
         */
        templates: {
            header: {
                tag: 'span',
                cssClass: null
            }
        }

    },
    /**
     * Property: grid
     * A reference to the grid that this row model belongs to
     */
    grid : null,

    parameters: ['options','grid'],

    /**
     * APIMethod: init
     * Creates the row model object.
     */
    init : function () {
        this.parent();

        if ($defined(this.options.grid) && this.options.grid instanceof Jx.Grid) {
            this.grid = this.options.grid;
        }
    },
    /**
     * APIMethod: getGridRowElement
     * Used to create the TR for the main grid row
     */
    getGridRowElement : function () {

        var tr = new Element('tr');
        tr.setStyle('height', this.getHeight());
        if (this.options.alternateRowColors) {
            tr.className = (this.grid.getModel().getPosition() % 2) ? this.options.rowClasses.even
                    : this.options.rowClasses.odd;
        } else {
            tr.className = this.options.rowClasses.all;
        }
        return tr;
    },
    /**
     * Method: getRowHeaderCell
     * creates the TH for the row's header
     */
    getRowHeaderCell : function () {
        //get and set text for element
        var model = this.grid.getModel();
        var th = new Element('td', {
            'class' : 'jxGridRowHead'
        });

        var text = model.get(this.options.headerField);
        var ht = this.options.templates.header;
        var el = new Element(ht.tag, {
            'class' : 'jxGridCellContent',
            'html' : text
        }).inject(th);
        if ($defined(ht.cssClass)) {
            if (Jx.type(ht.cssClass) === 'function') {
                el.addClass(ht.cssClass.run(text));
            } else {
                el.addClass(ht.cssClass);
            }
        }

        return th;

    },
    /**
     * APIMethod: getRowHeaderWidth
     * determines the row header's width.
     */
    getRowHeaderWidth : function () {
        //this can be drawn from the column for the
        //header field
        var col = this.grid.columns.getByField(this.options.headerField);
        return col.getWidth(true, true);
    },

    /**
     * APIMethod: getHeight
     * determines and returns the height of a row
     */
    getHeight : function () {
        //this should eventually compute a height, however, we would need
        //a fixed width to do so reliably. For right now, we use a fixed height
        //for all rows.
        return this.options.rowHeight;
    },
    /**
     * APIMethod: useHeaders
     * determines and returns whether row headers should be used
     */
    useHeaders : function () {
        return this.options.useHeaders;
    },
    /**
     * APIMethod: getRowHeader
     * creates and returns the header for the current row
     *
     * Parameters:
     * list - Jx.List instance to add the header to
     */
    getRowHeader : function (list) {
        var th = this.getRowHeaderCell();
        if (this.grid.model.getPosition() === 0) {
            var rowWidth = this.getRowHeaderWidth();
            th.setStyle("width", rowWidth);
        }
        th.store('jxCellData', {
            rowHeader: true,
            row: this.grid.model.getPosition()
        });
        list.add(th);
    },
    /**
     * APIMethod: getRowHeaderField
     * returns the name of the model field that is used for the header
     */
    getRowHeaderField : function () {
        return this.options.headerField;
    }
});
