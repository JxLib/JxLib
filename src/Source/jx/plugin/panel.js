/*
---

name: Jx.Plugin.Panel

description: Namespace for Jx.Panel.Form plugins

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Plugin.Panel]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Panel
 * Jx.Panel.Form plugin namespace
 *
 *
 * License:
 * Copyright (c) 2011, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
define("jx/plugin/panel", ['../../base'], function(base){
    
    if (base.global) {
        base.global.Plugin.Panel = {};
    }
    return {};
});