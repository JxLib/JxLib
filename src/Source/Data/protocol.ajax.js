/*
---

name: Jx.Store.Protocol.Ajax

description: Store protocol used to load data from a remote data source via Ajax.

license: MIT-style license.

requires:
 - Jx.Store.Protocol
 - more/Request.Queue

provides: [Jx.Store.Protocol.Ajax]

...
 */
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
    Family: "Jx.Store.Protocol.Ajax",

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
        },
        /**
         * Option: queue
         * an object containing options suitable for <Request.Queue>.
         * By default, autoAdvance is set to true and concurrent is set to 1.
         */
        queue: {
          autoAdvance: true,
          concurrent: 1
        },
        /**
         * Option: dataProperty
         * an string that represent the name of the property in the response that holds the data.
         * By default, the value is set to 'data'.
         */
        dataProperty: 'data'
    },
    
    queue: null,

    init: function() {
        if (Jx.Store.Protocol.Ajax.UniqueId === undefined ||
            Jx.Store.Protocol.Ajax.UniqueId === null) {
          Jx.Store.Protocol.Ajax.UniqueId = 1;
        }
      
        this.queue = new Request.Queue({
          autoAdvance: this.options.queue.autoAdvance,
          concurrent: this.options.queue.concurrent
        });
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
        var resp = new Jx.Store.Response(),
            temp = {},
            opts,
            req,
            uniqueId = Jx.Store.Protocol.Ajax.UniqueId();
        resp.requestType = 'read';
        resp.requestParams = arguments;


        // set up options
        if (this.options.rest) {
            temp.url = this.options.urls.rest;
        } else {
            temp.url = this.options.urls.read;
        }

        opts = Object.merge({},this.options.requestOptions, temp, options);
        opts.onSuccess = this.handleResponse.bind(this,resp);

        req = new Request(opts);
        resp.request = req;
        
        this.queue.addRequest(uniqueId, req);
        req.send();

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
        var req = response.request,
            str = req.xhr.responseText,
            data = this.parser.parse(str);
        if (data !== undefined && data !== null) {
            if (data.success !== undefined && data.success !== null && data.success) {
                if (data[this.options.dataProperty] !== undefined && data[this.options.dataProperty] !== null) {
                    response.data = data[this.options.dataProperty];
                }
                if (data.meta !== undefined && data.meta !== null) {
                    response.meta = data.meta;
                    
                } else {
                    response.meta = {};
                }
                
                response.meta.success = data.success;
                response.code = Jx.Store.Response.SUCCESS;
            } else {
                response.code = Jx.Store.Response.FAILURE;
                response.error = (data.error !== undefined && data.error !== null) ? data.error : null;
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
            options = Object.merge({},{url: this.options.urls.rest},options);
        } else {
            options = Object.merge({},{url: this.options.urls.insert},options);
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
            options = Object.merge({},{url: this.options.urls.rest},options);
            this.options.requestOptions.method = 'PUT';
        } else {
            options = Object.merge({},{url: this.options.urls.update},options);
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
            options = Object.merge({},{url: this.options.urls.rest},options);
            this.options.requestOptions.method = 'DELETE';
        } else {
            options = Object.merge({},{url: this.options.urls['delete']},options);
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
        var resp = new Jx.Store.Response(),
            opts,
            req,
            data,
            uniqueId = Jx.Store.Protocol.Ajax.UniqueId();
        
        if (Jx.type(record) == 'array') {
          if (!this.combineRequests(method)) {
            record.each(function(r) {
              this.run(r, options, method);
            }, this);
            return; //since everything should be processed now.
          } else {
            data = [];
            record.each(function(r) {
              data.push(this.parser.encode(r));
            }, this);
          }
        } else {
          data = this.parser.encode(record);
        }

        this.options.requestOptions.data = Object.merge({},this.options.requestOptions.data, {
          data: data
        });

        resp.requestType = method;
        resp.requestParams = [record, options, method];

        //set up options
        opts = Object.merge({},this.options.requestOptions, options);
        opts.onSuccess = this.handleResponse.bind(this,resp);
        req = new Request(opts);
        resp.request = req;
        this.queue.addRequest(uniqueId, req);
        req.send();

        resp.code = Jx.Store.Response.WAITING;

        return resp;
    }
    
});
/**
 * Method: uniqueId
 * returns a unique identifier to be used with queued requests
 */
Jx.Store.Protocol.Ajax.UniqueId = (function() {
  var uniqueId = 1;
  return function() {
    return 'req-'+(uniqueId++);
  };
})();
