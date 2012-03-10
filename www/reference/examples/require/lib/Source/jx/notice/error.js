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
define("jx/notice/error", function(require, exports, module){
    
    var base = require("../../base"),
        Notice = require("../notice");
        
    /**
     * Class: Jx.Notice.Error
     * A <Jx.Notice> subclass useful for displaying error messages
     */
    var error = module.exports = new Class({
        Extends: Notice,
        options: {
            template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+base.aPixel.src+'" title="Error"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="' + Locale.get('Jx','notice').closeTip + '"></a></div></li>',
            klass: 'jxNoticeError'
        }
    });
    
    if (base.global) {
        base.global.Notice.Error = module.exports;
    }

});