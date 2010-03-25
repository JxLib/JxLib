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
        collapse: false
    },
    /**
     * Method: render
     * constructs the dialog.
     */
    render: function () {
        //create content to be added
        this.buttons = new Jx.Toolbar({position: 'bottom',scroll:false});
        this.ok = new Jx.Button({
            label: MooTools.lang.get('Jx','message').okButton,
            onClick: this.onOk
        });
        this.buttons.add(this.ok);
        this.options.toolbars = [this.buttons];
        if (Jx.type(this.options.message) === 'string') {
            this.question = new Element('div', {
                'class': 'jxMessage',
                html: this.options.message
            });
        } else {
            this.question = this.options.question;
            $(this.question).addClass('jxMessage');
        }
        this.options.content = this.question;
        this.parent();
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
        this.question.set('html',message);
      }
    },
    
    /**
     * Method: createText
     * handle change in language
     */
    createText: function (lang) {
      this.parent();
      if ($defined(this.ok)) {
        this.ok.setLabel(MooTools.lang.get('Jx','message').okButton);
      }
    }
});
