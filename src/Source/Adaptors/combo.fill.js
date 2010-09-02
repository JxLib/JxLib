/*
---

name: Jx.Adaptor.Combo.Fill

description: Loads data into a Jx.Combo instance from designated column(s) of a data source.

license: MIT-style license.

requires:
 - Jx.Adaptor.Combo

provides: [Jx.Adaptor.Combo.Fill]

...
 */
Jx.Adaptor.Combo.Fill = new Class({

    Family: 'Jx.Adaptor.Combo.Fill',
    Extends: Jx.Adaptor,
    name: 'combo.fill',
    Binds: ['fill'],

    /**
     * Note: option.template is used for constructing the text for the label
     */
    options: {
        /**
         * Option: imagePathColumn
         * points to a store column that holds the image information
         * for the combo items.
         */
        imagePathColumn: null,
        /**
         * Option: imageClassColumn
         * Points to a store column that holds the image class
         * information for the combo items
         */
        imageClassColumn: null,
        /**
         * Option: selectedFn
         * This should be a function that could be run to determine if
         * an item should be selected. It will get passed the current store
         * record as the only parameter. It should return either true or false.
         */
        selectedFn: null,
        /**
         * Option: noRepeats
         * This option allows you to use any store even if it has duplicate
         * values in it. With this option set to true the adaptor will keep
         * track of all of teh labels it adds and will not add anything that's
         * a duplicate.
         */
        noRepeats: false
    },

    labels: null,

    init: function () {
        this.parent();

        if (this.options.noRepeat) {
            this.labels = [];
        }
    },

    attach: function (combo) {
        this.parent(combo);

        this.store.addEvent('storeDataLoaded', this.fill);
        if (this.store.loaded) {
            this.fill();
        }
    },

    detach: function () {
        this.parent();

        this.store.removeEvent('storeDataLoaded', this.fill);
    },

    fill: function () {
        var template,
            items=[],
            selected,
            obj,
            options = this.options,
            noRepeat = this.options.noRepeat;
        //empty the combo
        this.widget.empty();
        //reset the store and cycle through creating the objects
        //to pass to combo.add()
        this.store.first();
        items = [];
        this.store.each(function(record){
            template = this.store.fillTemplate(record,options.template,this.columnsNeeded);
            if (!noRepeat || (noRepeat && !this.labels.contains(template))) {
                selected = false;
                if ($type(options.selectedFn) == 'function') {
                    selected = options.selectedFn.run(record);
                }
                obj = {
                    label: template,
                    image: record.get(options.imagePathColumn),
                    imageClass: record.get(options.imageClassColumn),
                    selected: selected
                };
                items.push(obj);

                if (noRepeat) {
                    this.labels.push(template);
                }
            }

        },this);
        //pass all of the objects at once
        this.widget.add(items);
    }
});