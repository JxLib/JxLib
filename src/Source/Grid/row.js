/*
---

name: Jx.Row

description: Holds information related to display of rows in the grid.

license: MIT-style license.

requires:
 - Jx.Object

provides: [Jx.Row]

...
 */
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

	Family: 'Jx.Row',
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
         * The height of the row. Make it null or 'auto' to auto-calculate.
         */
        rowHeight : 20,
        /**
         * Option: headerWidth
         * The width of the row header. Make it null or 'auto' to auto-calculate
         */
        headerWidth : 20,
        /**
         * Option: headerColumn
         * The name of the column in the model to use as the header
         */
        headerColumn : 'id'
    },
    /**
     * Property: grid
     * A reference to the grid that this row model belongs to
     */
    grid : null,
    /**
     * Property: heights
     * This will hold the calculated height of each row in the grid.
     */
    heights: [],
    /**
     * Property: rules
     * A hash that will hold all of the CSS rules for the rows.
     */
    rules: $H(),

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
    getGridRowElement : function (row) {

        var tr = new Element('tr');
        //tr.setStyle('height', this.getHeight());
        if (this.options.alternateRowColors) {
            tr.className = (this.grid.getModel().getPosition() % 2) ? this.options.rowClasses.even
                    : this.options.rowClasses.odd;
        } else {
            tr.className = this.options.rowClasses.all;
        }
        tr.store('jxRowData', {row: row});
        tr.addClass('jxGridRow'+row);
        return tr;
    },
    /**
     * Method: getRowHeaderCell
     * creates the TH for the row's header
     */
    getRowHeaderCell : function () {
        //get and set text for element
        var model = this.grid.getModel();
        var th = new Element('th', {
            'class' : 'jxGridRowHead'
        });
        var col = this.grid.columns.getByName(this.options.headerColumn);
        var el = col.getHTML();
        el.inject(th);
        th.store('jxCellData',{
        	row: model.getPosition(),
        	rowHeader: true
        });
        return th;

    },
    /**
     * APIMethod: getRowHeaderWidth
     * determines the row header's width.
     */
    getRowHeaderWidth : function () {
        //this can be drawn from the column for the
        //header field
    	var col = this.grid.columns.getByName(this.options.headerColumn);
    	if (!$defined(col.getWidth())) {
    		col.calculateWidth(true);
    	}
        return col.getWidth();
    },

    /**
     * APIMethod: getHeight
     * determines and returns the height of a row
     */
    getHeight : function (row) {
        //this should eventually compute a height, however, we would need
        //a fixed width to do so reliably. For right now, we use a fixed height
        //for all rows.
    	if ((!$defined(this.options.rowHeight) || this.options.rowHeight === 'auto') && $defined(this.heights[row])) {
    		return this.heights[row];
    	} else if (Jx.type(this.options.rowHeight === 'number')) {
    		return this.options.rowHeight;
    	}
    },
    calculateHeights : function () {
    	//grab all rows in the grid body
      document.id(this.grid.gridTableBody).getChildren().each(function(row){
        row = document.id(row);
        var data = row.retrieve('jxRowData');
        var s = row.getContentBoxSize();
        this.heights[data.row] = s.height;
      },this);
      document.id(this.grid.rowTableHead).getChildren().each(function(row){
        row = document.id(row);
        var data = row.retrieve('jxRowData');
        if (data) {
          var s = row.getContentBoxSize();
          this.heights[data.row] = Math.max(this.heights[data.row],s.height);
          if (Browser.Engine.webkit) {
              //for some reason webkit (Safari and Chrome)
              this.heights[data.row] -= 1;
          }
        }
      },this);
    	
    },
    
    createRules: function(styleSheet, scope) {
        this.grid.gridTableBody.getChildren().each(function(row, idx) {
            var selector = scope+' .jxGridRow'+idx + ', ' + scope + ' .jxGridRow'+idx+' .jxGridCellContent';
            var rule = Jx.Styles.insertCssRule(selector, '', styleSheet);
            this.rules.set('jxGridRow'+idx, rule);
            rule.style.height = this.heights[idx] + "px";

            if (Browser.Engine.webkit) {
                selector += " th";
                var thRule = Jx.Styles.insertCssRule(selector, '', styleSheet);
                thRule.style.height = this.heights[idx] + "px";
                
                this.rules.set('th_jxGridRow'+idx, thRule);
            }

        }, this);
    },
    
    updateRules: function() {
      this.grid.gridTableBody.getChildren().each(function(row, idx) {
        var h = this.heights[idx] + "px";
        this.rules.get('jxGridRow'+idx).style.height = h;
        if (Browser.Engine.webkit) {
          this.rules.get('th_jxGridRow'+idx).style.height = h;
        }
      }, this);
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
        //if (this.grid.model.getPosition() === 0) {
        //    var rowWidth = this.getRowHeaderWidth();
        //    th.setStyle("width", rowWidth);
        //}
        th.store('jxCellData', {
            rowHeader: true,
            row: this.grid.model.getPosition()
        });
        list.add(th);
    },
    /**
     * APIMethod: getRowHeaderColumn
     * returns the name of the column that is used for the row header
     */
    getRowHeaderColumn : function () {
        return this.options.headerColumn;
    }
});
