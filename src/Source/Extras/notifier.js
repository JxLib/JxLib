


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
        listOptions: { }
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
        document.id(this.options.parent).adopt(this.domObj);
        
        this.addEvent('postRender', function() {
            if (Jx.type(this.options.items) == 'array') {
                this.options.items.each(function(item){
                    this.add(item);
                },this);
            }
        }.bind(this));
    },
    
    add: function (notice) {
        if (!(notice instanceof Jx.Notice)) {
            notice = new Jx.Notice({content: notice});
        }
        notice.addEvent('close', this.remove.bind(this));
        notice.show(this.listObj);
    },
    
    remove: function (notice) {
        if (this.domObj.hasChild(notice)) {
            notice.removeEvents('close');
            notice.hide();
        }
    }
});