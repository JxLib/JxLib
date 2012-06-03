/*
---

name: Jx.Notice.Error

description: Represents a single item used in a notifier.

license: MIT-style license.

requires:
 - Jx.Notice

provides: [Jx.Notice.Error]

images:
 - notice_error.png
...
 */
/**
 * Class: Jx.Notice.Error
 * A <Jx.Notice> subclass useful for displaying error messages
 */
define("jx/notice/error", ['../../base','../notice'],
       function(base, Notice){
    
    var error = new Class({
        Extends: Notice,
        options: {
            template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+base.aPixel.src+'" title="Error"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="' + Locale.get('Jx','notice').closeTip + '"></a></div></li>',
            klass: 'jxNoticeError'
        }
    });
    
    if (base.global) {
        base.global.Notice.Error = error;
    }
    
    return error;

});