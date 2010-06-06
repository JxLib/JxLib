/*
---

name: Jx.Toolbar.Separator

description:  A helper class that represents a visual separator in a Jx.Toolbar.

license: MIT-style license.

requires:
 - Jx.Toolbar

provides: [Jx.Toolbar.Separator]

images:
 - toolbar_separator_h.png
 - toolbar_separator_v.png

...
 */
// $Id$
/**
 * Class: Jx.Toolbar.Separator
 *
 * Extends: <Jx.Object>
 *
 * A helper class that represents a visual separator in a <Jx.Toolbar>
 *
 * Example:
 * (code)
 * (end)
 *
 * License:
 * Copyright (c) 2008, DM Solutions Group Inc.
 *
 * This file is licensed under an MIT style license
 */
Jx.Toolbar.Separator = new Class({
    Family: 'Jx.Toolbar.Separator',
    Extends: Jx.Widget,
    /**
     * APIMethod: render
     * Create a new Jx.Toolbar.Separator
     */
    render: function() {
        this.domObj = new Element('li', {'class':'jxToolItem'});
        this.domSpan = new Element('span', {'class':'jxBarSeparator'});
        this.domObj.appendChild(this.domSpan);
    }
});
