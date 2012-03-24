/*
---

name: Jx.Dialog.Confirm

description: A subclass of Jx.dialog for asking a yes/no type question of the user.

license: MIT-style license.

requires:
 - Jx.Dialog
 - Jx.Button
 - Jx.Toolbar.Item

provides: [Jx.Dialog.Confirm]

css:
 - confirm

...
 */
// $Id$
/**
 * Class: Jx.Dialog.Confirm
 *
 * Extends: <Jx.Dialog>
 *
 * Jx.Dialog.Confirm is an extension of Jx.Dialog that allows the developer
 * to prompt their user with e yes/no question.
 * 
 * Locale Keys:
 * - confirm.affirmitiveLabel
 * - confirm.negativeLabel
 * 
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner
 *
 * This file is licensed under an MIT style license
 */
define("jx/dialog/confirm", ['../../base','../dialog','../toolbar','../button'],
       function(base, Dialog, Toolbar, Button){
    
    var confirm = new Class({

        Extends: Dialog,
        Family: "Jx.Dialog.Confirm",
    
        options: {
            /**
             * Option: question
             * The question to ask the user
             */
            question: '',
            /**
             * Jx.Dialog option defaults
             */
            useKeyboard : true,
            keys : {
              'esc'   : 'cancel',
              'enter' : 'ok'
            },
            width: 300,
            height: 150,
            close: false,
            resize: true,
            collapse: false,
            toolbarOptions: {
                align: "center",
                position: 'bottom',
                scroll: false
            }
        },
        /**
         * Reference to MooTools keyboards Class for handling keypress events like Enter or ESC
         */
        keyboard : null,
        /**
         * APIMethod: render
         * creates the dialog
         */
        render: function () {
            //create content to be added
            //turn scrolling off as confirm only has 2 buttons.
            this.buttons = new Toolbar(this.options.toolbarOptions);
    
            // COMMENT: returning boolean would be more what people expect instead of a localized label of a button?
            this.ok = new Button({
                label: this.getText({set:'Jx',key:'confirm',value:'affirmativeLabel'}),
                onClick: this.onClick.bind(this, true)
            }),
            this.cancel = new Button({
                label: this.getText({set:'Jx',key:'confirm',value:'negativeLabel'}),
                onClick: this.onClick.bind(this, false)
            })
            this.buttons.add(this.ok, this.cancel);
            this.options.toolbars = [this.buttons];
            var type = typeOf(this.options.question);
            if (type === 'string' || type === 'object' || type == 'element'){
                this.question = new Element('div', {
                    'class': 'jxConfirmQuestion'
                });
                switch(type) {
                  case 'string':
                  case 'object':
                    this.question.set('html', this.getText(this.options.question));
                  break;
                  case 'element':
                    this.options.question.inject(this.question);
                    break;
                }
            } else {
                this.question = this.options.question;
                document.id(this.question).addClass('jxConfirmQuestion');
            }
            this.options.content = this.question;
    
            // add default key functions
            if(this.options.useKeyboard) {
              var self = this;
              this.options.keyboardMethods.ok     = function(ev) { ev.preventDefault(); self.onClick(true); }
              this.options.keyboardMethods.cancel = function(ev) { ev.preventDefault(); self.onClick(false); }
            }
            this.parent();
            // add new ones
            if(this.options.useKeyboard) {
              this.keyboard.addEvents(this.getKeyboardEvents());
            }
        },
        /**
         * Method: onClick
         * called when any button is clicked. It hides the dialog and fires
         * the close event passing it the value of the button that was pressed.
         */
        onClick: function (value) {
            this.isOpening = false;
            this.hide();
            this.fireEvent('close', [this, value]);
        },
        
        changeText: function (lang) {
            this.parent();
            if (this.ok != undefined && this.ok != null) {
                this.ok.setLabel({set:'Jx',key:'confirm',value:'affirmativeLabel'});
            }
            if (this.cancel != undefined && this.cancel != null) {
                this.cancel.setLabel({set:'Jx',key:'confirm',value:'negativeLabel'});
            }
          if(typeOf(this.options.question) === 'object') {
            this.question.set('html', this.getText(this.options.question))
          }
        }
    
    });
    
    if (base.global) {
        base.global.Dialog.Confirm = confirm;
    }
    
    return confirm;
});