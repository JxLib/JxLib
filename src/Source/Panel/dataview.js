// $Id: $
/**
 * Class: Jx.Panel.DataView
 *
 * Extends: <Jx.Panel>
 *
 * This panel extension takes a standard Jx.Store (or subclass) and displays 
 * each record as an item using a provided template. It sorts the store as requested
 * before doing so. The class only creates the HTML and has no default CSS display. All 
 * styling must be done by the developer using the control.
 *
 *
 * Events:
 * renderDone - fires when the panel completes creating all of the items.
 *
 * License: 
 * Copyright (c) 2009, Jonathan Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Panel.DataView = new Class({

    Extends: Jx.Panel,
    
    options: {
        /**
         * Option: data
         * The store containing the data
         */
        data: null,
        /**
         * Option: sortColumns
         * An array of columns to sort the store by.
         */
        sortColumns: null,
        /**
         * Option: itemTemplate
         * The template to use in rendering records
         */
        itemTemplate: null,
        /**
         * Option: emptyTemplate
         * the template that is displayed when there are no records in the 
         * store.
         */
        emptyTemplate: null,
        /**
         * Option: containerClass
         * The class added to the container. It can be used to target the items
         * in the panel.
         */
        containerClass: null,
        /**
         * Option: itemClass
         * The class to add to each item. Used for styling purposes
         */
        itemClass: null
    },
    
    /**
     * Property: bound
     * hold bound functions
     */
    bound: {},
    
    /**
     * APIMethod: render
     * Renders the dataview. If the store already has data loaded it will be rendered
     * at the end of the method.
     */
    render: function () {
        if (!$defined(this.options.data)) {
            //we can't do anything without data
            return;
        }
        
        //the main container for the library
        this.domA = new Element('div');
        
        this.options.content = this.domA;
        
        //pass to parent
        this.parent();
        
        this.domA.addClass(this.options.containerClass);
       
        //parse templates so we know what values are needed in each
        this.itemCols = this.parseTemplate(this.options.itemTemplate);
        
        this.bound.update = this.update.bind(this);
        //listen for data updates
        this.options.data.addEvent('loadFinished', this.bound.update);
        this.options.data.addEvent('sortFinished', this.bound.update);
        this.options.data.addEvent('loadError', this.bound.update);
        
        if (this.options.data.loaded) {
            this.update();
        }
        
    },
    
    /**
     * Method: draw
     * begins the process of creating the items
     */
    draw: function () {
        var n = this.options.data.count();
        if ($defined(n) && n > 0) {
            for (var i = 0; i < n; i++) {
                this.options.data.moveTo(i);
                
                var item = this.createItem();
                item.inject(this.domA);
            }
        } else {
            var empty = new Element('div', {html: this.options.emptyTemplate});
            empty.inject(this.domA);
        }
        this.fireEvent('renderDone', this);
    },
    /**
     * Method: createItem
     * Actually does the work of getting the data from the store
     * and creating a single item based on the provided template
     */
    createItem: function () {
      //create the item
        var itemObj = {};
        this.itemCols.each(function (col) {
            itemObj[col] = this.options.data.get(col);
        }, this);
        var itemTemp = this.options.itemTemplate.substitute(itemObj);
        var item = new Element('div', {
            'class': this.options.itemClass,
            html: itemTemp
        });
        return item;
    },
    /**
     * APIMethod: update
     * This method begins the process of creating the items. It is called when
     * the store is loaded or can be called to manually recreate the view.
     */
    update: function () {
        if (!this.updating) {
            this.updating = true;
            this.domA.empty();
            this.options.data.sort(this.options.sortColumns);
            this.draw();
            this.updating = false;
        }
    },
    /**
     * Method: parseTemplate
     * parses the provided template to determine which store columns are 
     * required to complete it.
     * 
     * Parameters:
     * template - the template to parse
     */
    parseTemplate: function (template) {
        //we parse the template based on the columns in the data store looking 
        //for the pattern {column-name}. If it's in there we add it to the 
        //array of ones to look for
        var columns = this.options.data.getColumns();
        var arr = [];
        columns.each(function (col) {
            var s = '{' + col.name + '}';
            if (template.contains(s)) {
                arr.push(col.name);
            }
        }, this);
        return arr;
    }
});
