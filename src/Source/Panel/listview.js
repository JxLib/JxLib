// $Id: $
/**
 * Class: Jx.ListView
 *
 * Extends: <Jx.Widget>
 *
 * Events:
 *
 * License: 
 * Copyright (c) 2009, DM Solutions Group.
 * 
 * This file is licensed under an MIT style license
 */
Jx.ListView = new Class({

    Extends: Jx.Widget,
    
    options: {
        template: '<ul class="jxListView"></ul>'
    },
    
    classes: ['jxListView'],
    
    /**
     * APIMethod: render
     */
    render: function () {
        this.parent();
        this.elements = this.processTemplate(this.options.template, this.classes);
        this.domObj = this.elements.get('jxListView');
        
        if (this.options.selection) {
            this.selection = this.options.selection;
        } else if (this.options.select) {
            this.selection = new Jx.Selection(this.options);
            this.ownsSelection = true;
        }
        
        this.list = new Jx.List(this.domObj, {}, this.selection);
        
    },
    
    cleanup: function() {
        if (this.ownsSelection) {
            this.selection.destroy();
        }
        this.list.destroy();
    },
    
    add: function(item, where) {
        this.list.add(item, where);
    },
    
    remove: function(item) {
        this.list.remove(item);
    },
    
    replace: function(item, withItem) {
        this.list.replace(item, withItem);
    }
});