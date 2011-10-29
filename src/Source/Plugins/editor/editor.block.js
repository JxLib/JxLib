/*
---

name: Jx.Plugin.Editor.Block

description: Creates block level tags in the editor

license: MIT-style license.

requires:
 - Jx.Field.Select
 - Jx.Plugin.Editor

provides: [Jx.Plugin.Editor.Block]


...
 */
Jx.Plugin.Editor.Block = new Class({
    
    Extends: Jx.Plugin,
    Family: 'Jx.Plugin.Editor.Block',
    
    name: 'block',
    
    tags: ['p','div','h1','h2','h3','h4','h5','h6','pre','address'],
    action: 'formatblock',
    
    attach: function (editor) {
        this.editor = editor;
        this.parent(editor);
        
        items = [{
            value: '',
            text: ''
        }];
        this.tags.each(function(tag){
            items.push({
                value: tag,
                text: tag
            });
        });
        
        this.button = new Jx.Field.Select({
            comboOpts: items,
            label: 'Block Type'
        });
        
        this.button.field.addEvent('change', this.command.bind(this));
       
        this.editor.toolbar.add(this.button);
    },
    
    detach: function () {
        this.button.destroy();
        this.parent(editor);
    },
    
    checkState: function (element) {
        this.setState(false);
        if (this.tags) {
            var el = element;
            do {
                var tag = el.tagName.toLowerCase();
                if (this.tags.contains(tag)) {
                    this.setState(true, tag);
                    break;
                }
            } 
            while ( (el.tagName.toLowerCase() != 'body') && ((el = Element.getParent(el)) != null));
        }
        
        
    },
    
    command: function () {
        if (!this.settingState) {
            var tag = this.button.getValue();
            if (tag !== '') {
                var block = '<' + this.button.getValue() + '>';
                this.editor.execute(this.action, false, block);
            } 
        }
    },
    
    setEnabled: function (state) {
        if (state) {
            this.button.enable();
        } else {
            this.button.disable();
        }
    },
    
    setState: function(flag, tag) {
        if (!flag) {
            tag = '';
        }
        this.button.setValue(tag);
    }
    
});