Jx.Notifier.Float = new Class({
    
    Family: 'Jx.Notifier.Float',
    Extends: Jx.Notifier,
    
    options: {
        chrome: true,
        fx: null,
        width: 250,
        position: {
            horizontal: 'center center',
            vertical: 'top top'
        }
    },

    render: function () {
        this.parent();
        this.domObj.setStyle('position','absolute');
        if ($defined(this.options.width)) {
            this.domObj.setStyle('width',this.options.width);
        }
        this.position(this.domObj, this.options.parent, this.options.position);
    },
    
    add: function(notice) {
        if (!(notice instanceof Jx.Notice)) {
            notice = new Jx.Notice({content: notice});
        }
        notice.options.chrome = this.options.chrome;
        this.parent(notice);
    }
});