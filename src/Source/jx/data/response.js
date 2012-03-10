/*
---

name: Jx.Data.Response

description: The object used to return response information to strategies.

license: MIT-style license.

requires:
 - Jx.Data

provides: [Jx.Data.Response]

...
 */
// $Id$
/**
 * Class: Jx.Data.Response
 * 
 * Extends: <Jx.Object>
 * 
 * This class is used by the protocol to send information back to the calling 
 * strategy (or other caller).
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
define("jx/data/response", function(require, exports, module){
    
    var base = require("../../base"),
        jxObject = require("../object");
        
    var response = module.exports = new Class({

        Extends: jxObject,
        Family: 'Jx.Store.Response',
    
        /**
         * Property: code
         * This is the success/failure code
         */
        code: null,
        /**
         * Property: data
         * The data passed received by the protocol.
         */
        data: null,
        /**
         * Property: meta
         * The metadata received by the protocol
         */
        meta: null,
        /**
         * Property: requestType
         * one of 'read', 'insert', 'delete', or 'update'
         */
        requestType: null,
        /**
         * Property: requestParams
         * The parameters passed to the method that created this response
         */
        requestParams: null,
        /**
         * Property: request
         * the mootools Request object used in this operation (if one is actually
         * used)
         */
        request: null,
        /**
         * Property: error
         * the error data received from the called page if any.
         */
        error: null,
        /**
         * APIMethod: success
         * determines if this response represents a successful response
         */
        success: function () {
            return this.code > 0;
        }
    });
    
    response.WAITING = 2;
    response.SUCCESS = 1;
    response.FAILURE = 0;

    if (base.global) {
        base.global.Data.Response = module.exports;
    }
    
});