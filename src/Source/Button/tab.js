// $Id$
/**
 * Class: Jx.Button.Tab
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
 * var tab1 = new Jx.Button.Tab({
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
Jx.Button.Tab = new Class({
    Family: 'Jx.Button.Tab',
    Extends: Jx.Button,
    /**
     * Property: content
     * {HTMLElement} The content area that is displayed when the tab is active.
     */
    content: null,
    
    options: {
        toggleClass: 'jxTabToggle',
        pressedClass: 'jxTabPressed',
        activeClass: 'jxTabActive',
        activeTabClass: 'tabContentActive',
        template: '<span class="jxTabContainer"><a class="jxTab"><span class="jxTabContent"><img class="jxTabIcon"><span class="jxTabLabel"></span></span></a><a class="jxTabClose"></span>',
        contentTemplate: '<div class="tabContent"></div>'
    },
    classes: new Hash({
        domObj: 'jxTabContainer',
        domA: 'jxTab',
        domImg: 'jxTabIcon',
        domLabel: 'jxTabLabel',
        domClose: 'jxTabClose',
        content: 'tabContent'
    }),
    
    /**
     * APIMethod: render
     * Create a new instance of Jx.Button.Tab.  Any layout options passed are used
     * to create a <Jx.Layout> for the tab content area.
     */
    render : function( ) {
        this.options = $merge(this.options, {toggle:true});
        this.parent();
        this.domObj.store('jxTab', this);
        this.processElements(this.options.contentTemplate, this.classes);
        new Jx.Layout(this.content, this.options);
        this.loadContent(this.content);
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
                    this.fireEvent('close');
                }).bind(this));
            } else {
                this.domClose.dispose();
            }
        }
    },
    /**
     * Method: clicked
     * triggered when the user clicks the button, processes the
     * actionPerformed event
     */
    clicked : function(evt) {
        if (this.options.enabled) {
            this.setActive(true);            
        }
    }
});