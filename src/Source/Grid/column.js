// $Id: $
/**
 * Class: Jx.Column
 * 
 * Extends: <Jx.Object>
 * 
 * The class used for defining columns for grids.
 *
 * Example:
 * (code)
 * (end)
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Column = new Class({

    Extends: Jx.Object,

    options: {
        /**
         * Option: header
         * The text to be used as a header for this column
         */
        header: null,
        /**
         * Option: modelField
         * The field of the model that this column is keyed to
         */
        modelField: null,
        /**
         * Option: width
         * Determines the width of the column. Set to 'null' or 'auto'
         * to allow the column to autocalculate it's width based on its
         * contents
         */
        width: null,
        /**
         * Option: isEditable
         * allows/disallows editing of the column contents
         */
        isEditable: false,
        /**
         * Option: isSortable
         * allows/disallows sorting based on this column
         */
        isSortable: false,
        /**
         * Option: isResizable
         * allows/disallows resizing this column dynamically
         */
        isResizable: false,
        /**
         * Option: isHidden
         * determines if this column can be shown or not
         */
        isHidden: false,
        /**
         * Option: formatter
         * an instance of <Jx.Formatter> or one of its subclasses which 
         * will be used to format the data in this column. It can also be 
         * an object containing the name (This should be the part after 
         * Jx.Formatter in the class name. For instance, to get a currency 
         * formatter, specify 'Currency' as the name.) and options for the 
         * needed formatter (see individual formatters for options). 
         * (code)
         * {
         *    name: 'formatter name',
         *    options: {}
         * }
         * (end)
         */
        formatter: null,
        /**
         * Option: name
         * The name given to this column
         */
        name: '',
        /**
         * Option: dataType
         * The type of the data in this column, used for sorting. Can be 
         * alphanumeric, numeric, currency, boolean, or date
         */
        dataType: 'alphanumeric',
        /**
         * Option: templates
         * objects used to determine the type of tag and css class to 
         * assign to a header cell and a regular cell. The css class can 
         * also be a function that returns a string to assign as the css 
         * class. The function will be passed the text to be formatted.
         */
        templates: {
            header: {
                tag: 'span',
                cssClass: null
            },
            cell: {
                tag: 'span',
                cssClass: null
            }
        }
    
    },
    /**
     * Property: model
     * holds a reference to the model (an instance of <Jx.Store> or subclass)
     */
    model: null,
    /**
     * Constructor: Jx.Column
     * initializes the column object
     * 
     * Parameters:
     * options - <Jx.Column.Options> and <Jx.Object.Options>
     * grid - a reference to the grid this column is associated with. 
     *          Must be a <Jx.Grid> or subclass. 
     */
    initialize : function (options, grid) {
        this.parent(options);
        if ($defined(grid) && grid instanceof Jx.Grid) {
            this.grid = grid;
        }
        this.name = this.options.name;
        //we need to check the formatter
        if ($defined(this.options.formatter)
                && !(this.options.formatter instanceof Jx.Formatter)) {
            var t = Jx.type(this.options.formatter);
            if (t === 'object') {
                this.options.formatter = new Jx.Formatter[this.options.formatter.name](
                        this.options.formatter.options);
            }
        }
    },
    /**
     * APIMethod: getHeaderHTML
     * Returns the header text wrapped in the tag specified in 
     * options.templates.hedaer.tag
     */
    getHeaderHTML : function () {
        var text = this.options.header ? this.options.header
                : this.options.modelField;
        var ht = this.options.templates.header;
        var el = new Element(ht.tag, {
            //'class' : 'jxGridCellContent',
            'html' : text
        });
        if ($defined(ht.cssClass)) {
            if (Jx.type(ht.cssClass) === 'function') {
                el.addClass(ht.cssClass.run(text));
            } else {
                el.addClass(ht.cssClass);
            }
        }
        return el;
    },
    
    setWidth: function(newWidth) {
        if (this.rule && parseInt(newWidth) >= 0) {
            this.rule.width = parseInt(newWidth) + "px";
        }
    },
    /**
     * APIMethod: getWidth
     * returns the width of the column. 
     * 
     * Parameters:
     * recalculate - {boolean} determines if the width should be recalculated 
     *          if the column is set to autocalculate. Has no effect if the width is 
     *          preset
     */
    getWidth : function (recalculate) {
        //check for null width or for "auto" setting and measure all contents in this column
        //in the entire model as well as the header (really only way to do it).
        if (!$defined(this.width) || recalculate) {
            if (this.options.width !== null
                    && this.options.width !== 'auto') {
                this.width = Jx.getNumber(this.options.width);
            } else {
                //calculate the width
                var model = this.grid.getModel();
                var oldPos = model.getPosition();
                var maxWidth = 0;
                model.first();
                while (model.valid()) {
                    //check size by placing text into a TD and measuring it.
                    //TODO: this should add .jxGridRowHead/.jxGridColHead if 
                    //      this is a header to get the correct measurement.
                    var text = model.get(this.name);
                    var klass = 'jxGridCell';
                    if (this.grid.row.useHeaders()
                            && this.options.modelField === this.grid.row
                            .getRowHeaderField()) {
                        klass = 'jxGridRowHead';
                    }
                    var s = this.measure(text, klass);
                    if (s.width > maxWidth) {
                        maxWidth = s.width;
                    }
                    if (model.hasNext()) {
                        model.next();
                    } else {
                        break;
                    }
                }
    
                //check the column header as well (unless this is the row header)
                if (!(this.grid.row.useHeaders() && this.options.modelField === this.grid.row
                        .getRowHeaderField())) {
                    klass = 'jxGridColHead';
                    if (this.isEditable()) {
                        klass += ' jxColEditable';
                    }
                    if (this.isResizable()) {
                        klass += ' jxColResizable';
                    }
                    if (this.isSortable()) {
                        klass += ' jxColSortable';
                    }
                    s = this.measure(this.options.header, klass);
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
    /**
     * Method: measure
     * This method does the dirty work of actually measuring a cell
     * 
     * Parameters:
     * text - the text to measure
     * klass - a string indicating and extra classes to add so that 
     *          css classes can be taken into account.
     */
    measure : function (text, klass) {
        if ($defined(this.options.formatter)
                && text !== this.options.header) {
            text = this.options.formatter.format(text);
        }
        var d = new Element('span', {
            'class' : klass
        });
        var el = new Element('span', {
            'html' : text
        }).inject(d);
        d.setStyle('height', this.grid.row.getHeight());
        d.setStyles({
            'visibility' : 'hidden',
            'width' : 'auto',
            'font-family' : 'Arial'
        });
        d.inject(document.body, 'bottom');
        var s = d.measure(function () {
            return this.getMarginBoxSize();
        });
        d.destroy();
        return s;
    },
    /**
     * APIMethod: isEditable
     * Returns whether this column can be edited
     */
    isEditable : function () {
        return this.options.isEditable;
    },
    /**
     * APIMethod: isSortable
     * Returns whether this column can be sorted
     */
    isSortable : function () {
        return this.options.isSortable;
    },
    /**
     * APIMethod: isResizable
     * Returns whether this column can be resized
     */
    isResizable : function () {
        return this.options.isResizable;
    },
    /**
     * APIMethod: isHidden
     * Returns whether this column is hidden
     */
    isHidden : function () {
        return this.options.isHidden;
    },
    /**
     * APIMethod: getHTML
     * returns the content of the current model row wrapped in the tag
     * specified by options.templates.cell.tag and with the appropriate classes
     * added
     */
    getHTML : function () {
        var text = this.grid.getModel().get(this.options.modelField);
        var ct = this.options.templates.cell;
        if ($defined(this.options.formatter)) {
            text = this.options.formatter.format(text);
        }
        var el = new Element(ct.tag, {
            'html' : text,
            'class' : 'jxGridCellContent',
            styles: {
                // width: this.getWidth()
            }
        });
        if ($defined(ct.cssClass)) {
            if (Jx.type(ct.cssClass) === 'function') {
                el.addClass(ct.cssClass.run(text));
            } else {
                el.addClass(ct.cssClass);
            }
        }
        return el;
    }

});