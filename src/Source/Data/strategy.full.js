/*
---

name: Jx.Store.Strategy.Full

description: Strategy for loading the full data set from a source.

license: MIT-style license.

requires:
 - Jx.Store.Strategy

provides: [Jx.Store.Strategy.Full]

...
 */
// $Id$
/**
 * Class: Jx.Store.Strategy.Full
 * 
 * Extends: <Jx.Store.Strategy>
 * 
 * This is a strategy for loading all of the data from a source at one time.
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */

Jx.Store.Strategy.Full = new Class({
    
    Extends: Jx.Store.Strategy,
    Family: "Jx.Store.Strategy.Full",
    
    name: 'full',
    
    options:{},
    /**
     * Method: init
     * initialize this strategy
     */
    init: function () {
        this.parent();
        this.bound.load = this.load.bind(this);
        this.bound.loadStore = this.loadStore.bind(this);
    },
    
    /**
     * APIMethod: activate
     * activates the strategy if it isn't already active.
     */
    activate: function () {
        this.parent();
        this.store.addEvent('storeLoad', this.bound.load);
        
    },
    
    /**
     * APIMethod: deactivate
     * deactivates the strategy if it is already active.
     */
    deactivate: function () {
        this.parent();
        this.store.removeEvent('storeLoad', this.bound.load);
        
    },
    /**
     * APIMethod: load
     * Called as the eventhandler for the store load method. Can also
     * be called independently to load data into the current store.
     * 
     * Parameters:
     * params - a hash of parameters to use in loading the data.
     */
    load: function (params) {
        this.store.fireEvent('storeBeginDataLoad', this.store);
        this.store.protocol.addEvent('dataLoaded', this.bound.loadStore);
        var opts = {};
        if (params !== undefined && params !== null) {
            opts.data = params;
        } else {
            opts.data = {};
        }
        opts.data.page = 0;
        opts.data.itemsPerPage = -1;
        this.store.protocol.read(opts);
    },
    
    /**
     * Method: loadStore
     * Called as the event handler for the protocol's dataLoaded event. Checks
     * the response for success and loads the data into the store if needed.
     * 
     * Parameters:
     * resp - the response from the protocol
     */
    loadStore: function (resp) {
        this.store.protocol.removeEvent('dataLoaded', this.bound.loadStore);
        if (resp.success()) {
            this.store.empty();
            if (resp.meta !== undefined && resp.meta !== null) {
                this.parseMetaData(resp.meta);
            }
            this.store.addRecords(resp.data);
            this.store.loaded = true;
            this.store.fireEvent('storeDataLoaded',this.store);
        } else {
            this.store.loaded = false;
            this.store.fireEvent('storeDataLoadFailed', [this.store, resp]);
        }
    },
    /**
     * Method: parseMetaData
     * Takes the meta property of the response object and puts the data 
     * where it belongs.
     * 
     * Parameters:
     * meta - the meta data object from the response.
     */
    parseMetaData: function (meta) {
        if (meta.columns !== undefined && meta.columns !== null) {
            this.store.options.columns = meta.columns;
        }
        if (meta.primaryKey !== undefined && meta.primaryKey !== null) {
            this.store.options.recordOptions.primaryKey = meta.primaryKey;
        }
    }
});