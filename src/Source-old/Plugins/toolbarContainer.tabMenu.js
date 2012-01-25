/*
---

name: Jx.Plugin.ToolbarContainer.TabMenu

description: Adds a menu of tabs to the toolbar container for easy access to all tabs.

license: MIT-style license.

requires:
 - Jx.Plugin.ToolbarContainer

provides: [Jx.Plugin.ToolbarContainer.TabMenu]

...
 */
/**
 * Class: Jx.Plugin.ToolbarContainer.TabMenu
 *
 * Extends: <Jx.Plugin>
 *
 * This plugin provides a menu of tabs in a toolbar (similar to the button in firefox at the end of the row of tabs).
 * It is designed to be used only when the toolbar contains tabs and only when the container is allowed to scroll. Also,
 * this plugin must be added directly to the Toolbar container. You can get a reference to the container for a
 * <Jx.TabBox> by doing
 *
 * (code)
 * var tabbox = new Jx.TabBox();
 * var toolbarContainer = document.id(tabBox.tabBar).getParent('.jxBarContainer').retrieve('jxBarContainer');
 * (end)
 *
 * You can then use the attach method to connect the plugin. Otherwise, you can add it via any normal means to a
 * directly instantiated Container.
 *
 * License:
 * Copyright (c) 2010, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Plugin.ToolbarContainer.TabMenu = new Class({

    Extends: Jx.Plugin,
    Family: 'Jx.Plugin.ToolbarContainer.TabMenu',

    Binds: ['addButton'],

    options: {
    },
    /**
     * Property: tabs
     * holds all of the tabs that we're tracking
     */
    tabs: [],

    init: function () {
        this.parent();
    },

    attach: function (toolbarContainer) {
        this.parent(toolbarContainer);

        this.container = toolbarContainer;

        //we will only be used if the container is allowed to scroll
        if (!this.container.options.scroll) {
            return;
        }

        this.menu = new Jx.Menu({},{
            buttonTemplate: '<span class="jxButtonContainer"><a class="jxButton jxButtonMenu jxDiscloser"><span class="jxButtonContent"><span class="jxButtonLabel"></span></span></a></span>'
        }).addTo(this.container.controls,'bottom');
        document.id(this.menu).addClass('jxTabMenuRevealer');
        this.container.update();

        //go through all of the existing tabs and add them to the menu
        //grab the toolbar...
        var tb = document.id(this.container).getElement('ul').retrieve('jxToolbar');
        tb.list.each(function(item){
            this.addButton(item);
        },this);

        //connect to the add event of the toolbar list to monitor the addition of buttons
        tb.list.addEvent('add',this.addButton);
    },

    detach: function () {
        this.parent();
    },

    addButton: function (item) {
        var tab;
        tab = (item instanceof Jx.Tab) ? item : document.id(item).getFirst().retrieve('jxTab');


        var l = tab.getLabel();
        if (l === undefined || l === null) {
            l = '';
        }
        var mi = new Jx.Menu.Item({
            label: l,
            image: tab.options.image,
            onClick: function() {
                if (tab.isActive()) {
                    this.container.scrollIntoView(tab);
                } else {
                    tab.setActive(true);
                }
            }.bind(this)
        });

        document.id(tab).store('menuItem', mi);

        tab.addEvent('close', function() {
            this.menu.remove(mi);
        }.bind(this));

        this.menu.add([mi]);
    }
});