/*
---

name: Jx.Field.Editor

description:

license: MIT-style license.

requires:
 - jxlib/Jx.Field
 - Jx.Editor

provides: [Jx.Field.Editor]

css:
 - field.editor


...
 */

Jx.Field.Editor = new Class({

    Extends: Jx.Field,
    Family: 'Jx.Field.Editor',

    options: {
        template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><span class="jxInputEditor"></span><span class="jxInputTag"></span></span>',
        editorOptions: {
            editorCssFile: 'css/editor.css',
            buttons: [
                ['bold','italic','underline','strikethrough','separator','alignment',
                      'separator','orderedlist','unorderedlist','indent','outdent'],
                ['undo','redo','separator','customStyles','block',
                      'separator', 'link','unlink', 'image','separator', 'toggle']
            ]
        }

    },

    type: 'Editor',

    render: function () {
        this.parent();

        this.options.editorOptions.content = this.options.value;
        this.options.editorOptions.textareaName = this.options.name;
        
        if (this.options.parent !== null && this.options.parent !== undefined) {
            this.createEditor();
        }

    },

    addTo: function (reference, where) {

        this.parent(reference, where);
        this.createEditor();
        
    },
    
    createEditor: function(){
        if (this.editor === undefined ||
            this.editor === null || typeOf(this.editor) !== 'Jx.Editor') {
            this.options.editorOptions.parent = document.id(this.field);
            this.editor = new Jx.Editor(this.options.editorOptions);
            this.editor.resize();
            this.field = this.editor.textarea;
            //grab change and blur events and pass them on for the editor
            this.editor.addEvents({
                'editorChange': function(){
                    this.fireEvent('change', this);
                }.bind(this),
                'editorBlur': function(){
                    this.fireEvent('blur',this);
                }.bind(this)
            });
        }
    },

    getValue: function () {
        return this.editor.saveContent().getContent();
    },

    setValue: function (value) {
        this.editor.setContent(value).saveContent();
    }

    
});