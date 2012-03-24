/*
---

name: Jx.Notice.Success

description: Represents a single item used in a notifier.

license: MIT-style license.

requires:
 - Jx.Notice

provides: [Jx.Notice.Success]

images:
 - notice_success.png
...
*/
/**
 * Class: Jx.Notice.Success
 * A <Jx.Notice> subclass useful for displaying success messages
 */
define("jx/notice/success", ['../../base','../notice'],
       function(base, Notice){
    
    var success = new Class({
        Extends: Notice,
        options: {
            template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+base.aPixel.src+'" title="Success"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="' + Locale.get('Jx','notice').closeTip + '"></a></div></li>',
            klass: 'jxNoticeSuccess'
        }
    });
    
    if (base.global) {
        base.global.Notice.Success = success;
    }
    
    return success;

});