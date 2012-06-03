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

define("jx/data", ['../base'], function(base){
   
    if (base.global) {
        base.global.Data = {};
    }
    
    return {};
});