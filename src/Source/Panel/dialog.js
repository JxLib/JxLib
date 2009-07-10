// $Id$
/**
 * Class: Jx.Dialog
 *
 * Extends: <Jx.Panel>
 *
 * A Jx.Dialog implements a floating dialog.  Dialogs represent a useful way
 * to present users with certain information or application controls.
 * Jx.Dialog is designed to provide the same types of features as traditional
 * operating system dialog boxes, including:
 *
 * - dialogs may be modal (user must dismiss the dialog to continue) or 
 * non-modal
 *
 * - dialogs are movable (user can drag the title bar to move the dialog
 * around)
 *
 * - dialogs may be a fixed size or allow user resizing.
 *
 * Jx.Dialog uses <Jx.ContentLoader> to load content into the content area
 * of the dialog.  Refer to the <Jx.ContentLoader> documentation for details
 * on content options.
 *
 * Example:
 * (code)
 * var dialog = new Jx.Dialog();
 * (end)
 *
 * Events:
 * open - triggered when the dialog is opened
 * close - triggered when the dialog is closed
 * change - triggered when the value of an input in the dialog is changed
 * resize - triggered when the dialog is resized
 *
 * Extends:
 * Jx.Dialog extends <Jx.Panel>, please go there for more details.
 *
 * License: 
 * Copyright (c) 2008, DM Solutions Group Inc.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Dialog = new Class({
    Family: 'Jx.Dialog',
    Extends: Jx.Panel,
    Implements: [Jx.AutoPosition, Jx.Chrome],
    
    /**
     * Property: {HTMLElement} blanket
     * modal dialogs prevent interaction with the rest of the application
     * while they are open, this element is displayed just under the
     * dialog to prevent the user from clicking anything.
     */
    blanket: null,
    
    options: {
        /* Option: modal
         * (optional) {Boolean} controls whether the dialog will be modal
         * or not.  The default is to create modal dialogs.
         */
        modal: true,
        /* just overrides default position of panel, don't document this */
        position: 'absolute',
        /* Option: width
         * (optional) {Integer} the initial width in pixels of the dialog.
         * The default value is 250 if not specified.
         */
        width: 250,
        /* Option: height
         * (optional) {Integer} the initial height in pixels of the 
         * dialog. The default value is 250 if not specified.
         */
        height: 250,
        /* Option: horizontal
         * (optional) {String} the horizontal rule for positioning the
         * dialog.  The default is 'center center' meaning the dialog will be
         * centered on the page.  See {<Jx.AutoPosition>} for details.
         */
        horizontal: 'center center',
        /* Option: vertical
         * (optional) {String} the vertical rule for positioning the
         * dialog.  The default is 'center center' meaning the dialog will be
         * centered on the page.  See {<Jx.AutoPosition>} for details.
         */
        vertical: 'center center',
        /* Option: label
         * (optional) {String} the title of the dialog box.  "New Dialog"
         * is the default value.
         */
        label: 'New Dialog',
        /* Option: id
         * (optional) {String} an HTML ID to assign to the dialog, primarily
         * used for applying CSS styles to specific dialogs
         */
        id: '',
        /* Option: parent
         * (optional) {HTMLElement} a reference to an HTML element that
         * the dialog is to be contained by.  The default value is for the dialog
         * to be contained by the body element.
         */
        parent: null,
        /* Option: resize
         * (optional) {Boolean} determines whether the dialog is
         * resizeable by the user or not.  Default is false.
         */
        resize: false,
        /* Option: resizeTooltip
         * the tooltip to display for the resize handle, empty by default.
         */
        resizeTooltip: '',
        /* Option: move
         * (optional) {Boolean} determines whether the dialog is
         * moveable by the user or not.  Default is true.
         */
        move: true,
        /* Option: close
         * (optional) {Boolean} determines whether the dialog is
         * closeable by the user or not.  Default is true.
         */
        close: true
    },
    /**
     * Constructor: Jx.Dialog
     * Construct a new instance of Jx.Dialog
     *
     * Parameters: 
     * options - {Object} an object containing options for the dialog.
     *
     * Options: <Jx.Dialog.Options>, <Jx.Panel.Options>, <Jx.ContentLoader.Options>
     */
    initialize: function(options) {
        this.isOpening = false;
        this.firstShow = true;
        
        /* initialize the panel overriding the type and position */
        this.parent($merge(
            {parent:document.body}, // these are defaults that can be overridden
            options,
            {type:'Dialog', position: 'absolute'} // these override anything passed to the options
        ));
        this.openOnLoaded = this.open.bind(this);
        this.options.parent = $(this.options.parent);
        
        if (this.options.modal) {
            this.blanket = new Element('div',{
                'class':'jxDialogModal',
                styles:{
                    display:'none',
                    zIndex: -1
                }
            });
            this.blanket.resize = (function() {
                var ss = $(document.body).getScrollSize();
                this.setStyles({
                    width: ss.x,
                    height: ss.y
                });
            }).bind(this.blanket);
            this.options.parent.adopt(this.blanket);
            window.addEvent('resize', this.blanket.resize);
            
        }

        this.domObj.setStyle('display','none');
        this.options.parent.adopt(this.domObj);
        
        /* the dialog is moveable by its title bar */
        if (this.options.move && typeof Drag != 'undefined') {
            this.title.addClass('jxDialogMoveable');
            new Drag(this.domObj, {
                handle: this.title,
                onBeforeStart: (function(){
                    Jx.Dialog.orderDialogs(this);
                }).bind(this),
                onStart: (function() {
                    this.contentContainer.setStyle('visibility','hidden');
                    this.chrome.addClass('jxChromeDrag');
                }).bind(this),
                onComplete: (function() {
                    this.chrome.removeClass('jxChromeDrag');
                    this.contentContainer.setStyle('visibility','');
                    var left = Math.max(this.chromeOffsets.left, parseInt(this.domObj.style.left,10));
                    var top = Math.max(this.chromeOffsets.top, parseInt(this.domObj.style.top,10));
                    this.options.horizontal = left + ' left';
                    this.options.vertical = top + ' top';
                    this.position(this.domObj, this.options.parent, this.options);
                    this.options.left = parseInt(this.domObj.style.left,10);
                    this.options.top = parseInt(this.domObj.style.top,10);
                    if (!this.options.closed) {
                        this.domObj.resize(this.options);                        
                    }
                }).bind(this)
            });            
        }
        
        /* the dialog is resizeable */
        if (this.options.resize && typeof Drag != 'undefined') {
            this.resizeHandle = new Element('div', {
                'class':'jxDialogResize',
                title: this.options.resizeTooltip,
                styles: {
                    'display':this.options.closed?'none':'block'
                }
            });
            this.domObj.appendChild(this.resizeHandle);

            this.resizeHandleSize = this.resizeHandle.getSize(); 
            this.resizeHandle.setStyles({
                bottom: this.resizeHandleSize.height,
                right: this.resizeHandleSize.width
            });
            this.domObj.makeResizable({
                handle:this.resizeHandle,
                onStart: (function() {
                    this.contentContainer.setStyle('visibility','hidden');
                    this.chrome.addClass('jxChromeDrag');
                }).bind(this),
                onDrag: (function() {
                    this.resizeChrome(this.domObj);
                }).bind(this),
                onComplete: (function() {
                    this.chrome.removeClass('jxChromeDrag');
                    var size = this.domObj.getMarginBoxSize();
                    this.options.width = size.width;
                    this.options.height = size.height;
                    this.layoutContent();
                    this.domObj.resize(this.options);
                    this.contentContainer.setStyle('visibility','');
                    this.fireEvent('resize');
                    this.resizeChrome(this.domObj);
                    
                }).bind(this)
            });
        }
        /* this adjusts the zIndex of the dialogs when activated */
        this.domObj.addEvent('mousedown', (function(){
            Jx.Dialog.orderDialogs(this);
        }).bind(this));
    },
    
    /**
     * Method: resize
     * resize the dialog.  This can be called when the dialog is closed
     * or open.
     *
     * Parameters:
     * width - the new width
     * height - the new height
     * autoPosition - boolean, false by default, if resizing an open dialog
     * setting this to true will reposition it according to its position
     * rules.
     */
    resize: function(width, height, autoPosition) {
        this.options.width = width;
        this.options.height = height;
        if (this.domObj.getStyle('display') != 'none') {
            this.layoutContent();
            this.domObj.resize(this.options);
            this.fireEvent('resize');
            this.resizeChrome(this.domObj);
            if (autoPosition) {
                this.position(this.domObj, this.options.parent, this.options);                
            }
        } else {
            this.firstShow = false;
        }
    },
    
    /**
     * Method: sizeChanged
     * overload panel's sizeChanged method
     */
    sizeChanged: function() {
        if (!this.options.closed) {
            this.layoutContent();
        }
    },
    
    /**
     * Method: toggleCollapse
     * sets or toggles the collapsed state of the panel.  If a
     * new state is passed, it is used, otherwise the current
     * state is toggled.    
     *
     * Parameters:
     * state - optional, if passed then the state is used, 
     * otherwise the state is toggled.
     */
    toggleCollapse: function(state) {
        if ($defined(state)) {
            this.options.closed = state;
        } else {
            this.options.closed = !this.options.closed;
        }
        if (this.options.closed) {
            if (!this.domObj.hasClass('jx'+this.options.type+'Min')) {
                this.domObj.addClass('jx'+this.options.type+'Min');
            }
            this.contentContainer.setStyle('display','none');
            if (this.resizeHandle) {
                this.resizeHandle.setStyle('display','none');
            }
        } else {
            if (this.domObj.hasClass('jx'+this.options.type+'Min')) {
                this.domObj.removeClass('jx'+this.options.type+'Min');
            }
            this.contentContainer.setStyle('display','block');
            if (this.resizeHandle) {
                this.resizeHandle.setStyle('display','block');
            }
        }
        
        if (this.options.closed) {
            var m = this.domObj.measure(function(){
                return this.getSize(['margin'],['top','bottom']).margin;
            });
            var size = this.title.getMarginBoxSize();
            this.domObj.resize({height: m.top + size.height + m.bottom});
            this.fireEvent('collapse');
        } else {
            this.domObj.resize(this.options);
            this.fireEvent('expand');
        }
        this.showChrome(this.domObj);
    },
    
    /**
     * Method: show
     * show the dialog, external code should use the <Jx.Dialog::open> method
     * to make the dialog visible.
     */
    show : function( ) {
        /* prepare the dialog for display */
        this.domObj.setStyles({
            'display': 'block',
            'visibility': 'hidden'
        });
        
        if (this.blanket) {
            this.blanket.resize();            
        }

        Jx.Dialog.orderDialogs(this);
        
        /* do the modal thing */
        if (this.blanket) {
            this.blanket.setStyles({
                visibility: 'visible',
                display: 'block'
            });
        }
        
        if (this.options.closed) {
            var m = this.domObj.measure(function(){
                return this.getSizes(['margin'],['top','bottom']).margin;
            });
            var size = this.title.getMarginBoxSize();
            this.domObj.resize({height: m.top + size.height + m.bottom});
        } else {
            this.domObj.resize(this.options);            
        }
        if (this.firstShow) {
            this.contentContainer.resize({forceResize: true});
            this.layoutContent();
            this.firstShow = false;
            /* if the chrome got built before the first dialog show, it might
             * not have been properly created and we should clear it so it
             * does get built properly
             */
            if (this.chrome) {
                this.chrome.dispose();
                this.chrome = null;
            }
        }
        /* update or create the chrome */
        this.showChrome(this.domObj);
        /* put it in the right place using auto-positioning */
        this.position(this.domObj, this.options.parent, this.options);
        this.domObj.setStyle('visibility', '');
    },
    /**
     * Method: hide
     * hide the dialog, external code should use the <Jx.Dialog::close>
     * method to hide the dialog.
     */
    hide : function() {
        Jx.Dialog.Stack.erase(this);
        Jx.Dialog.ZIndex--;
        this.domObj.setStyle('display','none');
        if (this.blanket) {
            this.blanket.setStyle('visibility', 'hidden');
            Jx.Dialog.ZIndex--;
        }
        
    },
    /**
     * Method: openURL
     * open the dialog and load content from the provided url.  If you don't
     * provide a URL then the dialog opens normally.
     *
     * Parameters:
     * url - <String> the url to load when opening.
     */
    openURL: function(url) {
        if (url) {
            this.options.contentURL = url;
            this.options.content = null;  //force Url loading
            this.loadContent(this.content);
            this.addEvent('contentLoaded', this.openOnLoaded); 
        }
        else {
            this.open();
        }
    },
    
    /**
     * Method: open
     * open the dialog.  This may be delayed depending on the 
     * asynchronous loading of dialog content.  The onOpen
     * callback function is called when the dialog actually
     * opens
     */
    open: function() {
        if (!this.isOpening) {
            this.isOpening = true;
        }
        if (this.contentIsLoaded) {
            this.removeEvent('contentLoaded', this.openOnLoaded);
            this.show();
            this.fireEvent('open', this);
            this.isOpening = false;
        } else {
            this.addEvent('contentLoaded', this.openOnLoaded);
        }
    },
    /**
     * Method: close
     * close the dialog and trigger the onClose callback function
     * if necessary
     */
    close: function() {
        this.isOpening = false;
        this.hide();
        this.fireEvent('close');
    }
});

Jx.Dialog.Stack = [];
Jx.Dialog.BaseZIndex = null;
Jx.Dialog.orderDialogs = function(d) {
    Jx.Dialog.Stack.erase(d).push(d);
    if (Jx.Dialog.BaseZIndex === null) {
        Jx.Dialog.BaseZIndex = Math.max(Jx.Dialog.Stack[0].domObj.getStyle('zIndex').toInt(), 1);
    }
    Jx.Dialog.Stack.each(function(d, i) {
        var z = Jx.Dialog.BaseZIndex+i;
        if (d.blanket) {
            d.blanket.setStyle('zIndex',z);
        }
        d.domObj.setStyle('zIndex',z);
    });
    
};
