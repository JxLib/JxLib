/*
---

name: Jx.Field.OptionGroup

description:

license: MIT-style license.

requires:
 - Jx.Field
 - Jx.Field.Checkbox
 - Jx.Field.Radio
 - Jx.Styles

provides: [Jx.Field.OptionGroup]

css:
 - optiongroup

...
 */
/** 
 * Class: Jx.Field.OptionGroup
 * This class creates an option group. It allows arranging checkboxes or
 * radiobuttons in columns.
 * 
 * License:
 * Copyright (c) 2011, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Field.OptionGroup = new Class({

    Extends: Jx.Field,
    Family: 'Jx.Field.OptionGroup',

    pluginNamespace: 'OptionGroup',

    options: {
        template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><span class="jxInputOptionGroup"></span><span class="jxInputTag"></span></span>',
        type: 'check',
        items: null,
        columns: 2,
        asArray: false,
        name: null
    },

    type: 'OptionGroup',

    styleSheet: 'jxFieldOptionGroup',

    columns: null,

    init: function () {
        this.columns = [];

        if (this.options.type === 'check') {
            this.fieldType = Jx.Field.Checkbox;
        } else {
            this.fieldType = Jx.Field.Radio;
        }
        this.uniqueId = this.generateId();
        this.parent();
    },

    render: function () {
        this.parent();

        this.domObj.set('id', this.uniqueId);
        for (var i = 1; i <= this.options.columns; i++) {
            this.columns.push(
                new Element('div',{
                    'class': 'jxOptionGroupColumn column-'+i
                }).inject(this.field)
            );

        }

        //create style for columns

        this.styleSheet += this.uniqueId;
        this.columnWidth = Math.floor(1 * 100 / this.options.columns);
        this.columnStyle = Jx.Styles.insertCssRule('#' + this.uniqueId + ' .jxOptionGroupColumn', '' ,this.styleSheet);
        this.columnStyle.style.width = this.columnWidth + '%';

        if (this.options.items !== undefined && this.options.items !== null) {
            this.add(this.options.items)
        }
    },

    add: function (items) {
        if (Jx.type(items) === 'string') {
            items = Array.from(items);
        }

        var column = 0;
        Object.each(items, function(item){
            if (this.options.asArray) {
                if (this.options.name !== undefined && this.options.name !== null) {
                    item.name = this.options.name + '[]';
                } else {
                    if (!item.name.contains('[]')) {
                        item.name += '[]';
                    }
                }
            }
            new this.fieldType(item).addTo(this.columns[column]);
            column += 1;
            if (column === this.options.columns) {
                column = 0;
            } 
        },this);
        
    },

    empty: function () {
        Object.each(this.columns, function(col){
            col.empty();
        },this);
    }
});