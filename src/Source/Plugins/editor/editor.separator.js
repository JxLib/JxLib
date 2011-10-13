/*
---

name: Jx.Plugin.Editor.Separator

description:

license: MIT-style license.

requires:
 - jxlib/Jx.Toolbar.Separator
 - Jx.Plugin.Editor

provides: [Jx]

...
 */
Jx.Plugin.Editor.Separator = new Class({
    
    Family: 'Jx.Plugin.Editor.Separator',
    Extends: Jx.Plugin,
    name: 'separator',
    
    attach: function (editor) {
        this.button = new Jx.Toolbar.Separator();
        editor.toolbar.add(this.button);
    }
});