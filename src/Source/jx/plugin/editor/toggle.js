/*
---

name: Jx.Plugin.Editor.Toggle

description: Button to toggle HTML view.

license: MIT-style license.

requires:
 - Jx.Plugin.Editor.Button

provides: [Jx.Plugin.Editor.Toggle]

images:
 - toggleview.png

...
 */
define("jx/plugin/editor/toggle", ['../../../base','./button'],
       function(base, Button){
    
    var toggle = new Class({
    
        Extends: Button,
        Family: 'Jx.Plugin.Editor.Toggle',
        
        name: 'toggle',
        
        options: {
            image: base.aPixel.src,
            imageClass: 'ToggleView',
            toggle: true,
            title: 'Toggle View'
        },
        
        command: function () {
            if (this.editor.mode == 'textarea') {
                this.editor.enableToolbar();
            } else {
                this.editor.disableToolbar();
            }
            this.editor.toggleView();
        },
        
        setEnabled: function(){}
        
    });
    
    if (base.global) {
        base.global.Plugin.Editor.Toggle = toggle;
    }
    
    return toggle;
});