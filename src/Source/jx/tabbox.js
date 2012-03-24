/*
---

name: Jx.TabBox

description: A convenience class to handle the common case of a single toolbar directly attached to the content area of the tabs.

license: MIT-style license.

requires:
 - Jx.Toolbar
 - Jx.Panel
 - Jx.TabSet

provides: [Jx.TabBox]

images:
 - tabbar.png
 - tabbar_bottom.png
 - tabbar_left.png
 - tabbar_right.png

...
 */
// $Id$
/**
 * Class: Jx.TabBox
 *
 * Extends: <Jx.Widget>
 *
 * A convenience class to handle the common case of a single toolbar
 * directly attached to the content area of the tabs.  It manages both a
 * <Jx.Toolbar> and a <Jx.TabSet> so that you don't have to.  If you are using
 * a TabBox, then tabs only have to be added to the TabBox rather than to
 * both a <Jx.TabSet> and a <Jx.Toolbar>.
 *
 * Example:
 * (code)
 * var tabBox = new Jx.TabBox('subTabArea', 'top');
 *
 * var tab1 = new Jx.Button.Tab('Tab 1', {contentID: 'content4'});
 * var tab2 = new Jx.Button.Tab('Tab 2', {contentID: 'content5'});
 *
 * tabBox.add(tab1, tab2);
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
define("jx/tabbox", ['../base','./widget','./tab','./tabset','./panel','./toolbar'],
       function(base, Widget, Tab, TabSet, Panel, Toolbar){
    
    var tabBox = new Class({
        Extends: Widget,
        Family: 'Jx.TabBox',
        options: {
            /* Option: parent
             * a DOM element to add the tab box to
             */
            parent: null,
            /* Option: position
             * the position of the tab bar in the box, one of 'top', 'right',
             * 'bottom' or 'left'.  Top by default.
             */
            position: 'top',
            /* Option: height
             * a fixed height in pixels for the tab box.  If not set, it will fill
             * its container
             */
            height: null,
            /* Option: width
             * a fixed width in pixels for the tab box.  If not set, it will fill
             * its container
             */
            width: null,
            /* Option: scroll
             * should the tab bar scroll its tabs if there are too many to fit
             * in the toolbar, true by default
             */
            scroll:true
        },
    
        /**
         * Property: tabBar
         * {<Jx.Toolbar>} the toolbar for this tab box.
         */
        tabBar: null,
        /**
         * Property: tabSet
         * {<Jx.TabSet>} the tab set for this tab box.
         */
        tabSet: null,
        /**
         * APIMethod: render
         * Create a new instance of a TabBox.
         */
        render : function() {
            this.parent();
            this.tabBar = new Toolbar({
                position: this.options.position,
                scroll: this.options.scroll
            });
            this.panel = new Panel({
                toolbars: [this.tabBar],
                hideTitle: true,
                height: this.options.height,
                width: this.options.width,
                id: this.options.id
            });
            this.panel.domObj.addClass('jxTabBox');
            this.tabSet = new TabSet(this.panel.content);
            this.tabSet.addEvent('tabChange', function(tabSet, tab) {
                this.showItem(tab);
            }.bind(this.tabBar));
            /* when the panel changes size, the tab set needs to update
             * the content areas.
             */
             this.panel.addEvent('sizeChange', (function() {
                 this.tabSet.resizeTabBox();
                 this.tabBar.domObj.getParent('.jxBarContainer').retrieve('jxBarContainer').update();
                 this.tabBar.domObj.getParent('.jxBarContainer').addClass('jxTabBar'+this.options.position.capitalize());
             }).bind(this));
            /* when tabs are added or removed, we might need to layout
             * the panel if the toolbar is or becomes empty
             */
            this.tabBar.addEvents({
                add: (function() {
                    this.domObj.resize({forceResize: true});
                }).bind(this),
                remove: (function() {
                    this.domObj.resize({forceResize: true});
                }).bind(this)
            });
            /* trigger an initial resize when first added to the DOM */
            this.addEvent('addTo', function() {
                this.domObj.resize({forceResize: true});
            });
            
            this.panel.domObj.replaces(this.domObj);
            this.domObj = this.panel.domObj;
            this.domObj.store('jxWidget', this);
            this.domObj.resize({forceResize: true});
            
            //add items to this if we have them
            if (this.options.items !== undefined && this.options.items !== null) {
                Array.from(this.options.items).each(function(item){
                    //only tabs can be added to a tabbox
                    if (item['class'] == 'tab' || instanceOf(item['class'], Tab)) {
                        item.options = (item.options)?item.options:{};
                        var obj;                    
                        if (typeOf(item['class']) == 'string') {
                            obj = Tab;
                        } else {
                            obj = item['class'];
                        }
                        itemObj = new obj(item.options);
                        this.add(itemObj);
                        if (itemObj.resize) {
                            itemObj.resize()
                        } else if (document.id(itemObj).resize) {
                            document.id(itemobj).resize();
                        }
                    }
                },this);
            }
            
    
            
        },
        /**
         * Method: add
         * Add one or more <Jx.Tab>s to the TabBox.
         *
         * Parameters:
         * tab - {<Jx.Tab>} an instance of <Jx.Tab> to add to the tab box.  More
         * than one tab can be added by passing extra parameters to this method.
         * Unlike <Jx.TabSet>, tabs do not have to be added to a separate
         * <Jx.Toolbar>.
         */
        add : function() {
            this.tabBar.add.apply(this.tabBar, arguments);
            this.tabSet.add.apply(this.tabSet, arguments);
            Array.from(arguments).flatten().each(function(tab){
                tab.addEvents({
                    close: (function(){
                        this.tabBar.remove(tab);
                        this.tabSet.remove(tab);
                    }).bind(this)
                });
            }, this);
            return this;
        },
        /**
         * Method: remove
         * Remove a tab from the TabSet.
         *
         * Parameters:
         * tab - {<Jx.Tab>} the tab to remove.
         */
        remove : function(tab) {
            this.tabBar.remove(tab);
            this.tabSet.remove(tab);
        },
        
        resize: function(){
            this.domObj.resize({forceResize: true});
            this.tabSet.resize();
            this.tabBar.domObj.getParent('.jxBarContainer').retrieve('jxBarContainer').update();
            this.tabBar.domObj.getParent('.jxBarContainer').addClass('jxTabBar'+this.options.position.capitalize());
        }
    });
    
    if (base.global) {
        base.global.TabBox = tabBox;
    }
    
    return tabBox;
    
});
