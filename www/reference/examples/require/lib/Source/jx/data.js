/*
---

name: Jx.Data

description: namespace for all data components

license: MIT-style license.

requires:
 - Jx

provides: [Jx.Data]

...
 */

define("jx/data",function(require, exports, module){
   
    var base = require("../base");
   
    if (base.global) {
        base.global.Data = module.exports;
    }
});