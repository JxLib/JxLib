/*
---

name: Jx.Plugin.Tree

description: Namespace for Jx.Tree plugins

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Plugin.Tree]

...
 */
/**
 * Class: Jx.Plugin.Tree
 * Jx.Tree plugin namespace
 *
 *
 * License:
 * Copyright (c) 2011, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
define("jx/plugin/tree", function(require){
    
    var base = require("../../base");
    if (base.global) {
        base.global.Plugin.Tree = {};
    }
});