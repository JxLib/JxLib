/*
---

name: Jx.Plugin.Editor

description: Editor plugins namespace. 

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Plugin.Editor]

...
 */
define("jx/plugin/editor", ['../../base'], function(base){
    
    if (base.global) {
        base.global.Plugin.Editor = {};
    }
    return {};
});