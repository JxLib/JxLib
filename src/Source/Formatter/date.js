


Jx.Formatter.Date = new Class({
    
    Extends: Jx.Formatter,
    
    options: {
        format: '%B %d, %Y'
    },
    
    format: function (value) {
        var d = Date.parse(value);
        return d.format(this.options.format);
    }
});