// $Id$
/**
 * Class: Jx.Store.Protocol.Ajax
 * 
 * Extends: <Jx.Store.Protocol>
 * 
 * This protocol is used to send and receive data via AJAX. It also has the
 * capability to use a REST-style API.
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */
Jx.Store.Protocol.Ajax = new Class({
    
    Extends: Jx.Store.Protocol,
    
    options: {
        /**
         * Option: requestOptions
         * Options to pass to the mootools Request class
         */
        requestOptions: {
            method: 'get'
        },
        /**
         * Option: rest
         * Flag indicating whether this protocol is operating against a RESTful
         * web service
         */
        rest: false,
        /**
         * Option: urls
         * This is a hash of the urls to use for each method. If the rest 
         * option is set to true the only one needed will be the urls.rest.
         * These can be overridden if needed by passing an options object into
         * the various methods with the appropriate urls.
         */
        urls: {
            rest: null,
            insert: null,
            read: null,
            update: null,
            'delete': null
        }
    },
    
    init: function() {
        this.parent();
    },
    /**
     * APIMethod: read
     * Send a read request via AJAX
     * 
     * Parameters:
     * options - the options to pass to the request.
     */
    read: function (options) {
        var resp = new Jx.Store.Response();
        resp.requestType = 'read';
        resp.requestParams = arguments;
        
        var req = new Request({
            onSuccess: this.handleResponse.bind(this, resp)
        });
        
        resp.request = req;
        var temp = {};
        if (this.options.rest) {
            temp.url = this.options.urls.rest;
        } else {
            temp.url = this.options.urls.read;
        }
        
        //set up options
        var opts = $merge(this.options.requestOptions, temp, options);
        
        req.send(opts);
        
        resp.code = Jx.Store.Response.WAITING;
        
        return resp;
        
    },
    /**
     * Method: handleResponse
     * Called as an event handler for a returning request. Parses the request's
     * response into the actual response object.
     * 
     * Parameters: 
     * response - the response related to teh returning request.
     */
    handleResponse: function (response) {
        var req = response.request;
        var str = req.xhr.responseText;
        
        var data = this.parser.parse(str);
        if ($defined(data)) {
            if ($defined(data.success) && data.success) {
                if ($defined(data.data)) {
                    response.data = data.data;
                }
                if ($defined(data.meta)) {
                    response.meta = data.meta;
                }
                response.code = Jx.Store.Response.SUCCESS;
            } else {
                response.code = Jx.Store.Response.FAILURE;
                response.error = $defined(data.error) ? data.error : null;
            }
        } else {
            response.code = Jx.Store.Response.FAILURE;
        }
        this.fireEvent('dataLoaded', response);
    },
    /**
     * APIMethod: insert
     * Takes a Jx.Record instance and saves it
     * 
     * Parameters:
     * record - a Jx.Store.Record or array of them
     * options - options to pass to the request
     */
    insert: function (record, options) {
        if (this.options.rest) {
            options = $merge({url: this.options.urls.rest},options);
        } else {
            options = $merge({url: this.options.urls.insert},options);
        }
        this.options.requestOptions.method = 'POST';
        return this.run(record, options, "insert");
    },
    /**
     * APIMethod: update
     * Takes a Jx.Record and updates it via AJAX
     * 
     * Parameters:
     * record - a Jx.Record instance
     * options - Options to pass to the request
     */
    update: function (record, options) {
        if (this.options.rest) {
            options = $merge({url: this.options.urls.rest},options);
            this.options.requestOptions.method = 'PUT';
        } else {
            options = $merge({url: this.options.urls.update},options);
            this.options.requestOptions.method = 'POST';
        }
        return this.run(record, options, "update");
    },
    /**
     * APIMethod: delete
     * Takes a Jx.Record and deletes it via AJAX
     * 
     * Parameters:
     * record - a Jx.Record instance
     * options - Options to pass to the request
     */
    "delete": function (record, options) {
        if (this.options.rest) {
            options = $merge({url: this.options.urls.rest},options);
            this.options.requestOptions.method = 'DELETE';
        } else {
            options = $merge({url: this.options.urls['delete']},options);
            this.options.requestOptions.method = 'POST';
        }
        return this.run(record, options, "delete");
    },
    /**
     * APIMethod: abort
     * aborts the request related to the passed in response.
     * 
     * Parameters:
     * response - the response with the request to abort
     */
    abort: function (response) {
        response.request.cancel();
        
    },
    /**
     * Method: run
     * called by update, delete, and insert methods that actually does the work
     * of kicking off the request.
     * 
     * Parameters:
     * record - The Jx.Record to work with
     * options - Options to pass to the request
     * method - The name of the method calling this function
     */
    run: function (record, options, method) {
        
        this.options.requestOptions.data = {
            data: this.parser.encode(record)
        };
        
        var resp = new Jx.Store.Response();
        resp.requestType = method;
        resp.requestParams = [record, options, method];
        
        var req = new Request({
            onSuccess: this.handleResponse.bind(this, resp)
        });
        
        //set up options
        var opts = $merge(this.options.requestOptions, options);
        
        req.send(opts);
        
        resp.code = Jx.Store.Response.WAITING;
        resp.request = req;
        
        return resp;
    }
    
});