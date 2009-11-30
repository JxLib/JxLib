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
    
    name: 'full',
    
    options:{},
    
    init: function () {
        this.parent();
        this.bound = {
            load: this.load.bind(this),
            loadStore: this.loadStore.bind(this)
        }
    },
    
    activate: function () {
        this.parent();
        this.store.addEvent('storeLoad', this.bound.load);
        
    },
    
    deactivate: function () {
        this.parent();
        this.store.removeEvent('storeLoad', this.bound.load);
        
    },
    /**
     * Method: load
     * Called as the eventhandler for the store load method. Can also
     * be called independently to load data into the current store.
     * 
     * Parameters:
     * params - a hash of parameters to use in loading the data.
     */
    load: function (params) {
        this.store.fireEvent('storeBeginDataLoad', this.store);
        this.store.protocol.addEvent('dataLoaded', this.bound.loadStore);
        var opts = {}
        if ($defined(params)) {
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
     * Called as the event hanlder for the protocol's dataLoaded event. Checks 
     * the response for success and loads the data into the store if needed.
     * 
     * Parameters:
     * resp - the response from the protocol
     */
    loadStore: function (resp) {
        this.store.protocol.removeEvent('dataLoaded', this.bound.loadStore);
        if (resp.success()) {
            this.store.empty();
            if ($defined(resp.meta)) {
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
        if ($defined(meta.columns)) {
            this.store.options.columns = meta.columns;
        }
        if ($defined(meta.primaryKey)) {
            this.store.options.recordOptions.primaryKey = meta.primaryKey;
        }
    }
});