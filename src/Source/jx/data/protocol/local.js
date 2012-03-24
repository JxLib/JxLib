/*
---

name: Jx.Data.Protocol.Local

description: Store protocol used to load data that is already present in a page as an object.

license: MIT-style license.

requires:
 - Jx.Data.Protocol

provides: [Jx.Data.Protocol.Local]

...
 */
// $Id$
/**
 * Class: Jx.Data.Protocol.Local
 * 
 * Extends: Jx.Data.Protocol
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
define("jx/data/protocol/local", ['../../../base','../protocol','../response'],
       function(base, Protocol, Response){
    
    var local = new Class({
    
        Extends: Protocol,
        Family: "Jx.Data.Protocol.Local",
        
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
            var resp = new Response(),
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
                resp.code = Response.SUCCESS;
                this.fireEvent('dataLoaded', resp);
            } else {
                resp.code = Response.SUCCESS;
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
    
    if (base.global) {
        base.global.Data.Protocol.Local = local;
    }
    
    return local;
    
});