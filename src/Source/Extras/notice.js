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

    Family: 'Jx.Notice',
    Extends: Jx.ListItem,

    options: {
        fx: 'fade',
        chrome: false,
        enabled: true,
        template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="close this notice"></a></div></li>',
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
    },
    
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
    }
});

Jx.Notice.Information = new Class({
    Extends: Jx.Notice,
    options: {
        template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+Jx.aPixel.src+'" title="Success"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="close this notice"></a></div></li>',
        klass: 'jxNoticeInformation'
    }
});
Jx.Notice.Success = new Class({
    Extends: Jx.Notice,
    options: {
        template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+Jx.aPixel.src+'" title="Success"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="close this notice"></a></div></li>',
        klass: 'jxNoticeSuccess'
    }
});
Jx.Notice.Warning = new Class({
    Extends: Jx.Notice,
    options: {
        template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+Jx.aPixel.src+'" title="Warning"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="close this notice"></a></div></li>',
        klass: 'jxNoticeWarning'
    }
});
Jx.Notice.Error = new Class({
    Extends: Jx.Notice,
    options: {
        template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+Jx.aPixel.src+'" title="Error"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="close this notice"></a></div></li>',
        klass: 'jxNoticeError'
    }
});
