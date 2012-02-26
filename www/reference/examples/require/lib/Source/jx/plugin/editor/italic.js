/*
---

name: Jx.Plugin.Editor.Italic

description: Button to italicize text in the editor.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Italic]

images:
 - text_italic.png

...
 */
define("jx/plugin/editor/italic", function(require, exports, module){
    
    var base = require("../../../base"),
        Button = require("./button");
        
    var italic = module.exports = new Class({
    
        Extends: Button,
        Family: 'Jx.Plugin.Editor.Italic',
        
        name: 'italic',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'Italic',
            toggle: true,
            shortcut: 'i',
            title: 'Italic'
        },
        
        tags: ['i','em'],
        css: {'font-style': 'italic'},
        action: 'italic',
        
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
                var s = this.editor.textarea.get('value')
                    .replace(/<embed([^>]*)>/gi, '<tmpembed$1>')
                    .replace(/<em([^>]*)>/gi, '<i$1>')
                    .replace(/<tmpembed([^>]*)>/gi, '<embed$1>')
                    .replace(/<\/em>/gi, '</i>');
                this.editor.textarea.set('value', s);
                return s;
            }
            return null;
        }
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Italic = module.exports;
    }
});