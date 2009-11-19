// $Id: $
/**
 * Class: Jx.Notice
 *
 * Extends: <Jx.ListItem>
 *
 * Events:
 *
 * License: 
 * Copyright (c) 2009, DM Solutions Group.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Notice = new Class({

    Extends: Jx.ListItem,
    Family: 'Jx.Notice',
    
    options: {
        chrome: false,
        enabled: true,
        template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><span class="jxNotice"></span><a class="jxNoticeClose"></a></div></li>',
        klass: ''
    },
    
    classes: new Hash({
        domObj: 'jxNoticeItemContainer',
        domItem: 'jxNoticeItem',
        domContent: 'jxNotice',
        domClose: 'jxNoticeClose'
    }),
    
    /**
     * APIMethod: render
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
    
    close: function() {
        this.fireEvent('close', this);
    }
});

Jx.Notice.Success = new Class({
    Extends: Jx.Notice,
    options: {
        klass: 'jxNoticeSuccess'
    }
});
Jx.Notice.Warning = new Class({
    Extends: Jx.Notice,
    options: {
        klass: 'jxNoticeWarning'
    }
});
Jx.Notice.Error = new Class({
    Extends: Jx.Notice,
    options: {
        klass: 'jxNoticeError'
    }
});