/*
---

name: Jx.Plugin.Editor.Link

description: Button to create a link in the editor.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button
 - Jx.Dialog.Message
 - Jx.Dialog.Prompt

provides: [Jx.Plugin.Editor.Link]

images:
 - link.png

...
 */
define("jx/plugin/editor/link", function(require, exports, module){
    
    var base = require("../../../base"),
        Button = require("./button"),
        Message = require("../../dialog/message"),
        Prompt = require("../../dialog/prompt");
        
    var link = module.exports = new Class({
    
        Extends: Button,
        Family: 'Jx.Plugin.Editor.Link',
        
        name: 'createlink',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'Link',
            toggle: false,
            shortcut: 'l',
            title: 'Create Hyperlink'
        },
        
        tags: ['a'],
        
        action: 'createlink',
        
        command: function () {
            if (this.editor.selection.isCollapsed()) {
                new Message({
                    message: 'Please select the text you wish to hyperlink.'
                }).open();
            } else {
                var text = this.editor.selection.getText();
                new Prompt({
                    prompt: 'Enter the web address you wish to link to. <br/> The text you selected to link to: "' + text + '"' ,
                    startingValue: 'http://',
                    onClose: this.finish.bind(this)
                }).open();
            }
        },
        
        finish: function (dialog, result, url) {
            if (result) {
                this.editor.execute('createlink', false, url.trim());
            }
        }
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Link = module.exports;
    }
});