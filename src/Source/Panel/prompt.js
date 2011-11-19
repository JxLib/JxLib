/*
---

name: Jx.Dialog.Prompt

description: A subclass of Jx.dialog for prompting the user for text input.

license: MIT-style license.

requires:
 - Jx.Dialog
 - Jx.Button
 - Jx.Toolbar.Item
 - Jx.Field.Text

provides: [Jx.Dialog.Prompt]

...
 */
// $Id$
/**
 * Class: Jx.Dialog.Prompt
 *
 * Extends: <Jx.Dialog>
 *
 * Jx.Dialog.Prompt is an extension of Jx.Dialog that allows the developer
 * to display a message to the user and ask for a text response. 
 * 
 * Locale Keys:
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
    Family: "Jx.Dialog.Prompt",

    options: {
        /**
         * Option: prompt
         * The message to display to the user
         */
        prompt: '',
        /**
         * Option: startingValue
         * The startingvalue to place in the input field
         */
        startingValue: '',
        /**
         * Option: fieldOptions,
         * Object with various
         */
        fieldOptions: {
          type : 'Text',
          options: {},
          validate : true,
          validatorOptions: {
            validators: ['required'],
            validateOnBlur: true,
            validateOnChange : false
          },
          showErrorMsg : true
        },
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
          'esc'   : 'cancel',
          'enter' : 'ok'
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
                label: this.getText({set:'Jx',key:'prompt',value:'okButton'}),
                onClick: this.onClick.bind(this, true)
            });
        this.cancel = new Jx.Button({
                label: this.getText({set:'Jx',key:'prompt',value:'cancelButton'}),
                onClick: this.onClick.bind(this, false)
            });
        this.buttons.add(this.ok, this.cancel);
        this.options.toolbars = [this.buttons];

        var fOpts = this.options.fieldOptions;
            fOpts.options.label = this.getText(this.options.prompt);
            fOpts.options.value = this.options.startingValue;
            fOpts.options.containerClass = 'jxPrompt';

        if(Jx.type(fOpts.type) === 'string' && 
            Jx.Field[fOpts.type.capitalize()] != undefined &&  
            Jx.Field[fOpts.type.capitalize()] != null) {
          this.field = new Jx.Field[fOpts.type.capitalize()](fOpts.options);
        }else if(Jx.type(fOpts.type) === 'Jx.Object'){
          this.field = fOpts.type;
        }else{
          // warning and fallback?
          window.console ? console.warn("Field type does not exist %o, using Jx.Field.Text", fOpts.type) : false;
          this.field = new Jx.Field.Text(fOpts.options);
        }

        if(this.options.fieldOptions.validate) {
          this.validator = new Jx.Plugin.Field.Validator(this.options.fieldOptions.validatorOptions);
          this.validator.attach(this.field);
        }

        this.options.content = document.id(this.field);
        
        if(this.options.useKeyboard) {
          var self = this;
          this.options.keyboardMethods.ok     = function(ev) { ev.preventDefault(); self.onClick(true); }
          this.options.keyboardMethods.cancel = function(ev) { ev.preventDefault(); self.onClick(false); }
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
        if(value && this.validator != undefined && this.validator != null) {
          if(this.validator.isValid()) {
            this.isOpening = false;
            this.hide();
            this.fireEvent('close', [this, value, this.field.getValue()]);
          }else{
            //this.options.content.adopt(this.validator.getError());
            this.field.field.focus.delay(50, this.field.field);
            //todo: show error messages ?
          }
        }else{
          this.isOpening = false;
          this.hide();
          this.fireEvent('close', [this, value, this.field.getValue()]);
        }
    },
    
    changeText: function (lang) {
    	this.parent();
    	if (this.ok != undefined && this.ok != null) {
    		this.ok.setLabel({set:'Jx',key:'prompt',value:'okButton'});
    	}
    	if (this.cancel != undefined && this.cancel != null) {
    		this.cancel.setLabel({set:'Jx',key:'prompt',value:'cancelButton'});
    	}
      this.field.label.set('html', this.getText(this.options.prompt));
    }


});
