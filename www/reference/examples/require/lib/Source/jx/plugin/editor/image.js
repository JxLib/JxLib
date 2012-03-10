/*
---

name: Jx.Plugin.Editor.Image

description: Button to add an image to the editor.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor
 - Jx.Dialog.Prompt

provides: [Jx.Plugin.Editor.Image]

images:
 - image.png

...
 */
define("jx/plugin/editor/image", function(require, exports, module){
    
    var base = require("../../../base"),
        Button = require("./button"),
        Prompt = require("../../dialog/prompt");
        
    var image = module.exports = new Class({
    
        Extends: Button,
        Family: 'Jx.Plugin.Editor.Image',
        
        name: 'image',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'Image',
            toggle: false,
            shortcut: 'm',
            title: 'Insert Image'
        },
        
        tags: ['img'],
        
        action: 'insertimage',
        
        command: function () {
            new Prompt({
                prompt: 'Enter the address of the image:' ,
                onClose: this.finish.bind(this)
            }).open();
        },
        
        finish: function (dialog, result, url) {
            if (result) {
                this.editor.execute(this.action, false, url.trim());
            }
        }
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Image = module.exports;
    }
});