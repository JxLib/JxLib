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
    /**
     * Constructor: Jx.Button.Tab
     * Create a new instance of Jx.Button.Tab.  Any layout options passed are used
     * to create a <Jx.Layout> for the tab content area.
     *
     * Parameters:
     * options - {Object} an object containing options that are used
     * to control the appearance of the tab.  See <Jx.Button>,
     * <Jx.ContentLoader::loadContent> and <Jx.Layout::Jx.Layout> for
     * valid options.
     */
    initialize : function( options) {
        this.parent($merge(options, {type:'Tab', toggle:true}));
        this.content = new Element('div', {'class':'tabContent'});
        new Jx.Layout(this.content, options);
        this.loadContent(this.content);
        var that = this;
        this.addEvent('down', function(){that.content.addClass('tabContentActive');});
        this.addEvent('up', function(){that.content.removeClass('tabContentActive');});
        
        if (this.options.close) {
            this.domObj.addClass('jxTabClose');
            var a = new Element('a', {
                'class': 'jxTabClose',
                events: {
                    'click': (function(){
                        this.fireEvent('close');                        
                    }).bind(this)
                } 
            });
            a.adopt(new Element('img', {
                src: Jx.aPixel.src,
                alt: '',
                title: ''
            }));
            this.domObj.adopt(a);
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