/*
---

name: Jx.Panel

description: A panel is a fundamental container object that has a content area and optional toolbars around the content area.

license: MIT-style license.

requires:
 - Jx.Widget
 - Jx.Menu.Item
 - Jx.Layout
 - Jx.Toolbar.Container
 - Jx.Toolbar.Item

provides: [Jx.Panel]

css:
 - panel

images:
 - panel_controls.png
 - panelbar.png

...
 */
// $Id$
/**
 * Class: Jx.Panel
 *
 * Extends: <Jx.Widget>
 *
 * A panel is a fundamental container object that has a content
 * area and optional toolbars around the content area.  It also
 * has a title bar area that contains an optional label and
 * some user controls as determined by the options passed to the
 * constructor.
 *
 * Example:
 * (code)
 * (end)
 *
 * Events:
 * close - fired when the panel is closed
 * collapse - fired when the panel is collapsed
 * expand - fired when the panel is opened
 * 
 * Locale Keys:
 * - panel.collapseTooltip
 * - panel.collapseLabel
 * - panel.expandlabel
 * - panel.maximizeTooltip
 * - panel.maximizeLabel
 * - panel.restoreTooltip
 * - panel.restoreLabel
 * - panel.closeTooltip
 * - panel.closeLabel
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
define("jx/panel",['../base','./widget','./layout','./container','./button','./toolbar','./menu','./menu/item'],
       function(base, Widget, Layout, Container, Button, Toolbar,Menu, MenuItem){
    
    var panel = new Class({
    
        Extends: Widget,
        Family: 'Jx.Panel',
        
        toolbarContainers: {
            top: null,
            right: null,
            bottom: null,
            left: null
        },
    
         options: {
            position: null,
            collapsedClass: 'jxPanelMin',
            collapseClass: 'jxPanelCollapse',
            menuClass: 'jxPanelMenu',
            maximizeClass: 'jxPanelMaximize',
            closeClass: 'jxPanelClose',
    
            /* Option: label
             * String, the title of the Jx Panel
             */
            label: '&nbsp;',
            /* Option: height
             * integer, fixed height to give the panel - no fixed height by
             * default.
             */
            height: null,
            /* Option: collapse
             * boolean, determine if the panel can be collapsed and expanded
             * by the user.  This puts a control into the title bar for the user
             * to control the state of the panel.
             */
            collapse: true,
            /* Option: close
             * boolean, determine if the panel can be closed (hidden) by the user.
             * The application needs to provide a way to re-open the panel after
             * it is closed.  The closeable property extends to dialogs created by
             * floating panels.  This option puts a control in the title bar of
             * the panel.
             */
            close: false,
            /* Option: closed
             * boolean, initial state of the panel (true to start the panel
             *  closed), default is false
             */
            closed: false,
            /* Option: hideTitle
             * Boolean, hide the title bar if true.  False by default.
             */
            hideTitle: false,
            /* Option: toolbars
             * array of Jx.Toolbar objects to put in the panel.  The position
             * of each toolbar is used to position the toolbar within the panel.
             */
            toolbars: [],
            type: 'panel',
            template: '<div class="jxPanel"><div class="jxPanelTitle"><img class="jxPanelIcon" src="'+base.aPixel.src+'" alt="" title=""/><span class="jxPanelLabel"></span><div class="jxPanelControls"></div></div><div class="jxPanelContentContainer"><div class="jxPanelContent"></div></div></div>',
            controlButtonTemplate: '<a class="jxButtonContainer jxButton"><img class="jxButtonIcon" src="'+base.aPixel.src+'"></a>'
        },
        classes: {
            domObj: 'jxPanel',
            title: 'jxPanelTitle',
            domImg: 'jxPanelIcon',
            domLabel: 'jxPanelLabel',
            domControls: 'jxPanelControls',
            contentContainer: 'jxPanelContentContainer',
            content: 'jxPanelContent'
        },
    
        pluginNamespace: 'Panel',
        /**
         * APIMethod: render
         * Initialize a new Jx.Panel instance
         */
        render : function(){
            this.parent();
    
            this.toolbars = this.options ? this.options.toolbars || [] : [];
    
            this.options.position = (this.options.height != undefined && this.options.height != null && 
                   (this.options.position === undefined || this.options.position == null)) ? 'relative' : 'absolute';
    
            if (this.options.image && this.domImg) {
                this.domImg.setStyle('backgroundImage', 'url('+this.options.image+')');
            }
            if (this.options.label && this.domLabel) {
                this.setLabel(this.options.label);
            }
    
            var tbDiv = new Element('div');
            this.domControls.adopt(tbDiv);
            this.toolbar = new Toolbar({parent:tbDiv, scroll: false});
    
            var that = this;
            if (this.options.menu) {
                this.menu = new Menu({
                    image: base.aPixel.src
                }, {
                  buttonTemplate: this.options.controlButtonTemplate
                });
                this.menu.domObj.addClass(this.options.menuClass);
                this.menu.domObj.addClass('jxButtonContentLeft');
                this.toolbar.add(this.menu);
            }
    
            //var b, item;
            if (this.options.collapse) {
                if (this.title) {
                  this.title.addEvent('dblclick', function() {
                    that.toggleCollapse();
                  });
                }
                this.colB = new Button({
                    template: this.options.controlButtonTemplate,
                    image: base.aPixel.src,
                    tooltip: {set:'Jx',key:'panel',value:'collapseTooltip'},
                    onClick: function() {
                        that.toggleCollapse();
                    }
                });
                this.colB.domObj.addClass(this.options.collapseClass);
                this.addEvents({
                    collapse: function() {
                        this.colB.setTooltip({set:'Jx',key:'panel',value:'expandTooltip'});
                    }.bind(this),
                    expand: function() {
                        this.colB.setTooltip({set:'Jx',key:'panel',value:'collapseTooltip'});
                    }.bind(this)
                });
                this.toolbar.add(this.colB);
                if (this.menu) {
                    this.colM = new MenuItem({
                        label: this.options.collapseLabel,
                        onClick: function() { that.toggleCollapse(); }
                    });
                    var item = this.colM
                    this.addEvents({
                        collapse: function() {
                            this.colM.setLabel({set:'Jx',key:'panel',value:'expandLabel'});
                        }.bind(this),
                        expand: function() {
                            this.colM.setLabel({set:'Jx',key:'panel',value:'collapseLabel'});
                        }.bind(this)
                    });
                    this.menu.add(item);
                }
            }
    
            if (this.options.maximize) {
                this.maxB = new Button({
                    template: this.options.controlButtonTemplate,
                    image: base.aPixel.src,
                    tooltip: {set:'Jx',key:'panel',value:'maximizeTooltip'},
                    onClick: function() {
                        that.maximize();
                    }
                });
                this.maxB.domObj.addClass(this.options.maximizeClass);
                this.addEvents({
                    maximize: function() {
                        this.maxB.setTooltip({set:'Jx',key:'panel',value:'restoreTooltip'});
                    }.bind(this),
                    restore: function() {
                        this.maxB.setTooltip({set:'Jx',key:'panel',value:'maximizeTooltip'});
                    }.bind(this)
                });
                this.toolbar.add(this.maxB);
                if (this.menu) {
                    this.maxM = new MenuItem({
                        label: this.options.maximizeLabel,
                        onClick: function() { that.maximize(); }
                    });
                    
                    this.addEvents({
                        maximize: function() {
                            this.maxM.setLabel({set:'Jx',key:'panel',value:'maximizeLabel'});
                        }.bind(this),
                        restore: function() {
                            this.maxM.setLabel({set:'Jx',key:'panel',value:'restoreLabel'});
                        }.bind(this)
                    });
                    this.menu.add(this.maxM);
                }
            }
    
            if (this.options.close) {
                this.closeB = new Button({
                    template: this.options.controlButtonTemplate,
                    image: base.aPixel.src,
                    tooltip: {set:'Jx',key:'panel',value:'closeTooltip'},
                    onClick: function() {
                        that.close();
                    }
                });
                this.closeB.domObj.addClass(this.options.closeClass);
                this.toolbar.add(this.closeB);
                if (this.menu) {
                    this.closeM = new MenuItem({
                        label: {set:'Jx',key:'panel',value:'closeLabel'},
                        onClick: function() {
                            that.close();
                        }
                    });
                    this.menu.add(item);
                }
    
            }
    
            if (this.options.id) {
                this.domObj.id = this.options.id;
            }
            var jxl = new Layout(this.domObj, Object.merge({},this.options, {propagate:false}));
            var layoutHandler = this.layoutContent.bind(this);
            jxl.addEvent('sizeChange', layoutHandler);
    
            if (this.options.hideTitle) {
                this.title.dispose();
            }
    
            if (typeOf(this.options.toolbars) == 'array') {
                this.options.toolbars.each(function(tb){
                    var position = tb.options.position;
                    var tbc = this.toolbarContainers[position];
                    if (!tbc) {
                        tbc = new Element('div');
                        new Layout(tbc);
                        this.contentContainer.adopt(tbc);
                        this.toolbarContainers[position] = tbc;
                    }
                    tb.addTo(tbc);
                }, this);
            }
    
            new Layout(this.contentContainer);
            
    
            if(this.shouldLoadContent()) {
              new Layout(this.content);
              this.loadContent(this.content);
            } else if (this.options.items !== null && this.options.items !== undefined) {
                this.content.destroy();
                delete this.options.template;
                this.container = new Container(Object.merge({},this.options,{
                    parent: this.contentContainer    
                }));
                this.content = document.id(this.container);
            } else {
                new Layout(this.content);
            }
    
            this.toggleCollapse(this.options.closed);
    
            this.addEvent('addTo', function() {
                this.domObj.resize();
            });
            
            this.resize();
    
        },
    
        /**
         * Method: layoutContent
         * the sizeChange event of the <Jx.Layout> that manages the outer container
         * is intercepted and passed through this method to handle resizing of the
         * panel contents because we need to do some calculations if the panel
         * is collapsed and if there are toolbars to put around the content area.
         */
        layoutContent: function() {
            var titleHeight = 0;
            var top = 0;
            var bottom = 0;
            var left = 0;
            var right = 0;
            var tbc;
            var tb;
            var position;
            if (!this.options.hideTitle && this.title.parentNode == this.domObj) {
                titleHeight = this.title.getMarginBoxSize().height;
            }
            var domSize = this.domObj.getContentBoxSize();
            if (domSize.height > titleHeight) {
                this.contentContainer.setStyle('display','block');
                this.options.closed = false;
                this.contentContainer.resize({
                    top: titleHeight,
                    height: null,
                    bottom: 0
                });
                ['left','right'].each(function(position){
                    if (this.toolbarContainers[position]) {
                        this.toolbarContainers[position].style.width = 'auto';
                    }
                }, this);
                ['top','bottom'].each(function(position){
                    if (this.toolbarContainers[position]) {
                        this.toolbarContainers[position].style.height = '';
                    }
                }, this);
                if (typeOf(this.options.toolbars) == 'array') {
                    this.options.toolbars.each(function(tb){
                        tb.update();
                        position = tb.options.position;
                        tbc = this.toolbarContainers[position];
                        // IE 6 doesn't seem to want to measure the width of
                        // things correctly
                        if (Browser.ie && Browser.ie4) {
                            var oldParent = document.id(tbc.parentNode);
                            tbc.style.visibility = 'hidden';
                            document.id(document.body).adopt(tbc);
                        }
                        var size = tbc.getBorderBoxSize();
                        // put it back into its real parent now we are done
                        // measuring
                        if (Browser.ie && Browser.ie4) {
                            oldParent.adopt(tbc);
                            tbc.style.visibility = '';
                        }
                        switch(position) {
                            case 'bottom':
                                bottom = size.height;
                                break;
                            case 'left':
                                left = size.width;
                                break;
                            case 'right':
                                right = size.width;
                                break;
                            case 'top':
                            default:
                                top = size.height;
                                break;
                        }
                    },this);
                }
                tbc = this.toolbarContainers['top'];
                if (tbc) {
                    tbc.resize({top: 0, left: left, right: right, bottom: null, height: top, width: null});
                }
                tbc = this.toolbarContainers['bottom'];
                if (tbc) {
                    tbc.resize({top: null, left: left, right: right, bottom: 0, height: bottom, width: null});
                }
                tbc = this.toolbarContainers['left'];
                if (tbc) {
                    tbc.resize({top: top, left: 0, right: null, bottom: bottom, height: null, width: left});
                }
                tbc = this.toolbarContainers['right'];
                if (tbc) {
                    tbc.resize({top: top, left: null, right: 0, bottom: bottom, height: null, width: right});
                }
                this.content.resize({top: top, bottom: bottom, left: left, right: right});
            } else {
                this.contentContainer.setStyle('display','none');
                this.options.closed = true;
            }
            this.fireEvent('sizeChange', this);
        },
    
        /**
         * Method: setLabel
         * Set the label in the title bar of this panel
         *
         * Parameters:
         * s - {String} the new label
         */
        setLabel: function(s) {
            this.domLabel.set('html',this.getText(s));
        },
        /**
         * Method: getLabel
         * Get the label of the title bar of this panel
         *
         * Returns:
         * {String} the label
         */
        getLabel: function() {
            return this.domLabel.get('html');
        },
        /**
         * Method: finalize
         * Clean up the panel
         */
        finalize: function() {
            this.domObj = null;
            this.deregisterIds();
        },
        /**
         * Method: maximize
         * Maximize this panel
         */
        maximize: function() {
            if (this.manager) {
                this.manager.maximizePanel(this);
            }
        },
        /**
         * Method: setContent
         * set the content of this panel to some HTML
         *
         * Parameters:
         * html - {String} the new HTML to go in the panel
         */
        setContent : function (html) {
            this.content.innerHTML = html;
            this.bContentReady = true;
        },
        /**
         * Method: setContentURL
         * Set the content of this panel to come from some URL.
         *
         * Parameters:
         * url - {String} URL to some HTML content for this panel
         */
        setContentURL : function (url) {
            this.bContentReady = false;
            this.setBusy(true);
            if (arguments[1]) {
                this.onContentReady = arguments[1];
            }
            if (url.indexOf('?') == -1) {
                url = url + '?';
            }
            var a = new Request({
                url: url,
                method: 'get',
                evalScripts:true,
                onSuccess:this.panelContentLoaded.bind(this),
                requestHeaders: ['If-Modified-Since', 'Sat, 1 Jan 2000 00:00:00 GMT']
            }).send();
        },
        /**
         * Method: panelContentLoaded
         * When the content of the panel is loaded from a remote URL, this
         * method is called when the ajax request returns.
         *
         * Parameters:
         * html - {String} the html return from xhr.onSuccess
         */
        panelContentLoaded: function(html) {
            this.content.innerHTML = html;
            this.bContentReady = true;
            this.setBusy(false);
            if (this.onContentReady) {
                window.setTimeout(this.onContentReady.bind(this),1);
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
                    this.contentContainer.setStyle('display','none');
                    var m = this.domObj.measure(function(){
                        return this.getSizes(['margin'],['top','bottom']).margin;
                    });
                    var height = m.top + m.bottom;
                    if (this.title.parentNode == this.domObj) {
                        height += this.title.getMarginBoxSize().height;
                    }
                    this.domObj.resize({height: height});
                    this.fireEvent('collapse', this);
                }
            } else {
                if (this.domObj.hasClass(this.options.collapsedClass)) {
                    this.domObj.removeClass(this.options.collapsedClass);
                    this.contentContainer.setStyle('display','block');
                    this.domObj.resize({height: this.options.height});
                    this.fireEvent('expand', this);
                }
            }
        },
    
        /**
         * Method: close
         * Closes the panel (completely hiding it).
         */
        close: function() {
            this.domObj.dispose();
            this.fireEvent('close', this);
        },
        
        changeText: function (lang) {
            this.parent();	//TODO: change this class so that we can access these properties without too much voodoo...
            if(this.closeB != undefined && this.closeB != null) {
                this.closeB.setTooltip({set:'Jx',key:'panel',value:'closeTooltip'});
            }
            if (this.closeM != undefined && this.closeM != null) {
                this.closeM.setLabel({set:'Jx',key:'panel',value:'closeLabel'});
            }
            if (this.maxB != undefined && this.maxB != null) {
                this.maxB.setTooltip({set:'Jx',key:'panel',value:'maximizeTooltip'});
            }
            if (this.colB != undefined && this.colB != null) {
                this.colB.setTooltip({set:'Jx',key:'panel',value:'collapseTooltip'});
            }
            if (this.colM != undefined && this.colM != null) {
                if (this.options.closed == true) {
                    this.colM.setLabel({set:'Jx',key:'panel',value:'expandLabel'});
                } else {
                    this.colM.setLabel({set:'Jx',key:'panel',value:'collapseLabel'});
                }
            }
          if (this.options.label && this.domLabel) {
              this.setLabel(this.options.label);
          }
          // TODO: is this the right method to call?
          // if toolbars left/right are used and localized, they may change their size..
          this.layoutContent();
        },
    
        /**
         * Method to be able to allow loadingOnDemand in subclasses but not here
         */
        shouldLoadContent: function() {
            if ((this.options.content !== undefined && this.options.content !== null) ||
                (this.options.contentURL !== undefined && this.options.contentURL !== null)) {
                return true;
            } else {
                return false; 
            }
          
        },
        
        resize: function(){
            this.domObj.resize();        
            if (instanceOf(this.container, Container)) {
                this.container.resize();
            }
        }
    });
    
    if (base.global) {
        base.global.Panel = panel;
    }
    
    return panel;
});