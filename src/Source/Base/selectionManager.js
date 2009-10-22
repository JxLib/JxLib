

Jx.SelectionManager = new Class({
    
    Extends: Jx.Object,
    Family: 'Jx.SelectionManager',
    
    options: {
        /**
         * Option: eventToFire
         * Allows the developer to change the event that is fired in case one
         * object is using multiple selectionManager instances.
         */
        eventToFire: { 
            select: 'select',
            unselect: 'unselect'
        },
        /**
         * APIProperty: selectClass
         * the CSS class name to add to the wrapper element when it is selected
         */
        selectClass: 'jxSelected',
        /**
         * Option: selectMode
         * {string} default single.  May be single or multiple.  In single mode
         * only one item may be selected.  Selecting a new item will implicitly
         * unselect the currently selected item.
         */
        selectMode: 'single',
        /**
         * Option: selectToggle
         * {Boolean} Default true.  Selection of a selected item will unselect
         * it.
         */
        selectToggle: true,
        /**
         * Option: minimumSelection
         * {Integer} Default 0.  The minimum number of items that must be
         * selected.  If set to a number higher than 0, items added to a list
         * are automatically selected until this minimum is met.  The user may
         * not unselect items if unselecting them will drop the total number of
         * items selected below the minimum.
         */
        minimumSelection: 0
    },
    
    selection: null,
    
    lists: null,
    
    obj: null,
    
    parameters: ['obj', 'options'],
    
    init: function () {
        this.selection = [];
        this.lists = [];
        if ($defined(this.options.obj)) {
            this.obj = this.options.obj;
        }
    },
    
    add: function (list) {
        this.lists.push(list);
        /**
         * TODO: We could also register for all of the events thrown by the list
         * and rethrow them directly on the object as is done in select() and 
         * unselect() below. That would provide a central way of managing all of the
         * events on all associated lists.
         */
    },
    
    remove: function (list) {
        this.lists.erase(list);
    },
    
    select: function (item, list) {
        if (list.indexOf(item) > -1) {
            if (this.options.selectMode === 'multiple') {
                if (this.selection.contains(item)) {
                    this.unselect(item, list);
                } else {
                    document.id(item).addClass(this.options.selectClass);
                    this.selection.push(item);
                    this.obj.fireEvent(this.options.eventToFire.select, item, this);
                }
            } else if (this.options.selectMode == 'single') {
                if (!this.selection.contains(item)) {
                    document.id(item).addClass(this.options.selectClass);
                    this.selection.push(item);
                    if (this.selection.length > 1) {
                        this.unselect(this.selection[0]);
                    }
                } else {
                    this.unselect(item);
                }
                this.obj.fireEvent(this.options.eventToFire.select, item, this);
            }
        }
    },
    
    unselect: function (item, list) {
        if (!$defined(list)) {
            list = this.findListFromItem(item);
        }
        if ($defined(list)) {
            if (list.container.hasChild(item) && this.selection.contains(item)) {
                if (this.selection.length > this.options.minimumSelection) {
                    document.id(item).removeClass(this.options.selectClass);
                    this.selection.erase(item);
                    this.obj.fireEvent(this.options.eventToFire.unselect, item, this);
                }
            }
        }
    },
    
    selected: function () {
        return this.selection;
    },
    
    findListFromItem: function (item) {
        var l = null;
        this.lists.each(function (list) {
            if (list.indexOf(item) > -1) {
                l = list;
            }
        }, this);
        return l;
    }

});