/*
---

name: Jx.Adaptor.Combo

description: Namespace for all Jx.Combo adaptors.

license: MIT-style license.

requires:
 - Jx.Adaptor

provides: [Jx.Adaptor.Combo]

...
*/
/**
 * Class: Jx.Adaptor.Combo
 * The namespace for all combo adaptors
 */

define("jx/adaptor/combo", ['../../base'], function(base){
    
    //This just needs to set the namespace in the global object
    if (base.global) {
        base.global.Adaptor.Combo = {};
    }
    
    return {};
});
