/*
---

name: Jx.Notifier

description: Base class for notification areas that can hold temporary notices.

license: MIT-style license.

requires:
 - Jx.ListView
 - Jx.Notice
 - Core/Fx.Tween

provides: [Jx.Notifier]

css:
 - notification


...
 */
// $Id$
/**
 * Class: Jx.Notifier
 *
 * Extends: <Jx.ListView>
 *
 * Events:
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group.
 *
 * This file is licensed under an MIT style license
 */
define("jx/notifier",['../base','./listview','./notice'], function(base, ListView, Notice){
    
    var notifier = new Class({
    
        Extends: ListView,
        Family: 'Jx.Notifier',
        
        options: {
            /**
             * Option: parent
             * The parent this notifier is to be placed in. If not specified, it
             * will be placed in the body of the document.
             */
            parent: 'body',
            /**
             * Option: template
             * This is the template for the notification container itself, not the
             * actual notice. The actual notice is below in the class property 
             * noticeTemplate.
             */
            template: '<div class="jxNoticeListContainer"><ul class="jxNoticeList"></ul></div>',
            /**
             * Option: listOptions
             * An object holding custom options for the internal Jx.List instance.
             */
            listOptions: { }
        },
    
        classes: {
            domObj: 'jxNoticeListContainer',
            container: 'jxNoticeList'
        },
        
        /**
         * Method: render
         * render the widget
         */
        render: function () {
            this.parent();
            
            this.addEvent('postRender', function() {
                if (typeOf(this.options.items) == 'array') {
                    this.options.items.each(function(item){
                        this.add(item);
                    },this);
                }
            }.bind(this));
        },
        
        /**
         * APIMethod: add
         * Add a new notice to the notifier
         *
         * Parameters:
         * notice - {<Jx.Notice>} the notice to add
         */
        add: function (notice) {
            if (!(notice instanceof Notice)) {
                notice = new Notice({content: notice});
            }
            notice.addEvent('close', this.remove.bind(this));
            notice.show(this.container);
        },
        
        /**
         * APIMethod: remove
         * Add a new notice to the notifier
         *
         * Parameters:
         * notice - {<Jx.Notice>} the notice to remove
         */
        remove: function (notice) {
            if (this.domObj.contains(document.id(notice))) {
                notice.removeEvents('close');
                notice.hide();
            }
        }
    });
    
    if (base.global) {
        base.global.Notifier = notifier;
    }
    
    return notifier;
    
});