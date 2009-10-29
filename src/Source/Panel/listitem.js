// $Id: $
/**
 * Class: Jx.ListItem
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
Jx.ListItem = new Class({

    Extends: Jx.Widget,
    
    options: {
        template: '<li class="jxListItemContainer jxListItem"></li>'
    },
    
    classes: ['jxListItemContainer','jxListItem'],
    
    /**
     * APIMethod: render
     */
    render: function () {
        this.parent();
        this.elements = this.processTemplate(this.options.template, this.classes);
        this.domObj = this.elements.get('jxListItemContainer');
        this.domContent = this.elements.get('jxListItem')
        this.loadContent(this.domContent);
    }
});