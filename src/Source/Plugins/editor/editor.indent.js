/*
---

name: Jx.Plugin.Editor.Indent

description: Button to indent a list in the editor.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Indent]

images:
 - text_indent.png

...
 */
Jx.Plugin.Editor.Indent = new Class({
    
    Family: 'Jx.Plugin.Editor.Indent',
    
    Extends: Jx.Plugin.Editor.Button,
    
    name: 'indent',
    
    options: {
        image: Jx.aPixel.src,
        imageClass: 'Indent',
        toggle: false,
        title: 'Indent'
    },
    
    tags: ['blockquote'],
    action: 'indent'
    
});