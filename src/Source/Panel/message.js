// $Id$
/**
 * Class: Jx.Dialog.Message
 *
 * Extends: <Jx.Dialog>
 *
 * Jx.Dialog.Confirm is an extension of Jx.Dialog that allows the developer
 * to display a message to the user. It only presents an OK button.
 *
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner
 *
 * This file is licensed under an MIT style license
 */
Jx.Dialog.Message = new Class({

    Extends: Jx.Dialog,

    options: {
        /**
         * Option: message
         * The message to display to the user
         */
        message: '',
        /**
         * Jx.Dialog option defaults
         */
        width: 300,
        height: 150,
        close: true,
        resize: true,
        collapse: false
    },
    /**
     * APIMethod: render
     * constructs the dialog.
     */
    render: function () {
        //create content to be added
        this.buttons = new Jx.Toolbar({position: 'bottom'});
        this.ok = new Jx.Button({
            label: MooTools.lang.get('Jx','message').okButton,
            onClick: this.onClick.bind(this, 'Ok')
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
     * Method: onClick
     * Called when the OK button is clicked. Closes the dialog.
     */
    onClick: function (value) {
        this.close();
    },
    
    createText: function (lang) {
    	this.parent();
    	if ($defined(this.ok)) {
    		this.ok.setLabel(MooTools.lang.get('Jx','message').okButton);
    	}
    }


});
