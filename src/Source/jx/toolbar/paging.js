/*
---

name: Jx.Toolbar.Pager

description: A basic implementation of a paging toolbar

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
define("jx/toolbar/pager", ['../../base','../toolbar','../button','./item','../store/strategy/paginate'],
       function(base, Toolbar, Button, Item, Paginate){
    
    var pager = new Class({

        Extends: Toolbar,
    
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
                this.strategy = new Paginate(this.options.paginationOptions);
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
            this.firstPage = new Button({
                id: 'start',
                label: '<<',
                //image: 'images/asterisk_orange.png',
                tooltip: 'jump to first page',
                onClick: function() { 
                    this.strategy.setPage('first'); 
                }.bind(this)
            });
            this.previousPage = new Button({
                id: 'previous',
                label: '<',
                //image: 'images/asterisk_orange.png',
                tooltip: 'previous page',
                onClick: function() { 
                    this.strategy.setPage('previous'); 
                }.bind(this)
            });
            this.nextPage = new Button({
                id: 'next',
                label: '>',
                //image: 'images/asterisk_orange.png',
                tooltip: 'next page',
                onClick: function() { 
                    this.strategy.setPage('next');
                }.bind(this)
            });
            this.lastPage = new Button({
                id: 'last',
                label: '>>',
                //image: 'images/asterisk_orange.png',
                tooltip: 'jump to last page',
                onClick: function() { 
                    this.strategy.setPage('last');
                }.bind(this)
            });
            this.add(this.firstPage, this.previousPage, new Item(this.counter), this.nextPage, this.lastPage);
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
    
    if (base.global) {
        base.global.Toolbar.Pager = pager;
    }
    
    return pager;
});