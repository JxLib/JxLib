Jx.Notifier.Float = new Class({
    
    Extends: Jx.Notifier,
    Family: 'Jx.Notifier.Float',
    
    options: {
        chrome: true,
        fx: null,
        size: {
            width: null,
            height: null
        },
        position: {
            horizontal: 'center center',
            vertical: 'top top',
            offsets: {}
        }
    },
    positionOptions: null,
    showing: false,

    render: function () {
        this.parent();
        
        this.domObj.setStyles({
            display: 'block',
            opacity: 0,
            width: this.options.size.width,
            position: 'absolute'
        });
        this.positionOpts = {
            element: this.domObj,
            relative: this.options.parent,
            options: this.options.position
        };
    },
    
    add: function (notice) {
        if (Jx.type(notice) != 'Jx.Notice') {
            notice = new Jx.Notice({content: notice});
        }
        if (!this.showing) {
            this.domObj.setStyle('opacity',0);
            this.options.parent.adopt(this);
            this.showing = true;
            this.parent(notice);
            this.domObj.fade('in');
        } else {
            document.id(notice).setStyle('opacity', 0);
            this.parent(notice);
            document.id(notice).fade('in');
        }
    },
    
    remove: function (notice) {
        notice.removeEvents('close');
        if (this.showing) {
            var parent = this.parent;
            if (this.list.count() == 0) {
                this.domObj.get('tween').addEvent('complete', function() {
                    parent(notice);
                    this.domObj.get('tween').removeEvents('complete');
                });
                this.domObj.fade('out');
            } else {
                document.id(notice).get('tween').addEvent('complete', function() {
                    parent(notice);
                    document.id(notice).get('tween').removeEvents('complete');
                });
                document.id(notice).fade('out');
            }
            this.parent(notice);
        }
    }
});