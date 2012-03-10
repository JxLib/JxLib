/*
---

name: Jx.Plugin.DataView

description: Namespace for DataView plugins

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Plugin.DataView]
...
 */
/**
 * Namespace: Jx.Plugin.DataView
 * The namespace for all dataview plugins
 */
define("jx/plugin/dataview", function(require){
    var base = require("../../base");
    if (base.global) {
        base.global.Plugin.DataView = {};
    }
});