

Jx.Selection = new Class({
    
    Extends: Jx.Object,
    Family: 'Jx.Selection',
    
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
    
    init: function () {
        this.selection = [];
    },
    
    defaultSelect: function(item) {
        if (this.selection.length < this.options.minimumSelection) {
            this.select(item);
        }
    },
    
    select: function (item) {
        if (this.options.selectMode === 'multiple') {
            if (this.selection.contains(item)) {
                this.unselect(item);
            } else {
                document.id(item).addClass(this.options.selectClass);
                this.selection.push(item);
                this.fireEvent(this.options.eventToFire.select, item);
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
            this.fireEvent(this.options.eventToFire.select, item);
        }
    },
    
    unselect: function (item) {
        if (this.selection.contains(item) && 
            this.selection.length > this.options.minimumSelection) {
            document.id(item).removeClass(this.options.selectClass);
            this.selection.erase(item);
            this.fireEvent(this.options.eventToFire.unselect, item, this);
        }
    },
    
    selected: function () {
        return this.selection;
    },
    
    isSelected: function(item) {
        return this.selection.contains(item);
    }

});