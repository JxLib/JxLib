/*
---

name: Jx.Plugin.Form

description: Namespace for Jx.Form plugins

license: MIT-style license.

requires:
 - Jx.Plugin

provides: [Jx.Plugin.Form]

...
 */
// $Id$
/**
 * Class: Jx.Plugin.Form
 * Form plugin namespace
 *
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
define("jx/plugin/form", function(require){
    var base = require("../../base");
    if (base.global) {
        base.global.Plugin.Form = {};
    }
});