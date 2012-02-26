/*
---

name: Jx.Sort.Nativesort

description: An implementation of the Javascript native sorting with the Jx.Sort interface

license: MIT-style license.

requires:
 - Jx.Sort

provides: [Jx.Sort.Nativesort]

...
 */
// $Id$
/**
 * Class: Jx.Sort.Nativesort
 *
 * Extends: <Jx.Sort>
 *
 * Implementation of a native sort algorithm designed to work on <Jx.Store> data.
 *
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
define("jx/sort/nativesort", function(require, exports, module){
    
    var base = require("../../base"),
        Sort = require("../sort");
        
    var nativesort = module.exports = new Class({
        Extends : Sort,
        Family: 'Jx.Sort.Nativesort',
    
        name : 'nativesort',
    
        /**
         * Method: sort
         * Actually runs the sort on the data
         *
         * Returns:
         * the sorted data
         */
        sort : function () {
            this.fireEvent('start');
    
            var compare = function (a, b) {
                return this.comparator((this.data[a]).get(this.col), (this.data[b])
                        .get(this.col));
            };
    
            this.data.sort(compare);
            this.fireEvent('stop');
            return this.data;
        }
    
    });

    if (base.global) {
        base.global.Sort.Nativesort = module.exports;
    }
    
});