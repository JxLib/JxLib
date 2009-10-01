// $Id: $
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
        groupHeaderClass: null
    },
    /**
     * APIMethod: render
     * sets up the template and calls the parent class' render function.
     */
    render: function () {
        this.groupCols = this.parseTemplate(this.options.groupTemplate);
        this.parent();
    },
    /**
     * Method: draw
     * actually does the work of creating the view
     */
    draw: function () {
        var d = this.options.data;
        var n = d.count();
        
        if ($defined(n) && n > 0) {
            var currentGroup = '';
            var currentItemContainer = null;
            
            for (var i = 0; i < n; i++) {
                d.moveTo(i);
                var group = d.get(this.options.sortColumns[0]);
                
                if (group !== currentGroup) {
                    //we have a new grouping
                    
                    //group container
                    var container =  new Element('div', {
                        'class': this.options.groupContainerClass
                    });
                    container.inject(this.domA);
                    
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
                    g.inject(container);
                    
                    //items container
                    currentItemContainer = new Element('div', {
                        'class': this.options.containerClass
                    });
                    
                    currentItemContainer.inject(container);
                }
                
                var item = this.createItem();
                item.inject(currentItemContainer);
            }
        } else {
            var empty = new Element('div', {html: this.options.emptyTemplate});
            empty.inject(this.domA);
        }
        this.fireEvent('renderDone', this);
    }
});
