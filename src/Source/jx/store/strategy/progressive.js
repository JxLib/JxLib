/*
---

name: Jx.Store.Strategy.Progressive

description: Strategy based on Strategy.Paginate but loads data progressively without removing old or curent data from the store.

license: MIT-style license.

requires:
 - Jx.Store.Strategy.Paginate

provides: [Jx.Store.Strategy.Progressive]

...
 */
/**
 * Class: Jx.Store.Strategy.Progressive
 *
 * Extends: <Jx.Store.Strategy.Paginate>
 *
 * Store strategy for progressively obtaining results in a store. You can
 * continually call nextPage() to get the next page and the store will retain
 * all current data. You can set a maximum number of records the store should
 * hold and whether it should dropRecords when that max is hit.
 *
 * License:
 * Copyright (c) 2010, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */

define("jx/store/strategy/progresive", ['../../../base','./paginate'],
       function(base, Paginate){
    
    var progressive = new Class({
    
        Extends: Paginate,
        Family: "Jx.Store.Strategy.Progressive",
        
        name: 'progressive',
        
        options: {
            /**
             * Option: maxRecords
             * The maximum number of records we want in the store at any one time.
             */
            maxRecords: 1000,
            /**
             * Option: dropRecords
             * Whether the strategy should drop records when the maxRecords limit 
             * is reached. if this is false then maxRecords is ignored and data is
             * always added to the bottom of the store. 
             */
            dropRecords: true
        },
        /**
         * Property: startingPage
         */
        startingPage: 0,
        /**
         * Property: maxPages
         */
        maxPages: null,
        /**
         * Property: loadedPages
         */
        loadedPages: 0,
        /**
         * Property: loadAt
         * Options are 'top' or 'bottom'. Defaults to 'bottom'.
         */
        loadAt: 'bottom',
        
        /**
         * Method: init
         * initialize this strategy
         */
        init: function () {
            this.parent();
            if (this.options.dropPages) {
                this.maxPages = Math.ceil(this.options.maxRecords/this.itemsPerPage);
            }
        },
        
        /**
         * Method: loadStore
         * Used to assist in the loading of data into the store. This is 
         * called as a response to the protocol finishing.
         * 
         *  Parameters:
         *  resp - the response object
         */
        loadStore: function (resp) {
            this.store.protocol.removeEvent('dataLoaded', this.bound.loadStore);
            if (resp.success()) {
                if (resp.meta !== undefined && resp.meta !== null) {
                    this.parseMetaData(resp.meta);
                }
                this.loadData(resp.data);
            } else {
                this.store.fireEvent('storeDataLoadFailed', this.store);
            }
        },
        
        /**
         * Method: loadData
         * This method does the actual work of loading data to the store. It is
         * called when either the protocol finishes or setPage() has the data and
         * it's not expired.
         * 
         * Parameters:
         * data - the data to load into the store.
         */
        loadData: function (data) {
            this.store.loaded = false;
            this.store.addRecords(data, this.loadAt);
            this.store.loaded = true;
            this.loadedPages++;
            this.store.fireEvent('storeDataLoaded',this.store);
        },
        
        /**
         * APIMethod: nextPage
         * Allows a caller (i.e. a paging toolbar) to load more data to the end of 
         * the store
         * 
         * Parameters:
         * params - a hash of parameters to pass to the request if needed.
         */
        nextPage: function (params) {
            if (params === undefined || params === null) {
                params = {};
            }
            if (this.options.dropRecords && this.totalPages > this.startingPage + this.loadedPages) {
                this.loadAt = 'bottom';
                if (this.loadedPages >= this.maxPages) {
                    //drop records before getting more
                    this.startingPage++;
                    this.store.removeRecords(0,this.itemsPerPage - 1);
                    this.loadedPages--;
                }
            }
            this.page = this.startingPage + this.loadedPages + 1;
            this.load(Object.merge({},this.params, params));
        },
        /**
         * APIMethod: previousPage
         * Allows a caller to move back to the previous page.
         *
         * Parameters:
         * params - a hash of parameters to pass to the request if needed.
         */
        previousPage: function (params) {
            //if we're not dropping pages there's nothing to do
            if (!this.options.dropRecords) {
                return;
            }
            
            if (params === undefined || params === null) {
                params = {};
            }
            if (this.startingPage > 0) {
                this.loadAt = 'top';
                if (this.loadedPages >= this.maxPages) {
                    //drop off end before loading previous pages
                    this.startingPage--;
                    this.store.removeRecords(this.options.maxRecords - this.itemsPerPage, this.options.maxRecords);
                    this.loadedPages--;
                }
                this.page = this.startingPage;
                this.load(Object.merge({},this.params, params));
            }
        }
    });
    
    if (base.global) {
        base.global.Store.Strategy.Progressive = progressive;
    }

    return progressive;
    
});