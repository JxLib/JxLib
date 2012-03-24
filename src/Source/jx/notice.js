/*
---

name: Jx.Notice

description: Represents a single item used in a notifier.

license: MIT-style license.

requires:
 - Jx.ListItem

provides: [Jx.Notice]

images:
 - notice.png
 - notice_error.png
 - notice_warning.png
 - notice_success.png
 - icons.png


...
 */
// $Id$
/**
 * Class: Jx.Notice
 *
 * Extends: <Jx.ListItem>
 *
 * Events:
 * 
 * Locale Keys:
 * - notice.closeTip
 *
 * License:
 * Copyright (c) 2009, DM Solutions Group.
 *
 * This file is licensed under an MIT style license
 */
define("jx/notice", ['../base','./listitem'], function(base, ListItem){
    
    var notice = new Class({

        Extends: ListItem,
        Family: 'Jx.Notice',
    
        options: {
            /**
             * Option: fx
             * the effect to use on the notice when it is shown and hidden,
             * 'fade' by default
             */
            fx: 'fade',
            /**
             * Option: chrome
             * {Boolean} should the notice be displayed with chrome or not,
             * default is false
             */
            chrome: false,
            /**
             * Option: enabled
             * {Boolean} default is false
             */
            enabled: true,
            /**
             * Option: template
             * {String} the HTML template of a notice
             */
            template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="' + Locale.get('Jx','notice').closeTip + '"></a></div></li>',
            /**
             * Option: klass
             * {String} css class to add to the notice
             */
            klass: ''
        },
    
        classes: {
            domObj: 'jxNoticeItemContainer',
            domItem: 'jxNoticeItem',
            domContent: 'jxNotice',
            domClose: 'jxNoticeClose'
        },
    
        /**
         * Method: render
         */
        render: function () {
            this.parent();
            
            if (this.options.klass) {
                this.domObj.addClass(this.options.klass);
            }
            if (this.domClose) {
                this.domClose.addEvent('click', this.close.bind(this));
            }
        },
        /**
         * APIMethod: close
         * close the notice
         */
        close: function() {
            this.fireEvent('close', this);
        },
        /**
         * APIMethod: show
         * show the notice
         */
        show: function(el, onComplete) {
            if (this.options.chrome) {
                this.showChrome();
            }
            if (this.options.fx) {
                document.id(el).adopt(this);
                if (onComplete) onComplete();
            } else {
                document.id(el).adopt(this);
                if (onComplete) onComplete();
            }
        },
        /**
         * APIMethod: hide
         * hide the notice
         */
        hide: function(onComplete) {
            if (this.options.chrome) {
                this.hideChrome();
            }
            if (this.options.fx) {
                document.id(this).dispose();
                if (onComplete) onComplete();
            } else {
                document.id(this).dispose();
                if (onComplete) onComplete();
            }
        },
    
        changeText : function(lang) {
            this.parent();
            //this.render();
            //this.processElements(this.options.template, this.classes);
        }
    });
    
    if (base.global) {
        base.global.Notice = notice;
    }
    
    return notice;
    
});