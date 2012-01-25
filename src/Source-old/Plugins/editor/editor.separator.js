/*
---

name: Jx.Plugin.Editor.Separator

description: Separator for toolbar in editor 

license: MIT-style license.

requires:
 - Jx.Toolbar.Separator
 - Jx.Plugin.Editor

provides: [Jx.Plugin.Editor.Separator]

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