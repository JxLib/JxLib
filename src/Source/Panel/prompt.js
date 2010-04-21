// $Id$
/**
 * Class: Jx.Dialog.Prompt
 *
 * Extends: <Jx.Dialog>
 *
 * Jx.Dialog.Prompt is an extension of Jx.Dialog that allows the developer
 * to display a message to the user and ask for a text response. 
 * 
 * MooTools.lang Keys:
 * - prompt.okButton
 * - prompt.cancelButton
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner
 *
 * This file is licensed under an MIT style license
 */
Jx.Dialog.Prompt = new Class({

    Extends: Jx.Dialog,

    options: {
        /**
         * Option: prompt
         * The message to display to the user
         */
        prompt: '',
        /**
         * Option: startingValue
         * The startingvalue to place in the text box
         */
        startingValue: '',
        /**
         *
         */
        mandatory : false,
        /**
         * Jx.Dialog option defaults
         */
        width: 400,
        height: 200,
        close: true,
        resize: true,
        collapse: false,
        useKeyboard : true,
        keys : {
          'esc'   : 'abort',
          'enter' : 'confirm'
        }
    },
    /**
     * APIMethod: render
     * constructs the dialog.
     */
    render: function () {
        //create content to be added
        this.buttons = new Jx.Toolbar({position: 'bottom',scroll:false});
        this.ok = new Jx.Button({
                label: MooTools.lang.get('Jx','prompt').okButton,
                onClick: this.onClick.bind(this, 'Ok')
            });
        this.cancel = new Jx.Button({
                label: MooTools.lang.get('Jx','prompt').cancelButton,
                onClick: this.onClick.bind(this,'Cancel')
            });
        this.buttons.add(this.ok, this.cancel);
        this.options.toolbars = [this.buttons];
        
        this.field = new Jx.Field.Text({
            label: this.getText(this.options.prompt),
            value: this.options.startingValue,
            containerClass: 'jxPrompt'
        });
        this.options.content = document.id(this.field);
        
        if(this.options.useKeyboard) {
          var self = this;
          this.options.keyboardMethods.confirm = function(ev) { ev.preventDefault(); self.onClick(self.ok.getLabel()); }
          this.options.keyboardMethods.abort = function(ev) { ev.preventDefault(); self.onClick(self.cancel.getLabel()); }
        }
        this.parent();
        if(this.options.useKeyboard) {
          this.keyboard.addEvents(this.getKeyboardEvents());
        }
    },
    /**
     * Method: onClick
     * Called when the OK button is clicked. Closes the dialog.
     */
    onClick: function (value) {
        this.isOpening = false;
        this.hide();
        this.fireEvent('close', [this, value, this.field.getValue()]);
    },
    
    changeText: function (lang) {
    	this.parent();
    	if ($defined(this.ok)) {
    		this.ok.setLabel(MooTools.lang.get('Jx','prompt').okButton);
    	}
    	if ($defined(this.cancel)) {
    		this.cancel.setLabel(MooTools.lang.get('Jx','prompt').cancelButton);
    	}
      this.field.setLabel(this.options.prompt);
    }


});
