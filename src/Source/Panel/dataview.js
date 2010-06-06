/*
---

name: Jx.Panel.DataView

description: A panel used for displaying records from a store in a list-style interface rather than a grid.

license: MIT-style license.

requires:
 - Jx.Panel
 - Jx.Store
 - Jx.List

provides: [Jx.Panel.DataView]

...
 */
// $Id$
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
        itemClass: null,
        /**
         * Option: itemOptions
         * Options to pass to the list object
         */
        listOptions: {
            select: true,
            hover: true
        }
    },

    init: function () {
        this.domA = new Element('div');
        this.list = this.createList(this.domA, this.options.listOptions);
        this.parent();
    },
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

        this.options.content = this.domA;

        //pass to parent
        this.parent();

        this.domA.addClass(this.options.containerClass);

        //parse templates so we know what values are needed in each
        this.itemCols = this.parseTemplate(this.options.itemTemplate);

        this.bound.update = this.update.bind(this);
        //listen for data updates
        this.options.data.addEvent('storeDataLoaded', this.bound.update);
        this.options.data.addEvent('storeSortFinished', this.bound.update);
        this.options.data.addEvent('storeDataLoadFailed', this.bound.update);

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
                this.list.add(item);
            }
        } else {
            var empty = new Element('div', {html: this.options.emptyTemplate});
            this.list.add(item);
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
            this.list.empty();
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
    },
    /**
     * Method: enterItem
     * Fires mouseenter event
     *
     * Parameters:
     * item - the item that is the target of the event
     * list - the list this item is in.
     */
    enterItem: function(item, list){
        this.fireEvent('mouseenter', item, list);
    },
    /**
     * Method: leaveItem
     * Fires mouseleave event
     *
     * Parameters:
     * item - the item that is the target of the event
     * list - the list this item is in.
     */
    leaveItem: function(item, list){
        this.fireEvent('mouseleave', item, list);
    },
    /**
     * Method: selectItem
     * Fires select event
     *
     * Parameters:
     * item - the item that is the target of the event
     * list - the list this item is in.
     */
    selectItem: function(item, list){
        this.fireEvent('select', item, list);
    },
    /**
     * Method: unselectItem
     * Fires unselect event
     *
     * Parameters:
     * item - the item that is the target of the event
     * list - the list this item is in.
     */
    unselectItem: function(item, list){
        this.fireEvent('unselect', item, list);
    },
    /**
     * Method: addItem
     * Fires add event
     *
     * Parameters:
     * item - the item that is the target of the event
     * list - the list this item is in.
     */
    addItem: function(item, list) {
        this.fireEvent('add', item, list);
    },
    /**
     * Method: removeItem
     * Fires remove event
     *
     * Parameters:
     * item - the item that is the target of the event
     * list - the list this item is in.
     */
    removeItem: function(item, list) {
        this.fireEvent('remove', item, list);
    },
    /**
     * Method: createList
     * Creates the list object
     *
     * Parameters:
     * container - the container to use in the list
     * options - the options for the list
     */
    createList: function(container, options){
        return new Jx.List(container, $extend({
            onMouseenter: this.enterItem.bind(this),
            onMouseleave: this.leaveItem.bind(this),
            onSelect:  this.selectItem.bind(this),
            onAdd: this.addItem.bind(this),
            onRemove: this.removeItem.bind(this),
            onUnselect: this.unselectItem.bind(this)
        }, options));
    }
});
