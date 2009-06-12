

Jx.Formatter.Number = new Class({
    
    Extends: Jx.Formatter,
    
    options: {
        decimalSeparator: '.',
        thousandsSeparator: ',',
        precision: 2,

        useParens: true,
        useThousands: true
    },
    
    format: function(value){
       //first set the decimal
        if ($type(value)==='string'){
            //remove commas from the string
            var p = value.split(',');
            value = p.join('');
            value = value.toFloat();
        }
        value = value.toFixed(this.options.precision);
        
        //split on the decimalSeparator
        var parts = value.split('.');
        var dec = true; 
        if (parts.length == 1){
            dec = false;
        }
        //check for negative
        var neg = false;
        var main;
        var ret = '';
        if (parts[0].contains('-')){
            neg = true;
            main = parts[0].substring(1,parts[0].length);
        } else {
            main = parts[0];
        }
        
        if (this.options.useThousands){
            var l = main.length;
            var left = l%3;
            j = 0;
            for (i = 0; i<l; i++){
                ret = ret + main.charAt(i);
                if (i == left-1 && i != l-1){
                    ret = ret + this.options.thousandsSeparator;
                } else if (i >= left){
                    j++;
                    if (j == 3 && i != l-1 ){
                        ret = ret + this.options.thousandsSeparator;
                        j = 0;
                    }
                }
                
            }
        } else {
            ret = parts[0];
        }
           
        
        
        if (dec) {
            ret = ret + this.options.decimalSeparator + parts[1];
        }
        if (neg && this.options.useParens){
            ret = "(" + ret + ")";
        } else if (neg && !this.options.useParens){
            ret = "-" + ret;
        } 
        
        
        return ret;
    }
});