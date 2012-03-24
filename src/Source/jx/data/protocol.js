/*
---

name: Jx.Store.Protocol

description: Base class for all store protocols.

license: MIT-style license.

requires:
 - Jx.Data
 - Jx.Data.Response

provides: [Jx.Data.Protocol]

...
 */
// $Id$
/**
 * Class: Jx.Data.Protocol
 *
 * Extends: <Jx.Object>
 *
 * Base class for all protocols. Protocols are used for communication, primarily,
 * in Jx.Store. It may be possible to adapt them to be used in other places but
 * that is not their intended function.
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
define("jx/data/protocol", ['../../base','../object'],
       function(base, jxObject){
    
    var protocol = new Class({

        Extends: jxObject,
        Family: 'Jx.Store.Protocol',
    
        parser: null,
    
        options: {
          combine: {
            insert: false,
            update: false,
            'delete': false
          }
        },
    
        init: function () {
            this.parent();
    
            if (this.options.parser !== undefined && this.options.parser !== null) {
                this.parser = this.options.parser;
            }
        },
    
        cleanup: function () {
            this.parser = null;
            this.parent();
        },
    
        /**
         * APIMethod: read
         * Supports reading data from a location. Abstract method that subclasses
         * should implement.
         *
         * Parameters:
         * options - optional options for configuring the request
         */
        read: function(){},
        /**
         * APIMethod: insert
         * Supports inserting data from a location. Abstract method that subclasses
         * should implement.
         *
         * Parameters:
         * data - the data to use in creating the record in the form of one or more
         *        Jx.Store.Record instances
         * options - optional options for configuring the request
         */
        insert: function(){},
        /**
         * APIMethod: update
         * Supports updating data at a location. Abstract method that subclasses
         * should implement.
         *
         * Parameters:
         * data - the data to update (one or more Jx.Store.Record objects)
         * options - optional options for configuring the request
         */
        update: function(){},
        /**
         * APIMethod: delete
         * Supports deleting data from a location. Abstract method that subclasses
         * should implement.
         *
         * Parameters:
         * data - the data to update (one or more Jx.Store.Record objects)
         * options - optional options for configuring the request
         */
        "delete": function(){},
        /**
         * APIMethod: abort
         * used to abort any of the above methods (where practical). Abstract method
         * that subclasses should implement.
         */
        abort: function(){},
        /**
         * APIMethod: combineRequests
         * tests whether the protocol supports combining multiple records for a given operation
         * 
         * Parameter:
         * operation - {String} the operation to test for multiple record support
         * 
         * Returns {Boolean} true if the operation supports it, false otherwise
         */
        combineRequests: function(op) {
          return (this.options.combine[op] !== undefined && 
                  this.options.combine[op] !== null) ? this.options.combine[op] : false;
        }
    });
    
    if (base.global) {
        base.global.Data.Protocol = protocol;
    }
    
    return protocol;
    
});