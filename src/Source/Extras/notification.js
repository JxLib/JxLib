


Jx.Notification = new Class({
    
    Extends: Jx.Widget,
    Family: 'Jx.Notification',
    
    options: {
        /**
         * Option: parent
         * The parent this notification is inside. If left undefined it is 
         * either document.body (for 'anchor' style) or window (for 'float'
         * style).
         */
        parent: null,
        /**
         * Option: items
         * An initial list of notices to add. Pass them as an array of 
         * either strings, Elements, or Jx.Widget instances (anything that 
         * works with document.id() for grabbing gan element will work).
         */
        items: [],
        
        /**
         * Option: style
         * Determines if this is anchored to a side of a parent or
         * floated in the viewport. Possible options are 'anchor' or 
         * 'float'
         */
        style: 'anchor',
        /**
         * Option: position
         * This option could have 2 different meanings. If style is set to
         * "anchor" then this should be a string that indicates the side of 
         * the parent to anchor the notification container to. If style is 
         * "float" then position should be an object that defines the horizontal
         * and vertical options for the widget's position method
         */
        position: 'top',
        /**
         * Option: sizes
         * An object with members to indicate the size of the notification 
         * container in different states. When 'anchor' is the style the valid
         * options are 'open' and 'minimized'. When 'float' is the style the 
         * only valid option is 'width'.
         */
        sizes: {
            open: 60,
            minimized: 20
        },
        /**
         * Option: fx
         * An instance of Fx.Tween (or an object containing options for it) 
         * to be used in animating the container when in an anchored state. If
         * not set a default sliding animation will be used.
         */
        fx: null,
        /**
         * Option: template
         * This is the template for the notification container itself, not the
         * actual notice. The actual notice is below in the class property 
         * noticeTemplate.
         */
        template: '<div class="jxNotificationContainer"><span class="jxNotificationMinimize"></span><span class="jxNoticeContainer"></span></div>',
        /**
         * Option: listOptions
         * An object holding custom options for the internal Jx.List instance.
         */
        listOptions: {
            hover: true
        },
        /**
         * Option: floatChrome
         * Determines whether a floated notification uses chrome. Defaults to
         * true.
         */
        floatChrome: true
    },

    list: null,
    
    containerFx: null,
    
    noticeTemplate: '<span class="jxNotice"><span class="jxNoticeClose"></span></span>',
    
    classes: ['jxNotificationContainer','jxNotificationMinimize', 'jxNoticeContainer'],
    
    noticeClasses: ['jxNotice','jxNoticeClose'],
    
    bound: {},
    
    init: function () {
        this.elements = this.processTemplate(this.options.template, this.classes);
        this.bound.closeNotice = this.closeNotice.bind(this);
        this.parent();
    },
    
    render: function () {
        
        this.parent();
        this.domObj = this.elements.get('jxNotificationContainer');
        this.list = new Jx.List(this.elements.get('jxNoticeContainer'), this.options.listOptions);
        this.containerFx = $defined(this.options.fx) ? this.options.fx : {};
        
        if (!$defined(this.options.parent)) {
            this.options.parent = document.body;
        }
        
        //add any initial notices
        if (this.options.items.length > 0) {
            this.options.items.each(function(item){
                this.add(item);
            },this);
        }
                
        if (this.options.style === 'anchor') {
            this.setAnchors();
        } else {
            this.setFloat();
        }
        
        
    },
    
    add: function (item, klass) {
        var els = this.processTemplate(this.noticeTemplate,this.noticeClasses);
        var notice = els.get('jxNotice');
        if (Jx.type(item) === 'string') {
            var n = new Element('span',{
                html: item
            });
            n.inject(notice);
        } else {
            document.id(item).inject(notice);
        }
        if ($defined(klass)) {
            notice.addClass('jxNotice'+klass);
        }
        this.list.add(notice);
        
        els.get('jxNoticeClose').addEvent('click', this.closeNotice.bind(this, notice));
        
        this.fireEvent('add', item);
        return notice;
    },
    
    remove: function (notice) {
        this.list.remove(notice);
        this.fireEvent('remove',notice);
    },
    
    setAnchors: function () {
        
        this.domObj.addClass('jxNotification'+this.options.postion.capitalize());
        
        //first grab everything in the parent
        var els = document.id(this.options.parent).getChildren();
        //put those all into a div
        this.originalDiv = new Element('div');
        this.originalDiv.adopt(els);
        
        //now, determine if there were initial notices added
        //as that changes the initial layout
        var opts;
        if (this.list.count() > 0) {
            opts = this.getOpenAnchorOpts('open');
        } else {
            opts = {
                opts: {
                    height: 0
                },
                odOpts: {}
            };
        }
        
        //inject children into parent
        this.options.parent.adopt(this.domObj, this.originalDiv);
        
        //check to see if parent already has layout
        var pLayout = this.options.parent.get('jxLayout');
        if (!$defined(pLayout)){
            new Jx.Layout(this.options.parent);
        }
        
        //give the two siblings layout
        new Jx.Layout(this.originalDiv, opts.odOpts);
        new Jx.Layout(this.domObj, opts.opts);
        
        //force the layout to resize
        this.options.parent.resize();
        
        //addEvents
        this.bound = {
            revealAnchor: this.revealAnchor.bind(this),
            checkAnchor: this.checkAnchor.bind(this),
            minimizeAnchor: this.minimizeAnchor.bind(this)
        };
        this.addEvent('add', this.bound.revealAnchor);
        this.addEvent('remove', this.bound.checkAnchor);
        this.elements.get('jxNotificationMinimize').addEvent('click', this.bound.minimizeAnchor);
        
        if (this.list.count() > 0) {
            this.revealAnchor();
        }
    },
    
    getOpenAnchorOpts: function (state) {
        var ret = {};
        switch (this.options.position) {
            case 'top':
                ret.opts = {
                    height: this.options.sizes[state]
                };
                ret.odOpts = {
                    top : opts.height
                };
                break;
            case 'bottom':
                ret.opts = {
                    top: null,
                    height: this.options.sizes[state]
                };
                ret.odOpts = {};
                break;
            case 'left':
                ret.opts = {
                    width: this.options.sizes[state]
                };
                ret.odOpts = {
                    left : opts.width
                };
                break;
            case  'right':
                ret.opts = {
                    left: null,
                    width: this.options.sizes[state]
                };
                ret.odOpts = {};
                break;
        }  
        return ret;
    },
    
    setFloat: function () {
        
        this.domObj.setStyles({
            visibility: 'hidden',
            display: 'block',
            opacity: 0,
            width: this.options.sizes.width,
            position: 'absolute'
        });
        this.positionOpts = {
            element: this.domObj,
            relative: this.options.parent
        };
        if (Jx.type(this.options.position) === "object") {
            this.positionOpts.options = this.options.position;
        } else {
            this.positionOpts.options = {
                horizontal: 'right right',
                vertical: 'bottom bottom',
                offsets: {
                    bottom: 10,
                    right: 10
                }
            };
        }
        
        this.elements.get('jxNotificationMinimize').addEvent('click', this.hideFloat.bind(this));
        this.bound.revealFloat = this.revealFloat.bind(this);
        this.bound.checkFloat = this.checkFloat.bind(this);
        this.addEvent('add',this.bound.revealFloat);
        this.addEvent('remove', this.bound.checkFloat);
        
        if (this.list.count() > 0) {
            this.revealFloat();
        }
    },
    
    revealFloat: function () {
        if (!this.showing) {
            //inject domObj into parent 
            this.domObj.inject(this.options.parent);
            if (this.options.floatChrome) {
                this.showChrome(this.domObj);
            }
            this.position(this.positionOpts.element, this.positionOpts.relative, this.positionOpts.options);
            this.domObj.fade('in');
            this.showing = true;
        }
    },
    
    hideFloat: function () {
        if (this.showing) {
            this.domObj.fade('out');
            this.showing = false;
        }
    },
    
    checkFloat: function () {
        if (this.list.count() === 0) {
            //list is empty so close the float
            this.hideFloat();
        }
    },
    
    revealAnchor: function () {
        if (!this.showing) {
            var prop;
            if (['top','bottom'].contains(this.options.position)) {
                prop = 'height';
            } else {
                prop = 'width';
            }
            //animate the panel opening
            this.domObj.get('tween',{
                property: prop,
                onComplete: function () {
                    //then call resize with new options on both windows
                    var opts = this.getOpenAnchorOpts('open');
                    this.domObj.get('jxLayout').resize(opts.opts);
                    this.originalDiv.get('jxLayout').resize(opts.odOpts);
                    this.showing = true;
                }.bind(this)
            }).start(this.options.sizes.open);
        }
    },
    
    checkAnchor: function () {
        if (this.list.count() === 0) {
            //list is empty so close the float
            this.hideAnchor();
        } 
    },
    
    hideAnchor: function () {
        if (this.showing) {
            var prop;
            if (['top','bottom'].contains(this.options.position)) {
                prop = 'height';
            } else {
                prop = 'width';
            }
            //animate the panel opening
            this.domObj.get('tween',{
                property: prop,
                onComplete: function () {
                    //then call resize with new options on both windows
                    var opts = {
                        opts: {
                            height: 0
                        },
                        odOpts: {}
                    };
                    this.domObj.get('jxLayout').resize(opts.opts);
                    this.originalDiv.get('jxLayout').resize(opts.odOpts);
                    this.showing = false;
                }.bind(this)
            }).start(0);
            
        }
    },
    
    minimizeAnchor: function () {
        if (!this.showing) {
            var prop;
            if (['top','bottom'].contains(this.options.position)) {
                prop = 'height';
            } else {
                prop = 'width';
            }
            //animate the panel opening
            this.domObj.get('tween',{
                property: prop,
                onComplete: function () {
                    //then call resize with new options on both windows
                    var opts = this.getOpenAnchorOpts('minimized');
                    this.domObj.get('jxLayout').resize(opts.opts);
                    this.originalDiv.get('jxLayout').resize(opts.odOpts);
                    this.showing = false;
                }.bind(this)
            }).start(this.options.sizes.open);
        }
    },
    
    closeNotice: function (notice) {
        notice.get('tween',{
            property: 'opacity',
            onComplete: this.remove.bind(this,notice)
        }).start(0);
    }
});