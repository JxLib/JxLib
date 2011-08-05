/*
---

name: Jx.Panel.DataView.Group

description: A subclass of Dataview that can display records in groups.

license: MIT-style license.

requires:
 - Jx.Panel.DataView
 - Jx.Selection

provides: [Jx.Panel.DataView.Group]

...
 */
// $Id$
/**
 * Class: Jx.Panel.DataView.Group
 *
 * Extends: <Jx.Panel.DataView>
 *
 * This extension of Jx.Panel.DataView that provides for grouping the items
 * by a particular column.
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Panel.DataView.Group = new Class({

    Extends: Jx.Panel.DataView,
    Family: "Jx.Panel.DataView.Group",

    options: {
        /**
         * Option: groupTemplate
         * The template used to render the group heading
         */
        groupTemplate: null,
        /**
         * Option: groupContainerClass
         * The class added to the group container. All of the items and header
         * for a single grouping is contained by a div that has this class added.
         */
        groupContainerClass: null,
        /**
         * Option: groupHeaderClass
         * The class added to the heading. Used for styling.
         */
        groupHeaderClass: null,
        /**
         * Option: listOption
         * Options to pass to the main list
         */
        listOptions: {
            select: false,
            hover: false
        },
        /**
         * Option: itemOption
         * Options to pass to the item lists
         */
        itemOptions: {
            select: true,
            hover: true,
            hoverClass: 'jxItemHover',
            selectClass: 'jxItemSelect'
        }
    },

    init: function() {
        this.groupCols = this.parseTemplate(this.options.groupTemplate);
        this.itemManager = new Jx.Selection({
            eventToFire: {
                select: 'itemselect',
                unselect: 'itemunselect'
            },
            selectClass: 'jxItemSelected'
        });
        this.groupManager = new Jx.Selection({
            eventToFire: {
                select: 'groupselect',
                unselect: 'groupunselect'
            },
            selectClass: 'jxGroupSelected'
        });
        this.parent();

    },
    /**
     * APIMethod: render
     * sets up the list container and calls the parent class' render function.
     */
    render: function () {
        this.list = this.createList(this.domA, this.listOptions, this.groupManager);
        this.parent();

    },
    /**
     * Method: draw
     * actually does the work of creating the view
     */
    draw: function () {
        var d = this.options.data;
        var n = d.count();

        if (n != undefined && n != null && n > 0) {
            var currentGroup = '';
            var itemList = null;

            for (var i = 0; i < n; i++) {
                d.moveTo(i);
                var group = d.get(this.options.sortColumns[0]);

                if (group !== currentGroup) {
                    //we have a new grouping

                    //group container
                    var container =  new Element('div', {
                        'class': this.options.groupContainerClass
                    });
                    var l = this.createList(container,{
                        select: false,
                        hover: false
                    });
                    this.list.add(l.container);

                    //group header
                    currentGroup = group;
                    var obj = {};
                    this.groupCols.each(function (col) {
                        obj[col] = d.get(col);
                    }, this);
                    var temp = this.options.groupTemplate.substitute(obj);
                    var g = new Element('div', {
                        'class': this.options.groupHeaderClass,
                        'html': temp,
                        id: 'group-' + group.replace(" ","-","g")
                    });
                    l.add(g);

                    //items container
                    var currentItemContainer = new Element('div', {
                        'class': this.options.containerClass
                    });
                    itemList = this.createList(currentItemContainer, this.options.itemOptions, this.itemManager);
                    l.add(itemList.container);
                }

                var item = this.createItem();
                itemList.add(item);
            }
        } else {
            var empty = new Element('div', {html: this.options.emptyTemplate});
            this.list.add(empty);
        }
        this.fireEvent('renderDone', this);
    },

    /**
     * Method: createList
     * Creates the list object
     *
     * Parameters:
     * container - the container to use in the list
     * options - the options for the list
     * manager - <Jx.Selection> which selection obj to connect to this list
     */
    createList: function(container, options, manager){
        return new Jx.List(container, Object.append({
            onMouseenter: this.enterItem.bind(this),
            onMouseleave: this.leaveItem.bind(this),
            onAdd: this.addItem.bind(this),
            onRemove: this.removeItem.bind(this)
        }, options), manager);
    }

});
