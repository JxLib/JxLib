/*
---

name: Jx.Toolbar.Item

description: A helper class to provide a container for something to go into a Jx.Toolbar.

license: MIT-style license.

requires:
 - Jx.Toolbar

provides: [Jx.Toolbar.Item]

...
 */
// $Id$
/**
 * Class: Jx.Toolbar.Item
 *
 * Extends: Object
 *
 * Implements: Options
 *
 * A helper class to provide a container for something to go into
 * a <Jx.Toolbar>.
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Toolbar.Item = new Class( {
    Extends: Jx.Widget,
    Family: 'Jx.Toolbar.Item',
    options: {
        /* Option: active
         * is this item active or not?  Default is true.
         */
        active: true,
        template: '<li class="jxToolItem"></li>'
    },
    classes: {
        domObj: 'jxToolItem'
    },

    parameters: ['jxThing', 'options'],

    /**
     * APIMethod: render
     * Create a new instance of Jx.Toolbar.Item.
     */
    render: function() {
        this.parent();
        var el = document.id(this.options.jxThing);
        if (el) {
            this.domObj.adopt(el);
        }
    }
});