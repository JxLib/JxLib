/*
---

name: Jx.Data.Parser

description: Base class for all data parsers. Parsers are used by protocols to get data received or sent in the proper formats.

license: MIT-style license.

requires:
 - Jx.Data

provides: [Jx.Data.Parser]

...
 */
// $Id$
/**
 * Class: Jx.Data.Parser
 * 
 * Extends: <Jx.Object>
 * 
 * Base class for all parsers
 *
 * License: 
 * Copyright (c) 2009, Jon Bomgardner.
 * 
 * This file is licensed under an MIT style license
 */

define("jx/data/parser", function(require, exports, module){
    
    var base = require("../../base"),
        jxObject = require("../object");
        
    var parser = module.exports = new Class({
    
        Extends: jxObject,
        Family: 'Jx.Store.Parser',
        
        /**
         * APIMethod: parse
         * Reads data passed to it by a protocol and parses it into a specific
         * format needed by the store/record.
         * 
         * Parameters:
         * data - string of data to parse
         */
        parse: function(){},
        /**
         * APIMethod: encode
         * Takes an Jx.Record object and encodes it into a format that can be transmitted 
         * by a protocol.
         * 
         * Parameters:
         * object - an object to encode
         */
        encode: function(){}
    });
    
    if (base.global) {
        base.global.Data.Parser = module.exports;
    }
    
});