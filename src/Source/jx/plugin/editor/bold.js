/*
---

name: Jx.Plugin.Editor.Bold

description: Button to mark sections in the editor as Bold.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button
 - Core/Browser

provides: [Jx.Plugin.Editor.Bold]

images:
 - text_bold.png

...
 */
define("jx/plugin/editor/bold", ['../../../base','./button'],
       function(base, Button){
    
    var bold = new Class({
    
        Extends: Button,
        Family: 'Jx.Plugin.Editor.Bold',
        
        name: 'bold',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'Bold',
            toggle: true,
            shortcut: 'b',
            title: 'Bold'
        },
        
        tags: ['b','strong'],
        css: {'font-weight': 'bold'},
        action: 'bold',
        
        init: function () {
            this.parent();
            this.bound = {
                setup: this.setup.bind(this),
                parse: this.setup.bind(this)
            };
        },
        
        attach: function (editor) {
            this.parent(editor);
            
            this.editor.addEvent('preToggleView', this.bound.parse);
            this.editor.addEvent('postPluginInit', this.bound.setup);
        },
        
        setup: function () {
            var result = this.parse();
            if (result) {
                this.editor.setContent(result);
            }
            this.editor.removeEvent('postPluginInit', this.bound.setup);
        },
        
        parse: function () {
            if (Browser.firefox) {
                var s = this.editor.textarea.get('value');
                s.replace(/<strong([^>]*)>/gi, '<b$1>');
                s.replace(/<\/strong>/gi, '</b>');
                this.editor.textarea.set('html', s);
                return s;
            }
            return null;
        }
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Bold = bold;
    }
    return bold;
});