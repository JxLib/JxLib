/*
---

name: Jx.Toolbar.Container

description: A toolbar container contains toolbars.  This has an optional dependency on Fx.Tween that, if included, will allow toolbars that contain more elements than can be displayed to be smoothly scrolled left and right.  Without this optional dependency, the toolbar will jump in fixed increments rather than smoothly scrolling.

license: MIT-style license.

requires:
 - Jx.Toolbar
 - Jx.Button
 - Jx.Toolbar.Item
 - Jx.Store.Strategy.Paginate

css:
 - pager
 
provides: [Jx.Toolbar.Pager]

images:
 - 

...
 */
// $Id$
/**
 * Class: Jx.Toolbar.Pager
 *
 * Extends: <Jx.Toolbar>
 *
 * A toolbar designed to support paging. It requires a store to be passed in.
 * If the store doesn't have a paginate strategy it adds one.
 *
 *
 * License:
 * Copyright (c) 2011, Jonathan Bomgardner.
 *
 * This file is licensed under an MIT style license
 */


Jx.Toolbar.Pager = new Class({

    Extends: Jx.Toolbar,

    options: {
        store: null,
        paginationOptions: {
            ignoreExpiration: true
        },
        scroll: false
    },
    
    currentPage: 1,
    totalPages: 1,

    init: function () {
        
        
        if (this.options.store !== undefined) {
            this.store = this.options.store;
        } else {
            //can't do anything without a store!
            return;
        }

        this.strategy = this.store.getStrategy('paginate');

        if (this.strategy === undefined) {
            //it didn't have the strategy so let's add it
            var full = this.store.getStrategy('full');
            if (full) { full.deactivate(); }
            this.strategy = new Jx.Store.Strategy.Paginate(this.options.paginationOptions);
            this.store.addStrategy(this.strategy);
        }

        this.parent();
        
        this.store.addEvent('storeDataLoaded', this.updateToolbar.bind(this));
        
        
    },

    render: function () {
        //create the toolbar
        this.parent();

        this.counter = new Element('div', {
            html: 'Page: 1 of X',
            id: 'counter'
        });
        this.firstPage = new Jx.Button({
            id: 'start',
            label: '<<',
            //image: 'images/asterisk_orange.png',
            tooltip: 'jump to first page',
            onClick: function() { 
                this.strategy.setPage('first'); 
            }.bind(this)
        });
        this.previousPage = new Jx.Button({
            id: 'previous',
            label: '<',
            //image: 'images/asterisk_orange.png',
            tooltip: 'previous page',
            onClick: function() { 
                this.strategy.setPage('previous'); 
            }.bind(this)
        });
        this.nextPage = new Jx.Button({
            id: 'next',
            label: '>',
            //image: 'images/asterisk_orange.png',
            tooltip: 'next page',
            onClick: function() { 
                this.strategy.setPage('next');
            }.bind(this)
        });
        this.lastPage = new Jx.Button({
            id: 'last',
            label: '>>',
            //image: 'images/asterisk_orange.png',
            tooltip: 'jump to last page',
            onClick: function() { 
                this.strategy.setPage('last');
            }.bind(this)
        });
        this.add(this.firstPage, this.previousPage, new Jx.Toolbar.Item(this.counter), this.nextPage, this.lastPage);
        if (this.store.loaded) {
            this.updateToolbar();
        }
    },

    updateToolbar: function () {
        this.currentPage = this.strategy.getPage();
        this.totalPages = this.strategy.getNumberOfPages();
        this.counter.set('html','Page ' + this.currentPage + ' of ' + this.totalPages);
        //disable the buttons here based on page.
        if (this.currentPage == this.totalPages) {
            this.enableButtons(true, false);
        } else if (this.currentPage == 1) {
            this.enableButtons(false,true);
        } else {
            this.enableButtons(true,true);
        }
        this.update();
    },
    
    enableButtons: function (prev, next) {
        this.nextPage.setEnabled(next);
        this.lastPage.setEnabled(next);
        this.firstPage.setEnabled(prev);
        this.previousPage.setEnabled(prev);
    }
});