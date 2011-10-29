/*
---

name: Jx.Plugin.Editor.ButtonSet

description: Creates a toggle buittonset within the editor toolbar

license: MIT-style license.

requires:
 - Jx.Plugin.Editor
 - Jx.ButtonSet
 - Jx.Button

provides: [Jx.Plugin.Editor.ButtonSet]

...
 */
Jx.Plugin.Editor.ButtonSet = new Class({
    
    Extends: Jx.Plugin,
    Family: 'Jx.Plugin.Editor.ButtonSet',
    
    options: {
        /**
         * Option: buttons
         * an object of config objects keyed by the action
         * (code)
         * {
         *   action: { config },
         *   action: { config }
         * }
         * (end)
         */
        buttons: null     
    },
    
    buttonSet: null,
    
    buttons: [],
    
    prefix: 'jxEditorButton',
    
    init: function () {
        this.parent();
        this.buttonSet = new Jx.ButtonSet();
        
    },
    
    attach: function (editor) {
        this.parent(editor);
        this.editor = editor;
        Object.each(this.options.buttons, function(config, action){
            var button = new Jx.Button({
                toggle: true,
                image: config.image,
                imageClass: this.prefix + config.imageClass,
                tooltip: config.title
            });
            this.editor.toolbar.add(button);
            this.buttons.push(button);
            this.buttonSet.add(button);
            button.action = action;
            button.addEvents({
                down: this.command.bind(this, action),
                up: this.command.bind(this, action)
            });
            
        },this);
    },
    
    detach: function () {
        this.parent();
    },
    
    checkState: function (element) {
        this.buttons.each(function(button){
            this.setState(false, button);
            if (button.action) {
                try {
                    if (this.editor.doc.queryCommandState(button.action)) {
                        this.setState(true, button);
                        return;
                    }
                } catch (e) {}
            }
            if (button.options.tags) {
                var el = element;
                do {
                    var tag = el.tagName.toLowerCase();
                    if (button.options.tags.contains(tag)) {
                        this.setState(true, button);
                        break;
                    }
                } while ((el = Element.getParent(el)) != null);
            }
            
            if (button.options.css) {
                var el = element;
                do {
                    found = false;
                    for (var prop in button.options.css) {
                        var css = button.options.css[prop];
                        if (Element.getStyle(el, prop).contains(css)){
                            this.setState(true, button);
                            found = true;
                        }
                    }
                    if (found || el.tagName.test(this.editor.blockEls)) break;
                }
                while ((el = element.getParent(el)) != null);
            }
        }, this);
    },
    
    setState: function (state, button) {
        this.settingState = true;
        button.setActive(state);
        this.settingState = false;
    },
    
    command: function (action) {
        if (!this.settingState) {
            this.editor.execute(action, false, false);
        }
    },
    
    setEnabled: function (state) {
        this.buttons.each(function(button){
            button.setEnabled(state);
        },this);
    }
});