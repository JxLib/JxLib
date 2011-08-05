/*
---

name: Jx.Store.Protocol.Local

description: Store protocol used to load data that is already present in a page as an object.

license: MIT-style license.

requires:
 - Jx.Store.Protocol

provides: [Jx.Store.Protocol.Local]

...
 */
// $Id$
/**
 * Class: Jx.Store.Protocol.Local
 * 
 * Extends: Jx.Store.Protocol
 * 
 * Based on the Protocol base class, the local protocol uses data that it is
 * handed upon instantiation to process requests.
 * 
 * Constructor Parameters:
 * data - The data to use 
 * options - any options for the base protocol class
 * 
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * inspired by the openlayers.org implementation of a similar system
 * 
 * This file is licensed under an MIT style license
 */
Jx.Store.Protocol.Local = new Class({
    
    Extends: Jx.Store.Protocol,
    Family: "Jx.Store.Protocol.Local",
    
    parameters: ['data', 'options'],
    /**
     * Property: data
     * The data passed to the protocol
     */
    data: null,
    
    init: function () {
        this.parent();
        
        if (this.options.data !== undefined && this.options.data !== null) {
            this.data = this.parser.parse(this.options.data);
        }
    },
    /**
     * APIMethod: read
     * process requests for data and sends the appropriate response via the
     * dataLoaded event.
     * 
     * Parameters: 
     * options - options to use in processing the request.
     */
    read: function (options) {
        var resp = new Jx.Store.Response(),
            page = options.data.page,
            itemsPerPage = options.data.itemsPerPage,
            start,
            end,
            data = this.data;

        resp.requestType = 'read';
        resp.requestParams = arguments;
        
        
        if (data !== undefined && data !== null) {
            if (page <= 1 && itemsPerPage === -1) {
                //send them all
                resp.data = data;
                resp.meta = { count: data.length };
            } else {
                start = (page - 1) * itemsPerPage;
                end = start + itemsPerPage;
                resp.data = data.slice(start, end);
                resp.meta = { 
                    page: page, 
                    itemsPerPage: itemsPerPage,
                    totalItems: data.length,
                    totalPages: Math.ceil(data.length/itemsPerPage)
                };
            }
            resp.code = Jx.Store.Response.SUCCESS;
            this.fireEvent('dataLoaded', resp);
        } else {
            resp.code = Jx.Store.Response.SUCCESS;
            this.fireEvent('dataLoaded', resp);
        }                        
    }
    
    /**
     * The following methods are not implemented as they make no sense for a
     * local protocol:
     * - create
     * - update 
     * - delete
     * - commit
     * - abort
     */
});