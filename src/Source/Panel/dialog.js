/*
---

name: Jx.Dialog

description: A Jx.Panel that implements a floating dialog.

license: MIT-style license.

requires:
 - Jx.Panel
 - more/Keyboard

optional:
 - More/Drag

provides: [Jx.Dialog]

css:
 - dialog

images:
 - dialog_chrome.png
 - dialog_resize.png

...
 */
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
 * Locale Keys:
 * - dialog.resizeToolTip
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Dialog = new Class({
    Extends: Jx.Panel,
    Family: 'Jx.Dialog',

    options: {
        /* Option: modal
         * (optional) {Boolean} controls whether the dialog will be modal
         * or not.  The default is to create modal dialogs.
         */
        modal: true,
        /** 
         * Option: maskOptions
         */
        maskOptions: {
          'class':'jxModalMask',
          maskMargins: true,
          useIframeShim: true,
          iframeShimOptions: {
            className: 'jxIframeShim'
          }
        },
        eventMaskOptions: {
          'class':'jxEventMask',
          maskMargins: false,
          useIframeShim: false,
          destroyOnHide: true
        },
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
         * (optional) {String} the title of the dialog box.
         */
        label: '',
        /* Option: parent
         * (optional) {HTMLElement} a reference to an HTML element that
         * the dialog is to be contained by.  The default value is for the dialog
         * to be contained by the body element.
         */
        //parent: null,
        /* Option: resize
         * (optional) {Boolean} determines whether the dialog is
         * resizeable by the user or not.  Default is false.
         */
        resize: false,

        /* Option: move
         * (optional) {Boolean} determines whether the dialog is
         * moveable by the user or not.  Default is true.
         */
        move: true,
        /*
         * Option: limit
         * (optional) {Object} || false
         * passed to the Drag instance of this dialog to limit the movement
         * {Object} must have x&y coordinates with a range, like {x:[0,500],y:[0,500]}.
         * Set an id or a reference of a DOM Element (ie 'document', 'myContainerWithId', 
         * $('myContainer'), $('domID').getParent()) to use these dimensions
         * as boundaries. Default is false.
         */
        limit : false,
        /* Option: close
         * (optional) {Boolean} determines whether the dialog is
         * closeable by the user or not.  Default is true.
         */
        close: true,
        /**
         * Option: destroyOnClose
         * (optional) {Boolean} determines whether closing the dialog also
         * destrpys it completely. Default is false
         */
        destroyOnClose: false,
        /**
         * Option: useKeyboard
         * (optional) {Boolean} determines whether the Dialog listens to keyboard events globally
         * Default is false
         */
        useKeyboard : false,
        /**
         * Option: keys
         * (optional) {Object} refers with the syntax for MooTools Keyboard Class
         * to functions. Set key to false to disable it manually 
         */
        keys: {
          'esc' : 'close'
        },
        /**
         * Option: keyboardMethods
         *
         * can be used to overwrite existing keyboard methods that are used inside
         * this.options.keys - also possible to add new ones.
         * Functions are bound to the dialog when using 'this'
         *
         * example:
         *  keys : {
         *    'alt+enter' : 'maximizeDialog'
         *  },
         *  keyboardMethods: {
         *    'maximizeDialog' : function(ev){
         *      ev.preventDefault();
         *      this.maximize();
         *    }
         *  }
         */
        keyboardMethods : {},
        collapsedClass: 'jxDialogMin',
        collapseClass: 'jxDialogCollapse',
        menuClass: 'jxDialogMenu',
        maximizeClass: 'jxDialogMaximize',
        closeClass: 'jxDialogClose',
        type: 'dialog',
        template: '<div class="jxDialog"><div class="jxDialogTitle"><img class="jxDialogIcon" src="'+Jx.aPixel.src+'" alt="" title=""/><span class="jxDialogLabel"></span><div class="jxDialogControls"></div></div><div class="jxDialogContentContainer"><div class="jxDialogContent"></div></div></div>'
    },
    classes: {
        domObj: 'jxDialog',
        title: 'jxDialogTitle',
        domImg: 'jxDialogIcon',
        domLabel: 'jxDialogLabel',
        domControls: 'jxDialogControls',
        contentContainer: 'jxDialogContentContainer',
        content: 'jxDialogContent'
    },
    /**
     * MooTools Keyboard class for Events (mostly used in Dialog.Confirm, Prompt or Message)
     * But also optional here with esc to close
     */
    keyboard : null,
    /**
     * APIMethod: render
     * renders Jx.Dialog
     */
    render: function() {
        this.isOpening = false;
        this.firstShow = true;

        this.options = Object.merge({},
            {parent:document.body}, // these are defaults that can be overridden
            this.options,
            {position: 'absolute'} // these override anything passed to the options
        );

        /* initialize the panel overriding the type and position */
        this.parent();
        this.openOnLoaded = this.open.bind(this);
        this.options.parent = document.id(this.options.parent);

        this.domObj.setStyle('display','none');
        this.options.parent.adopt(this.domObj);

        /* the dialog is moveable by its title bar */
        if (this.options.move && typeof Drag != 'undefined') {
            this.title.addClass('jxDialogMoveable');

            this.options.limit = this.setDragLimit(this.options.limit);
            // local reference to use Drag instance variables inside onDrag()
            var self = this;
            // COMMENT: any reason why the drag instance isn't referenced to the dialog?
            new Drag(this.domObj, {
                handle: this.title,
                limit: this.options.limit,
                onBeforeStart: (function(){
                    this.stack();
                }).bind(this),
                onStart: function() {
                    if (!self.options.modal && self.options.parent.mask) {
                      self.options.parent.mask(self.options.eventMaskOptions);
                    }
                    self.contentContainer.setStyle('visibility','hidden');
                    self.chrome.addClass('jxChromeDrag');
                    if(self.options.limit) {
                      var coords = self.options.limitOrig.getCoordinates();
                      for(var i in coords) {
                        window.console ? console.log(i, coords[i]) : false;
                      }
                      this.options.limit = self.setDragLimit(self.options.limitOrig);
                    }
                }, // COMMENT: removed bind(this) for setting the limit to the drag instance
                onDrag: function() {
                  if(this.options.limit) {
                    // find out if the right border of the dragged element is out of range
                    if(this.value.now.x+self.options.width >= this.options.limit.x[1]) {
                      this.value.now.x = this.options.limit.x[1] - self.options.width;
                      this.element.setStyle('left',this.value.now.x);
                    }
                    // find out if the bottom border of the dragged element is out of range
                    if(this.value.now.y+self.options.height >= this.options.limit.y[1]) {
                      this.value.now.y = this.options.limit.y[1] - self.options.height;
                      this.element.setStyle('top',this.value.now.y);
                    }
                  }
                },
                onComplete: (function() {
                    if (!this.options.modal && this.options.parent.unmask) {
                      this.options.parent.unmask();
                    }
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
                title: this.getText({set:'Jx',key:'panel',value:'resizeTooltip'}),
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
                    if (!this.options.modal && this.options.parent.mask) {
                      this.options.parent.mask(this.options.eventMaskOptions);
                    }
                    this.contentContainer.setStyle('visibility','hidden');
                    this.chrome.addClass('jxChromeDrag');
                }).bind(this),
                onDrag: (function() {
                    this.resizeChrome(this.domObj);
                }).bind(this),
                onComplete: (function() {
                    if (!this.options.modal && this.options.parent.unmask) {
                      this.options.parent.unmask();
                    }
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
            this.stack();
        }).bind(this));

        // initialize keyboard class
        this.initializeKeyboard();
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
        if (state != undefined && state != null) {
            this.options.closed = state;
        } else {
            this.options.closed = !this.options.closed;
        }
        if (this.options.closed) {
            if (!this.domObj.hasClass(this.options.collapsedClass)) {
                this.domObj.addClass(this.options.collapsedClass);
            }
            this.contentContainer.setStyle('display','none');
            if (this.resizeHandle) {
                this.resizeHandle.setStyle('display','none');
            }
        } else {
            if (this.domObj.hasClass(this.options.collapsedClass)) {
                this.domObj.removeClass(this.options.collapsedClass);
            }
            this.contentContainer.setStyle('display','block');
            if (this.resizeHandle) {
                this.resizeHandle.setStyle('display','block');
            }
        }

        if (this.options.closed) {
            var m = this.domObj.measure(function(){
                return this.getSizes(['margin'],['top','bottom']).margin;
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
     * Method: maximize
     * Called when the maximize button of a dialog is clicked. It will maximize
     * the dialog to match the size of its parent.
     */
    maximize: function () {
        
        if (!this.maximized) {
            //get size of parent
            var p = this.options.parent;
            var size;
            
            if (p === document.body) {
                size = Jx.getPageDimensions();
            } else {
                size = p.getBorderBoxSize();
            }
            this.previousSettings = {
                width: this.options.width,
                height: this.options.height,
                horizontal: this.options.horizontal,
                vertical: this.options.vertical,
                left: this.options.left,
                right: this.options.right,
                top: this.options.top,
                bottom: this.options.bottom
            };
            this.options.width = size.width;
            this.options.height = size.height;
            this.options.vertical = '0 top';
            this.options.horizontal = '0 left';
            this.options.right = 0;
            this.options.left = 0;
            this.options.top = 0;
            this.options.bottom = 0;
            this.domObj.resize(this.options);
            this.fireEvent('resize');
            this.resizeChrome(this.domObj);
            this.maximized = true;
            this.domObj.addClass('jxDialogMaximized');
            this.fireEvent('maximize');
        } else {
            this.options = Object.merge({},this.options, this.previousSettings);
            this.domObj.resize(this.options);
            this.fireEvent('resize');
            this.resizeChrome(this.domObj);
            this.maximized = false;
            if (this.domObj.hasClass('jxDialogMaximized')) {
                this.domObj.removeClass('jxDialogMaximized');
            }
            this.fireEvent('restore');
        }
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
        this.toolbar.update();
        
        /* do the modal thing */
        if (this.options.modal && this.options.parent.mask) {
          var opts = Object.merge({},this.options.maskOptions || {}, {
            style: {
              'z-index': Jx.getNumber(this.domObj.getStyle('z-index')) - 1
            }
          });
          this.options.parent.mask(opts);
          Jx.Stack.stack(this.options.parent.get('mask').element);
        }
        /* stack the dialog */
        this.stack();

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
        this.domObj.setStyle('visibility', 'visible');
    },
    /**
     * Method: hide
     * hide the dialog, external code should use the <Jx.Dialog::close>
     * method to hide the dialog.
     */
    hide : function() {
        this.domObj.setStyle('display','none');
        this.unstack();
        if (this.options.modal && this.options.parent.unmask) {
          Jx.Stack.unstack(this.options.parent.get('mask').element);
          this.options.parent.unmask();
        }
        if(this.options.useKeyboard && this.keyboard != null) {
          this.keyboard.deactivate();
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
            this.setBusy();
            this.loadContent(this.content);
            this.addEvent('contentLoaded', this.openOnLoaded);
        } else {
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
        // COMMENT: this works only for onDemand -> NOT for cacheContent = false..
        // for this loading an URL everytime, use this.openURL(url) 
        if(!this.contentIsLoaded && this.options.loadOnDemand) {
          this.loadContent(this.content);
        }
        if (this.contentIsLoaded) {
            this.removeEvent('contentLoaded', this.openOnLoaded);
            this.show();
            this.fireEvent('open', this);
            this.isOpening = false;
        } else {
            this.addEvent('contentLoaded', this.openOnLoaded);
        }
        if(this.options.useKeyboard && this.keyboard != null) {
          this.keyboard.activate();
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
        if (this.options.destroyOnClose) {
            this.domObj.dispose();
        }
        this.fireEvent('close',[this]);
    },

    cleanup: function() { },
    
    /**
     * APIMethod: isOpen
     * returns true if the dialog is currently open, false otherwise
     */
    isOpen: function () {
        //check to see if we're visible
        return !((this.domObj.getStyle('display') === 'none') || (this.domObj.getStyle('visibility') === 'hidden'));
    },
    
    changeText: function (lang) {
    	this.parent();
    	if (this.maxM != undefined && this.maxM != null) {
			if (this.maximize) {
				this.maxM.setLabel(this.getText({set:'Jx',key:'panel',value:'restoreLabel'}));
	    	} else {
	    		this.maxM.setLabel(this.getText({set:'Jx',key:'panel',value:'maximizeLabel'}));
	    	}
    	}
    	if (this.resizeHandle != undefined && this.resizeHandle != null) {
    		this.resizeHandle.set('title', this.getText({set:'Jx',key:'dialog',value:'resizeTooltip'}));
    	}
      this.toggleCollapse(false);
    },

    initializeKeyboard: function() {
      if(this.options.useKeyboard) {
        var self = this;
        this.keyboardEvents = {};
        this.keyboardMethods = {
          close : function(ev) {ev.preventDefault();self.close()}
        }
        this.keyboard = new Keyboard({
          events: this.getKeyboardEvents()
        });
      }
    },

    /**
     * Method: getKeyboardMethods
     * used by this and all child classes to have methods listen to keyboard events,
     * returned object will be parsed to the events object of a MooTools Keyboard instance
     *
     * @return Object
     */
    getKeyboardEvents : function() {
      var self = this;
      for(var i in this.options.keys) {
        // only add a reference once, otherwise keyboard events will be fired twice in subclasses
        if(this.keyboardEvents[i] === undefined || this.keyboardEvents[i] === null) {
          if(this.keyboardMethods[this.options.keys[i]] !== undefined &&
             this.keyboardMethods[this.options.keys[i]] !== null) {
            this.keyboardEvents[i] = this.keyboardMethods[this.options.keys[i]];
          }else if(this.options.keyboardMethods[this.options.keys[i]] !== undefined &&
                   this.options.keyboardMethods[this.options.keys[i]] !== null){
            this.keyboardEvents[i] = this.options.keyboardMethods[this.options.keys[i]].bind(self);
          }else if(Jx.type(this.options.keys[i]) == 'function') {
            this.keyboardEvents[i] = this.options.keys[i].bind(self);
          }else{
            // allow disabling of special keys by setting them to false or null with having a warning
            if(this.options.keyboardMethods[this.options.keys[i]] != false) {
              console != undefined ? console.warn("keyboard method %o not defined for %o", this.options.keys[i], this) : false;
            }
          }
        }
      }
      return this.keyboardEvents;
    },

    /**
     * Method: setDragLimit
     * calculates the drag-dimensions of an given element to drag
     *
     * Parameters:
     * - reference {Object} (optional) the element|elementId|object to set the limits
     */
    setDragLimit : function(reference) {
      if(reference !== undefined && reference !== null) this.options.limit = reference;
      
      // check drag limit if it is an container or string for an element and use dimensions
      var limitType = this.options.limit != null ? Jx.type(this.options.limit) : false;
      if(this.options.limit && limitType != 'object') {
        var coords = false;
        switch(limitType) {
          case 'string':
            if(document.id(this.options.limit)) {
              coords = document.id(this.options.limit).getCoordinates();
            }
            break;
          case 'element':
          case 'document':
          case 'window':
            coords = this.options.limit.getCoordinates();
            break;
        }
        if(coords) {
          this.options.limitOrig = this.options.limit;
          this.options.limit = {
            x : [coords.left, coords.right],
            y : [coords.top, coords.bottom]
          }
        }else{
          this.options.limit = false;
        }
      }
      return this.options.limit;
    },

    /**
     * gets called by parent class Jx.Panel and decides whether to load content or not
     */
    shouldLoadContent: function() {
      return !this.options.loadOnDemand;
    }
});

