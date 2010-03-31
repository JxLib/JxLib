// $Id$
/**
 * Class: Jx.Dialog.Confirm
 *
 * Extends: <Jx.Dialog>
 *
 * Jx.Dialog.Confirm is an extension of Jx.Dialog that allows the developer
 * to prompt their user with e yes/no question.
 * 
 * MooTools.lang Keys:
 * - confirm.affirmitiveLabel
 * - confirm.negativeLabel
 * 
 * License:
 * Copyright (c) 2009, Jonathan Bomgardner
 *
 * This file is licensed under an MIT style license
 */
Jx.Dialog.Confirm = new Class({

    Extends: Jx.Dialog,

    options: {
        /**
         * Option: question
         * The question to ask the user
         */
        question: '',
        /**
         * Jx.Dialog option defaults
         */
        width: 300,
        height: 150,
        close: false,
        resize: true,
        collapse: false
    },
    /**
     * APIMethod: render
     * creates the dialog
     */
    render: function () {
        //create content to be added
        //turn scrolling off as confirm only has 2 buttons.
        this.buttons = new Jx.Toolbar({position: 'bottom',scroll: false});
        
        this.ok = new Jx.Button({
            label: MooTools.lang.get('Jx','confirm').affirmitiveLabel,
            onClick: this.onClick.bind(this, MooTools.lang.get('Jx','confirm').affirmitiveLabel)
        }),
        this.cancel = new Jx.Button({
            label: MooTools.lang.get('Jx','confirm').negativeLabel,
            onClick: this.onClick.bind(this, MooTools.lang.get('Jx','confirm').negativeLabel)
        })
        this.buttons.add(this.ok, this.cancel);
        this.options.toolbars = [this.buttons];
        if (Jx.type(this.options.question) === 'string') {
            this.question = new Element('div', {
                'class': 'jxConfirmQuestion',
                html: this.options.question
            });
        } else {
            this.question = this.options.question;
            document.id(this.question).addClass('jxConfirmQuestion');
        }
        this.options.content = this.question;
        this.parent();
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
    
    createText: function (lang) {
    	this.parent();
    	if ($defined(this.ok)) {
    		this.ok.setLabel(MooTools.lang.get('Jx','confirm').affirmitiveLabel);
    	}
    	if ($defined(this.cancel)) {
    		this.cancel.setLabel(MooTools.lang.get('Jx','confirm').negativeLabel);
    	}
    	
    }


});