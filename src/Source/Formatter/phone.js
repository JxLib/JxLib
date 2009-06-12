

Jx.Formatter.Phone = new Class({
    
    Extends: Jx.Formatter,
    
    options: {
        useParens: true,
        separator: "-"
    },
    
    format: function(value){
        //first strip any non-numeric characters
        var sep = this.options.separator;
        var v = new String(value);
        v = v.replace(/[^0-9]/g, '');
        
        //now check the length. For right now, we only do US phone numbers
        var ret = '';
        if (v.length === 11) {
            //do everything including the leading 1
            ret = v.charAt(0);
            v = v.substring(1);
        } 
        if (v.length === 10) {
            //do the area code
            if (this.options.useParens){
                ret = ret + "(" + v.substring(0,3) + ")";
            } else {
                ret = ret + sep  + v.substring(0,3) + sep; 
            }
            v = v.substring(3);
        }
        //do the rest of the number
        ret = ret + v.substring(0,3) + sep + v.substring(3);
        return ret;
    }
});