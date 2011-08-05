/*
---

name: Jx.Formatter

description: Base formatter object

license: MIT-style license.

requires:
 - Jx.Object

provides: [Jx.Formatter]

...
 */
 // $Id$
/**
 * Class: Jx.Formatter
 *
 * Extends: <Jx.Object>
 *
 * Base class used for specific implementations to coerce data into specific formats
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2009, Jon Bomgardner.
 *
 * This file is licensed under an MIT style license
 */
Jx.Formatter = new Class({
    Extends: Jx.Object,
    Family: 'Jx.Formatter',

    /**
     * APIMethod: format
     * Empty method that must be overridden by subclasses to provide
     * the needed formatting functionality.
     */
    format: function(){}
});