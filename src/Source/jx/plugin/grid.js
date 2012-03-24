/*
---

name: Jx.Plugin.Grid

description: Namespace for grid plugins

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Plugin.Grid]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Grid
 * Grid plugin namespace
 *
 *
 * License:
 * This version Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
define("jx/plugin/grid", ['../../base'], function(base){
    
    if (base.global) {
        base.global.Plugin.Grid = {};
    }
    return {};
});