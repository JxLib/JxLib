/**
 * Class: Jx.Dialog.Confirm
 * A generic confirmation dialog. Provides Yes/No type options
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
         * Option: affirmitiveLabel
         * The text to use for the affirmitive button. Defaults to 'Yes'.
         */
        affirmitiveLabel: 'Yes',
        /**
         * Option: negativeLabel
         * The text to use for the negative button. Defaults to 'No'.
         */
        negativeLabel: 'No',
        width: 300,
        height: 150,
        close: false,
        resize: true,
        collapse: false
    },
    
    render: function () {
        //create content to be added
        this.buttons = new Jx.Toolbar({position: 'bottom'});
        this.buttons.add(
            new Jx.Button({
                label: this.options.affirmitiveLabel,
                onClick: this.onClick.bind(this, this.options.affirmitiveLabel)
            }),
            new Jx.Button({
                label: this.options.negativeLabel,
                onClick: this.onClick.bind(this, this.options.negativeLabel)
            })
        );
        this.options.toolbars = [this.buttons];
        if (Jx.type(this.options.question) === 'string') {
            this.question = new Element('div', {
                'class': 'jxConfirmQuestion',
                html: this.options.question
            });
        } else {
            this.question = this.options.question;
            $(this.question).addClass('jxConfirmQuestion');
        }
        this.options.content = this.question;
        this.parent();
    },
    
    onClick: function (value) {
        this.isOpening = false;
        this.hide();
        this.fireEvent('close', [this, value]);
    }
    
    
});