/*
---

name: Jx.Plugin.Editor.Button

description: base class for all buttons that act on the editor

license: MIT-style license.

requires:
 - Jx.Plugin.Editor
 - Jx.Button

provides: [Jx.Plugin.Editor.Button]

...
 */

Jx.Plugin.Editor.Button = new Class({
    
    Extends: Jx.Plugin,
    Family: 'Jx.Plugin.Editor.Button',
    
    options: {
        image: '',
        toggle: false,
        shortcut: null,
        title: '',
        imageClass: '',
        prefix: 'jxEditorButton'
    },
    
    tags: null,
    css: null,
    action: null,
    
    attach: function (editor) {
        this.editor = editor;
        this.selection = editor.selection;
        this.parent(editor);
        
        var tt = this.options.title;
        tt = (this.options.shortcut !== null && this.options.shortcut !== undefined)?tt+" (ctrl-" + this.options.shortcut + ")":tt;
        
        this.button = new Jx.Button({
            toggle: this.options.toggle,
            image: this.options.image,
            imageClass: this.options.prefix + this.options.imageClass,
            tooltip: tt
        });
        
        this.editor.toolbar.add(this.button);
        
        if (this.options.toggle) {
            this.button.addEvents({
                down: this.command.bind(this),
                up: this.command.bind(this)
            });
        } else {
            this.button.addEvent('click', this.command.bind(this));
        }
        
        this.editor.keys[this.options.shortcut] = this;
            
    },
    
    detach: function () {
        this.button.destroy();
        this.parent(editor);
    },

    setState: function (state) {
        if (this.options.toggle) {
            this.settingState = true;
            this.button.setActive(state);
        }
        this.settingState = false;
    },
    
    getState: function () {
        if (this.options.toggle) {
            return this.button.isActive();
        } 
        return false;
    },
    
    checkState: function (element) {
        this.setState(false);
        if (this.action) {
            try {
                if (this.editor.doc.queryCommandState(this.action)) {
                    this.setState(true);
                    return;
                }
            } catch (e) {}
        }
        if (this.tags) {
            var el = element;
            do {
                var tag = el.tagName.toLowerCase();
                if (this.tags.contains(tag)) {
                    this.setState(true);
                    break;
                }
            } 
            while ( (el.tagName.toLowerCase() != 'body') && ((el = Element.getParent(el)) != null));
        }
        
        if (this.css) {
            var el = element;
            do {
                found = false;
                for (var prop in this.css) {
                    var css = this.css[prop];
                    if (Element.getStyle(el, prop).contains(css)){
                        this.setState(true);
                        found = true;
                    }
                }
                if (found || el.tagName.test(this.editor.blockEls)) break;
            }
            while ( (el.tagName.toLowerCase() != 'body') && ((el = Element.getParent(el)) != null));
        }
    },
    
    command: function () {
        if (!this.settingState) {
            this.editor.execute(this.action, false, false);
        }
    },
    
    setEnabled: function (state) {
        this.button.setEnabled(state);
    }
});