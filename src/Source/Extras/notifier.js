


Jx.Notifier = new Class({
    
    Family: 'Jx.Notifier',
    Extends: Jx.ListView,
    
    options: {
        /**
         * Option: parent
         * The parent this notifier is to be placed in. If not specified, it
         * will be placed in the body of the document.
         */
        parent: null,
        /**
         * Option: template
         * This is the template for the notification container itself, not the
         * actual notice. The actual notice is below in the class property 
         * noticeTemplate.
         */
        template: '<div class="jxNoticeListContainer"><ul class="jxNoticeList"></ul></div>',
        /**
         * Option: listOptions
         * An object holding custom options for the internal Jx.List instance.
         */
        listOptions: { },
        items: []
    },

    classes: new Hash({
        domObj: 'jxNoticeListContainer',
        listObj: 'jxNoticeList'
    }),
    
    showing: false,

    init: function () {
        this.parent();
    },
    
    render: function () {
        this.parent();
        
        if (!$defined(this.options.parent)) {
            this.options.parent = document.body;
        }
        
        this.addEvent('postRender', function() {
            if (Jx.type(this.options.items) == 'array') {
                this.options.items.each(function(item){
                    this.add(item);
                },this);
            }
        }.bind(this));
    },
    
    add: function (notice) {
        if (Jx.type(notice) != 'Jx.Notice') {
            notice = new Jx.Notice({content: notice});
        }
        
        notice.addEvent('close', function() {
            this.remove(notice);
        }.bind(this));

        if (!this.showing) {
            this.domObj.setStyle('opacity',0);
            this.options.parent.adopt(this);
            this.showing = true;
            this.parent(notice);
            this.domObj.get('tween').addEvent('complete', function(){
                this.domObj.get('tween').removeEvents('complete');
                this.fireEvent('add', notice);
            }.bind(this));
            this.domObj.fade('in');
        } else {
            document.id(notice).setStyle('opacity', 0);
            this.parent(notice);
            document.id(notice).get('tween').addEvent('complete', function(){
                document.id(notice).get('tween').removeEvents('complete');
                this.fireEvent('add', notice);
            }.bind(this));
            document.id(notice).fade('in');
        }
    },
    
    remove: function (notice) {
        notice.removeEvents('close');
        if (this.showing) {
            this.showing = false;
            var parent = this.parent;
            if (this.list.count() == 1) {
                this.domObj.get('tween').addEvent('complete', function() {
                    parent(notice);
                    this.domObj.get('tween').removeEvents('complete');
                    this.fireEvent('remove', notice);
                });
                this.domObj.fade('out');
            } else {
                document.id(notice).get('tween').addEvent('complete', function() {
                    parent(notice);
                    document.id(notice).get('tween').removeEvents('complete');
                    this.fireEvent('remove',notice);
                }.bind(this));
                document.id(notice).fade('out');
            }
            this.parent(notice);
        }
    }
    
});