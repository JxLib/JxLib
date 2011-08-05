/*
---

name: Jx.Tab

description: A single tab in a tab set.

license: MIT-style license.

requires:
 - Jx.Button
 - Jx.Layout

provides: [Jx.Tab]

css:
 - tab

images:
 - tab_top.png
 - tab_bottom.png
 - tab_left.png
 - tab_right.png
 - tab_close.png

...
 */
// $Id$
/**
 * Class: Jx.Tab
 *
 * Extends: <Jx.Button>
 *
 * A single tab in a tab set.  A tab has a label (displayed in the tab) and a
 * content area that is displayed when the tab is active.  A tab has to be
 * added to both a <Jx.TabSet> (for the content) and <Jx.Toolbar> (for the
 * actual tab itself) in order to be useful.  Alternately, you can use
 * a <Jx.TabBox> which combines both into a single control at the cost of
 * some flexibility in layout options.
 *
 * A tab is a <Jx.ContentLoader> and you can specify the initial content of
 * the tab using any of the methods supported by
 * <Jx.ContentLoader::loadContent>.  You can acccess the actual DOM element
 * that contains the content (if you want to dynamically insert content
 * for instance) via the <Jx.Tab::content> property.
 *
 * A tab is a button of type *toggle* which means that it emits the *up*
 * and *down* events.
 *
 * Example:
 * (code)
 * var tab1 = new Jx.Tab({
 *     label: 'tab 1',
 *     content: 'content1',
 *     onDown: function(tab) {
 *         console.log('tab became active');
 *     },
 *     onUp: function(tab) {
 *         console.log('tab became inactive');
 *     }
 * });
 * (end)
 *
 *
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Tab = new Class({
    Extends: Jx.Button,
    Family: 'Jx.Tab',
    /**
     * Property: content
     * {HTMLElement} The content area that is displayed when the tab is
     * active.
     */
    content: null,

    options: {
        /* Option: toggleClass
         * the CSS class to use for the button, 'jxTabToggle' by default
         */
        toggleClass: 'jxTabToggle',
        /* Option: pressedClass
         * the CSS class to use when the tab is pressed, 'jxTabPressed' by
         * default
         */
        pressedClass: 'jxTabPressed',
        /* Option: activeClass
         * the CSS class to use when the tab is active, 'jxTabActive' by 
         * default.
         */
        activeClass: 'jxTabActive',
        /* Option: activeTabClass
         * the CSS class to use on the content area of the active tab,
         * 'tabContentActive' by default.
         */
        activeTabClass: 'tabContentActive',
        /* Option: template
         * the HTML template for a tab
         */
        template: '<span class="jxTabContainer"><a class="jxTab"><span class="jxTabContent"><img class="jxTabIcon" src="'+Jx.aPixel.src+'"><span class="jxTabLabel"></span></span></a><a class="jxTabClose"></a></span>',
        /* Option: contentTemplate
         * the HTML template for a tab's content area
         */
        contentTemplate: '<div class="tabContent"></div>',
        /* Option: close
         * {Boolean} can the tab be closed by the user?  False by default.
         */
        close: false,
        /* Option: shouldClose
         * {Mixed} when a tab is closeable, the shouldClose option is checked
         * first to see if the tab should close.  You can provide a function
         * for this option that can be used to return a boolean value.  This
         * is useful if your tab contains something the user can edit and you
         * want to see if they want to discard the changes before closing.
         * The default value is true, meaning the tab will close immediately.
         * (code)
         * new Jx.Tab({
         *   label: 'test close',
         *   close: true,
         *   shouldClose: function() {
         *     return window.confirm('Are you sure?');
         *   }
         * });
         * (end)
         */
        shouldClose: true
    },
    /**
     * Property: classes
     * {<Hash>} a hash of object properties to CSS class names used to
     * automatically extract references to important DOM elements when
     * processing a widget template.  This allows developers to provide custom
     * HTML structures without affecting the functionality of widgets.
     */
    classes: {
        domObj: 'jxTabContainer',
        domA: 'jxTab',
        domImg: 'jxTabIcon',
        domLabel: 'jxTabLabel',
        domClose: 'jxTabClose',
        content: 'tabContent'
    },

    /**
     * Method: render
     * Create a new instance of Jx.Tab.  Any layout options passed are used
     * to create a <Jx.Layout> for the tab content area.
     */
    render : function( ) {
        this.options = Object.merge({},this.options, {toggle:true});
        this.parent();
        this.domObj.store('jxTab', this);
        this.processElements(this.options.contentTemplate, this.classes);
        new Jx.Layout(this.content, this.options);
        
        // load content onDemand if needed
        if(!this.options.loadOnDemand || this.options.active) {
          this.loadContent(this.content);
          // set active if needed
          if(this.options.active) {
            this.clicked();
          }
        }else{
          this.addEvent('contentLoaded', function(ev) {
            this.setActive(true);
          }.bind(this));
        }
        this.addEvent('down', function(){
            this.content.addClass(this.options.activeTabClass);
        }.bind(this));
        this.addEvent('up', function(){
            this.content.removeClass(this.options.activeTabClass);
        }.bind(this));

        //remove the close button if necessary
        if (this.domClose) {
            if (this.options.close) {
                this.domObj.addClass('jxTabClose');
                this.domClose.addEvent('click', (function(){
                  var shouldClose = true;
                  if (this.options.shouldClose !== undefined && this.options.shouldClose !== null) {
                    if (typeof this.options.shouldClose == 'function') {
                      shouldClose = this.options.shouldClose();
                    } else {
                      shouldClose = this.options.shouldClose;
                    }
                  }
                  if (shouldClose) {
                    this.fireEvent('close');
                  }
                }).bind(this));
            } else {
                this.domClose.dispose();
            }
        }
    },
    /**
     * APIMethod: clicked
     * triggered when the user clicks the button, processes the
     * actionPerformed event
     */
    clicked : function(evt) {
      if(this.options.enabled) {
        // just set active when caching is enabled
        if(this.contentIsLoaded && this.options.cacheContent) {
          this.setActive(true);
        // load on demand or reload content if caching is disabled
        }else if(this.options.loadOnDemand || !this.options.cacheContent){
          this.loadContent(this.content);
        }else{
          this.setActive(true);
        }
      }
    }
});

/* keep the old location temporarily */
Jx.Button.Tab = new Class({
  Extends: Jx.Tab,
  init: function() {
    if (console.warn) {
      console.warn('WARNING: Jx.Button.Tab has been renamed to Jx.Tab');
    } else {
      console.log('WARNING: Jx.Button.Tab has been renamed to Jx.Tab');
    }
    this.parent();
  }
});