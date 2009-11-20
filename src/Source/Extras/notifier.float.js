Jx.Notifier.Float = new Class({
    
    Family: 'Jx.Notifier.Float',
    Extends: Jx.Notifier,
    
    options: {
        chrome: true,
        fx: null,
        size: {
            width: null,
            height: null
        },
        position: {
            horizontal: 'center center',
            vertical: 'top top',
            offsets: {}
        }
    },
    positionOptions: null,
    showing: false,

    render: function () {
        this.parent();
        
        this.domObj.setStyles({
            display: 'block',
            opacity: 0,
            width: this.options.size.width,
            position: 'absolute'
        });
        this.positionOpts = {
            element: this.domObj,
            relative: this.options.parent,
            options: this.options.position
        };
    }
});