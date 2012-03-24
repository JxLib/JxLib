/*
---

name: Jx.Notice.Information

description: Represents a single item used in a notifier.

license: MIT-style license.

requires:
 - Jx.Notice

provides: [Jx.Notice.Information]

images:
 - notice.png
...
 */
/**
 * Class: Jx.Notice.Information
 * A <Jx.Notice> subclass useful for displaying informational messages
 */
define("jx/notice/information", ['../../base','../notice'],
       function(base, Notice){
    

    var information = new Class({
        Extends: Notice,
        options: {
            template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+base.aPixel.src+'" title="Success"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="' + Locale.get('Jx','notice').closeTip + '"></a></div></li>',
            klass: 'jxNoticeInformation'
        }
    });
    
    if (base.global) {
        base.global.Notice.Information = information;
    }
    
    return information;

});