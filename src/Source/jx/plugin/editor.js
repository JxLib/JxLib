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
define("jx/plugin/editor", function(require){
    var base = require("../../base");
    if (base.global) {
        base.global.Plugin.Editor = {};
    }
});