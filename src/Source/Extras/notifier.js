


Jx.Notifier = new Class({
    
    Extends: Jx.ListView,
    Family: 'Jx.Notifier',
    
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

        return this.parent(notice);
    },
    
    remove: function (notice) {
        notice.removeEvents('close');
        this.parent(notice);
    }
});