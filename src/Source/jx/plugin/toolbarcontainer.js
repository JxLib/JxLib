/*
---

name: Jx.Plugin.ToolbarContainer

description: Namespace for Jx.Toolbar.Container

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Plugin.ToolbarContainer]

...
 */
/**
 * Class: Jx.Plugin.Toolbar
 * Toolbar plugin namespace
 *
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
define("jx/plugin/toolbarcontainer", ['../../base'], function(base){
    
    if (base.global) {
        base.global.Plugin.ToolbarContainer = {};
    }
    
    return {};
});