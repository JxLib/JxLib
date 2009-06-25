

Jx.Formatter.Currency = new Class({
    
    Extends: Jx.Formatter.Number,
    
    options: {
        sign: "$"
    },
    
    format : function (value) {

        this.options.precision = 2;

        value = this.parent(value);

        //check for negative
        var neg = false;
        if (value.contains('(') || value.contains('-')) {
            neg = true;
        }
    
        var ret;
        if (neg && !this.options.useParens) {
            ret = "-" + this.options.sign + value.substring(1, value.length);
        } else {
            ret = this.options.sign + value;
        }
    
        return ret;
    }
});