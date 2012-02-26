/*
---

name: Jx.Notice.Warning

description: Represents a single item used in a notifier.

license: MIT-style license.

requires:
 - Jx.Notice

provides: [Jx.Notice.Warning]

images:
 - notice_warning.png
...
 */
define("jx/notice/warning", function(require, exports, module){
    
    var base = require("../../base"),
        Notice = require("../notice");
        
    /**
     * Class: Jx.Notice.Success
     * A <Jx.Notice> subclass useful for displaying success messages
     */
    /**
     * Class: Jx.Notice.Success
     * A <Jx.Notice> subclass useful for displaying warning messages
     */
    var warning = module.exports = new Class({
        Extends: Notice,
        options: {
            template: '<li class="jxNoticeItemContainer"><div class="jxNoticeItem"><img class="jxNoticeIcon" src="'+base.aPixel.src+'" title="Warning"><span class="jxNotice"></span><a class="jxNoticeClose" href="javascript:void(0);" title="' + Locale.get('Jx','notice').closeTip + '"></a></div></li>',
            klass: 'jxNoticeWarning'
        }
    });
    
    
    if (base.global) {
        base.global.Notice.Warning = module.exports;
    }

});