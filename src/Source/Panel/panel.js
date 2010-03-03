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
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Panel = new Class({
    Family: 'Jx.Panel',
    Extends: Jx.Widget,

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

        /* Option: id
         * String, an id to assign to the panel's container
         */
        id: '',
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
        /* Option: collapseTooltip
         * the tooltip to display over the collapse button
         */
        collapseTooltip: 'Collapse/Expand Panel',
        /* Option: collapseLabel
         * the label to use for the collapse menu item
         */
        collapseLabel: 'Collapse',
        /* Option: expandLabel
         * the label to use for the expand menu item
         */
        expandLabel: 'Expand',
        /* Option: maximizeTooltip
         * the tooltip to display over the maximize button
         */
        maximizeTooltip: 'Maximize Panel',
        /* Option: maximizeLabel
         * the label to use for the maximize menu item
         */
        maximizeLabel: 'Maximize',
        /* Option: maximizeTooltip
         * the tooltip to display over the maximize button
         */
        restoreTooltip: 'Restore Panel',
        /* Option: maximizeLabel
         * the label to use for the maximize menu item
         */
        restoreLabel: 'Restore',
        /* Option: close
         * boolean, determine if the panel can be closed (hidden) by the user.
         * The application needs to provide a way to re-open the panel after
         * it is closed.  The closeable property extends to dialogs created by
         * floating panels.  This option puts a control in the title bar of
         * the panel.
         */
        close: false,
        /* Option: closeTooltip
         * the tooltip to display over the close button
         */
        closeTooltip: 'Close Panel',
        /* Option: closeLabel
         * the label to use for the close menu item
         */
        closeLabel: 'Close',
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
        template: '<div class="jxPanel"><div class="jxPanelTitle"><img class="jxPanelIcon" src="'+Jx.aPixel.src+'" alt="" title=""/><span class="jxPanelLabel"></span><div class="jxPanelControls"></div></div><div class="jxPanelContentContainer"><div class="jxPanelContent"></div></div></div>',
        controlButtonTemplate: '<a class="jxButtonContainer jxButton"><img class="jxButtonIcon" src="'+Jx.aPixel.src+'"></a>'
    },
    classes: new Hash({
        domObj: 'jxPanel',
        title: 'jxPanelTitle',
        domImg: 'jxPanelIcon',
        domLabel: 'jxPanelLabel',
        domControls: 'jxPanelControls',
        contentContainer: 'jxPanelContentContainer',
        content: 'jxPanelContent'
    }),

    /**
     * APIMethod: render
     * Initialize a new Jx.Panel instance
     */
    render : function(){
        this.parent();

        this.toolbars = this.options ? this.options.toolbars || [] : [];

        this.options.position = ($defined(this.options.height) && !$defined(this.options.position)) ? 'relative' : 'absolute';

        if (this.options.image && this.domImg) {
            this.domImg.setStyle('backgroundImage', 'url('+this.options.image+')');
        }
        if (this.options.label && this.domLabel) {
            this.domLabel.set('html',this.options.label);
        }

        var tbDiv = new Element('div');
        this.domControls.adopt(tbDiv);
        this.toolbar = new Jx.Toolbar({parent:tbDiv, scroll: false});

        var that = this;
        if (this.options.menu) {
            this.menu = new Jx.Menu({
                image: Jx.aPixel.src
            }, {
              buttonTemplate: this.options.controlButtonTemplate
            });
            this.menu.domObj.addClass(this.options.menuClass);
            this.menu.domObj.addClass('jxButtonContentLeft');
            this.toolbar.add(this.menu);
        }

        var b, item;
        if (this.options.collapse) {
            var colB = new Jx.Button({
                template: this.options.controlButtonTemplate,
                image: Jx.aPixel.src,
                tooltip: this.options.collapseTooltip,
                onClick: function() {
                    that.toggleCollapse();
                }
            });
            colB.domObj.addClass(this.options.collapseClass);
            this.addEvents({
                collapse: function() {
                    colB.setTooltip(this.options.expandTooltip);
                },
                expand: function() {
                    colB.setTooltip(this.options.collapseTooltip);
                }
            });
            this.toolbar.add(colB);
            if (this.menu) {
                item = new Jx.Menu.Item({
                    label: this.options.collapseLabel,
                    onClick: function() { that.toggleCollapse(); }
                });
                this.addEvents({
                    collapse: function() {
                        item.setLabel(this.options.expandLabel);
                    },
                    expand: function() {
                        item.setLabel(this.options.collapseLabel);
                    }
                });
                this.menu.add(item);
            }
        }

        if (this.options.maximize) {
            var maxB = new Jx.Button({
                template: this.options.controlButtonTemplate,
                image: Jx.aPixel.src,
                tooltip: this.options.maximizeTooltip,
                onClick: function() {
                    that.maximize();
                }
            });
            maxB.domObj.addClass(this.options.maximizeClass);
            this.addEvents({
                maximize: function() {
                    maxB.setTooltip(this.options.restoreTooltip);
                },
                restore: function() {
                    maxB.setTooltip(this.options.maximizeTooltip);
                }
            });
            this.toolbar.add(maxB);
            if (this.menu) {
                item = new Jx.Menu.Item({
                    label: this.options.maximizeLabel,
                    onClick: function() { that.maximize(); }
                });
                this.addEvents({
                    maximize: function() {
                        item.setLabel(this.options.restoreLabel);
                    },
                    restore: function() {
                        item.setLabel(this.options.maximizeLabel);
                    }
                });
                this.menu.add(item);
            }
        }

        if (this.options.close) {
            var closeB = new Jx.Button({
                template: this.options.controlButtonTemplate,
                image: Jx.aPixel.src,
                tooltip: this.options.closeTooltip,
                onClick: function() {
                    that.close();
                }
            });
            closeB.domObj.addClass(this.options.closeClass);
            this.toolbar.add(closeB);
            if (this.menu) {
                item = new Jx.Menu.Item({
                    label: this.options.closeLabel,
                    onClick: function() {
                        that.close();
                    }
                });
                this.menu.add(item);
            }

        }

        this.title.addEvent('dblclick', function() {
            that.toggleCollapse();
        });

        if (this.options.id) {
            this.domObj.id = this.options.id;
        }
        var jxl = new Jx.Layout(this.domObj, $merge(this.options, {propagate:false}));
        var layoutHandler = this.layoutContent.bind(this);
        jxl.addEvent('sizeChange', layoutHandler);

        if (this.options.hideTitle) {
            this.title.dispose();
        }

        if (Jx.type(this.options.toolbars) == 'array') {
            this.options.toolbars.each(function(tb){
                var position = tb.options.position;
                var tbc = this.toolbarContainers[position];
                if (!tbc) {
                    tbc = new Element('div');
                    new Jx.Layout(tbc);
                    this.contentContainer.adopt(tbc);
                    this.toolbarContainers[position] = tbc;
                }
                tb.addTo(tbc);
            }, this);
        }

        new Jx.Layout(this.contentContainer);
        new Jx.Layout(this.content);

        this.loadContent(this.content);

        this.toggleCollapse(this.options.closed);

        this.addEvent('addTo', function() {
            this.domObj.resize();
        });
        if (this.options.parent) {
            this.addTo(this.options.parent);
        }
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
            if (Jx.type(this.options.toolbars) == 'array') {
                this.options.toolbars.each(function(tb){
                    tb.update();
                    position = tb.options.position;
                    tbc = this.toolbarContainers[position];
                    // IE 6 doesn't seem to want to measure the width of
                    // things correctly
                    if (Browser.Engine.trident4) {
                        var oldParent = document.id(tbc.parentNode);
                        tbc.style.visibility = 'hidden';
                        document.id(document.body).adopt(tbc);
                    }
                    var size = tbc.getBorderBoxSize();
                    // put it back into its real parent now we are done
                    // measuring
                    if (Browser.Engine.trident4) {
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
        this.domLabel.set('html',s);
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
        if ($defined(state)) {
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
    }

});