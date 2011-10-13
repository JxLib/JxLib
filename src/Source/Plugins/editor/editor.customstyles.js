/*
---

name: Jx.Plugin.Editor.CustomStyles

description:

license: MIT-style license.

requires:
 - Jx.Plugin.Editor
 - jxlib/Jx.Field.Select

provides: [Jx.Plugin.Editor.CustomStyles]

...
 */
Jx.Plugin.Editor.CustomStyles = new Class({
    
    Family: 'Jx.Plugin.Editor.CustomStyles',
    
    Extends: Jx.Plugin,
    
    rules: [],
    
    name: 'customStyles',
    
    activeClass: '',
    
    attach: function (editor) {
        this.editor = editor;
        this.parent(editor);
        
        //get the stylesheet object from the iframe doc
        var stylesheets = this.editor.doc.styleSheets;
        
        //find the one we want ('jxEditorStylesheet')
        $A(stylesheets).each(function(sheet){
            if (sheet.title == 'jxEditorStylesheet') {
                this.parseStyles.delay(1000,this,sheet);
            }
        },this);
        
        //add placeholder
        this.placeholder = new Element('div',{
            html: '&nbsp;',
            width: 10
        });
        this.editor.toolbar.add(this.placeholder);
    },
    
    detach: function () {
        this.button.destroy();
        this.parent(editor);
    },
    
    parseStyles: function (sheet) {
        var rules;
        if (Browser.Engine.trident) {
            rules = sheet.rules;
        } else {
            try {
                rules = sheet.cssRules;
            } catch (err) {
                console.log('couldn not get styles... waiting till they are available');
                this.parseStyles.delay(500,this,sheet);
                return;
            }
        }
        
        $A(rules).each(function(rule){
            if (rule.selectorText.test(/^\./)) {
                this.rules.push(rule.selectorText.slice(1));
            }
        },this);
        
        //create list of buttons
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
        
        this.button.domObj.replaces(this.placeholder);
        this.editor.toolbar.update();
        this.settingState = false;
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