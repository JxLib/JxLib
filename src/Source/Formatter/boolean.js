

Jx.Formatter.Boolean = new Class({
    
    Extends: Jx.Formatter,
    
    options: {
        'true': 'Yes',
        'false': 'No'
    },
    
    format : function (value) {
        var b = false;
        var t = $type(value);
        switch (t) {
        case 'string':
            if (value === 'true') {
                b = true;
            }
            break;
        case 'number':
            if (value !== 0) {
                b = true;
            }
            break;
        case 'boolean':
            b = value;
            break;
        default:
            b = true;
        }
        return b ? this.options['true'] : this.options['false'];
    }
    
});