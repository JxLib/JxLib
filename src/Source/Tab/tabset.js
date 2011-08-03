/*
---

name: Jx.TabSet

description: A TabSet manages a set of Jx.Tab content areas by ensuring that only one of the content areas is visible (i.e. the active tab).

license: MIT-style license.

requires:
 - Jx.Tab

provides: [Jx.TabSet]

...
 */
// $Id$
/**
 * Class: Jx.TabSet
 *
 * Extends: <Jx.Object>
 *
 * A TabSet manages a set of <Jx.Tab> content areas by ensuring that only one
 * of the content areas is visible (i.e. the active tab).  TabSet does not
 * manage the actual tabs.  The instances of <Jx.Tab> that are to be managed
 * as a set have to be added to both a TabSet and a <Jx.Toolbar>.  The content
 * areas of the <Jx.Tab>s are sized to fit the content area that the TabSet
 * is managing.
 *
 * Example:
 * (code)
 * var tabBar = new Jx.Toolbar('tabBar');
 * var tabSet = new Jx.TabSet('tabArea');
 *
 * var tab1 = new Jx.Tab('tab 1', {contentID: 'content1'});
 * var tab2 = new Jx.Tab('tab 2', {contentID: 'content2'});
 * var tab3 = new Jx.Tab('tab 3', {contentID: 'content3'});
 * var tab4 = new Jx.Tab('tab 4', {contentURL: 'test_content.html'});
 *
 * tabSet.add(t1, t2, t3, t4);
 * tabBar.add(t1, t2, t3, t4);
 * (end)
 *
 * Events:
 * tabChange - the current tab has changed
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.TabSet = new Class({
    Extends: Jx.Object,
    Family: 'Jx.TabSet',
    /**
     * Property: tabs
     * {Array} array of tabs that are managed by this tab set
     */
    tabs: null,
    /**
     * Property: domObj
     * {HTMLElement} The HTML element that represents this tab set in the DOM.
     * The content areas of each tab are sized to fill the domObj.
     */
    domObj : null,
    /**
     * Parameters:
     * domObj - {HTMLElement} an element or id of an element to put the
     * content of the tabs into.
     * options - an options object, only event handlers are supported
     * as options at this time.
     */
    parameters: ['domObj','options'],

    /**
     * APIMethod: init
     * Create a new instance of <Jx.TabSet> within a specific element of
     * the DOM.
     */
    init: function() {
        this.tabs = [];
        this.domObj = document.id(this.options.domObj);
        if (!this.domObj.hasClass('jxTabSetContainer')) {
            this.domObj.addClass('jxTabSetContainer');
        }
        this.setActiveTabFn = this.setActiveTab.bind(this);
    },
    /**
     * Method: resizeTabBox
     * Resize the tab set content area and propogate the changes to
     * each of the tabs managed by the tab set.
     */
    resizeTabBox: function() {
        if (this.activeTab && this.activeTab.content.resize) {
            this.activeTab.content.resize({forceResize: true});
        }
    },

    /**
     * Method: add
     * Add one or more <Jx.Tab>s to the TabSet.
     *
     * Parameters:
     * tab - {<Jx.Tab>} an instance of <Jx.Tab> to add to the tab set.  More
     * than one tab can be added by passing extra parameters to this method.
     */
    add: function() {
        Array.from(arguments).flatten().each(function(tab) {
            if (tab instanceof Jx.Tab) {
                tab.addEvent('down',this.setActiveTabFn);
                tab.tabSet = this;
                this.domObj.appendChild(tab.content);
                this.tabs.push(tab);
                if ((!this.activeTab || tab.options.active) && tab.options.enabled) {
                    tab.options.active = false;
                    tab.setActive(true);
                }
            }
        }, this);
        return this;
    },
    /**
     * Method: remove
     * Remove a tab from this TabSet.  Note that it is the caller's responsibility
     * to remove the tab from the <Jx.Toolbar>.
     *
     * Parameters:
     * tab - {<Jx.Tab>} the tab to remove.
     */
    remove: function(tab) {
        if (tab instanceof Jx.Tab && this.tabs.indexOf(tab) != -1) {
            this.tabs.erase(tab);
            if (this.activeTab == tab) {
                if (this.tabs.length) {
                    this.tabs[0].setActive(true);
                }
            }
            tab.removeEvent('down',this.setActiveTabFn);
            tab.content.dispose();
        }
    },
    /**
     * Method: setActiveTab
     * Set the active tab to the one passed to this method
     *
     * Parameters:
     * tab - {<Jx.Tab>} the tab to make active.
     */
    setActiveTab: function(tab) {
        if (this.activeTab && this.activeTab != tab) {
            this.activeTab.setActive(false);
        }
        this.activeTab = tab;
        if (this.activeTab.content.resize) {
          this.activeTab.content.resize({forceResize: true});
        }
        this.fireEvent('tabChange', [this, tab]);
    }
});



