/**
 * Class: Jx.Dialog.Message
 * A generic message dialog. Can only click OK.
 */
Jx.Dialog.Message = new Class({
    
    Extends: Jx.Dialog,
    
    options: {
        message: '',
        width: 300,
        height: 150,
        close: true,
        resize: true,
        collapse: false
    },
    
    render: function () {
        //create content to be added
        this.buttons = new Jx.Toolbar({position: 'bottom'});
        this.buttons.add(
            new Jx.Button({
                label: 'Ok',
                onClick: this.onClick.bind(this, 'Ok')
            })
        );
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
    
    onClick: function (value) {
        this.close();
    }
    
    
});
