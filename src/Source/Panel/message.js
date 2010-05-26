/*
---

name: Jx.Dialog.Message

description: A subclass of jx.Dialog for displaying messages w/a single OK button.

license: MIT-style license.

requires:
 - Jx.Dialog
 - Jx.Button
 - Jx.Toolbar.Item

provides: [Jx.Dialog.Message]

css:
 - message

...
 */
// $Id$
/**
 * Class: Jx.Dialog.Message
 *
 * Extends: <Jx.Dialog>
 *
 * Jx.Dialog.Message is an extension of Jx.Dialog that allows the developer
 * to display a message to the user. It only presents an OK button.
 * 
 * MooTools.lang Keys:
 * - message.okButton
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner
 *
 * This file is licensed under an MIT style license
 */
Jx.Dialog.Message = new Class({
    Family: 'Jx.Dialog.Message',
    Extends: Jx.Dialog,
    Binds: ['onOk'],
    options: {
        /**
         * Option: message
         * The message to display to the user
         */
        message: '',
        /**
         * Option: width
         * default width of message dialogs is 300px
         */
        width: 300,
        /**
         * Option: height
         * default height of message dialogs is 150px
         */
        height: 150,
        /**
         * Option: close
         * by default, message dialogs are closable
         */
        close: true,
        /**
         * Option: resize
         * by default, message dialogs are resizable
         */
        resize: true,
        /**
         * Option: collapse
         * by default, message dialogs are not collapsible
         */
        collapse: false,
        useKeyboard : true,
        keys : {
          'enter' : 'ok'
        }
    },
    /**
     * Method: render
     * constructs the dialog.
     */
    render: function () {
        //create content to be added
        this.buttons = new Jx.Toolbar({position: 'bottom',scroll:false});
        this.ok = new Jx.Button({
            label: this.getText({set:'Jx',key:'message',value:'okButton'}),
            onClick: this.onOk
        });
        this.buttons.add(this.ok);
        this.options.toolbars = [this.buttons];
        var type = Jx.type(this.options.message);
        if (type === 'string' || type == 'object' || type == 'element') {
            this.question = new Element('div', {
                'class': 'jxMessage'
            });
            switch(type) {
              case 'string':
              case 'object':
                this.question.set('html', this.getText(this.options.message));
              break;
              case 'element':
                this.options.message.inject(this.question);
                break;
            }
        } else {
            this.question = this.options.question;
            document.id(this.question).addClass('jxMessage');
        }
        this.options.content = this.question;
        if(this.options.useKeyboard) {
          var self = this;
          this.options.keyboardMethods.ok = function(ev) { ev.preventDefault(); self.close(); }
        }
        this.parent();
        if(this.options.useKeyboard) {
          this.keyboard.addEvents(this.getKeyboardEvents());
        }
    },
    /**
     * Method: onOk
     * Called when the OK button is clicked. Closes the dialog.
     */
    onOk: function () {
        this.close();
    },
    
    /**
     * APIMethod: setMessage
     * set the message of the dialog, useful for responding to language
     * changes on the fly.
     *
     * Parameters
     * message - {String} the new message
     */
    setMessage: function(message) {
      this.options.message = message;
      if ($defined(this.question)) {
        this.question.set('html',this.getText(message));
      }
    },
    
    /**
     * Method: createText
     * handle change in language
     */
    changeText: function (lang) {
      this.parent();
      if ($defined(this.ok)) {
        this.ok.setLabel({set:'Jx',key:'message',value:'okButton'});
      }
      if(Jx.type(this.options.message) === 'object') {
        this.question.set('html', this.getText(this.options.message))
      }
    }
});
