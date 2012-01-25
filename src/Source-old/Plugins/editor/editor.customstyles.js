/*
---

name: Jx.Plugin.Editor.CustomStyles

description: Creates a drop down with styles that were passed in.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor
 - Jx.Field.Select

provides: [Jx.Plugin.Editor.CustomStyles]

...
 */
Jx.Plugin.Editor.CustomStyles = new Class({
    
    Extends: Jx.Plugin,
    Family: 'Jx.Plugin.Editor.CustomStyles',
    
    options: {
        styles: []
    },
    
    rules: [],
    
    name: 'customStyles',
    
    activeClass: '',
    
    attach: function (editor) {
        this.editor = editor;
        this.parent(editor);
        
        Array.from(this.options.styles).each(function(style){
            this.rules.push(style);
        },this);
        
        var items = [];
        items.push({value: '', text: '', selected: true});
        this.rules.each(function(rule){
            items.push({value: rule, text: rule});
        },this);
        
        //now create the combo button
        this.settingState = true;
        
        //Try with an actual Select
        this.button = new Jx.Field.Select({
            comboOpts: items,
            label: 'Choose a Style'
        });
        
        this.button.field.addEvent('change', this.command.bind(this));
        
        this.editor.toolbar.add(this.button);
        this.editor.toolbar.update();
        this.settingState = false;
    },
    
    detach: function () {
        this.button.destroy();
        this.parent(editor);
    },
    
    
    checkState: function (element) {
        if (!this.settingState) {
            for (i=0; i<this.rules.length; i++) {
                if (element.hasClass(this.rules[i])) {
                    this.settingState = true;
                    this.button.setValue(this.rules[i]);
                    this.settingState = false;
                    return;
                }
            }
            this.button.setValue('');
        }
    },
    
    command: function () {
        if (!this.settingState) {
            var klass = this.button.getValue();
            var node = this.editor.selection.getNode();
            if (klass !== '') { 
                node.removeClass(this.activeClass);
                if (node.hasClass(klass)) {
                    node.removeClass(klass);
                } else {
                    node.addClass(klass);
                }
                this.activeClass = klass;
            } else {
                this.rules.each(function(rule){
                    if (node.hasClass(rule)) {
                        node.removeClass(rule);
                    }
                },this);
            }
        }
    },
    
    setEnabled: function (state) {
        if (state) {
            this.button.enable();
        } else {
            this.button.disable();
        }
    }
    
});