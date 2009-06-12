describe('number formatter',{
    '2 decimal places, positive': function(){
        object = new Jx.Formatter.Number({precision:2});
        value_of(object.format(12345.6789)).should_be('12,345.68');
    },
    'negative to three decimal places with parens': function(){
        object = new Jx.Formatter.Number({precision:3});
        value_of(object.format(-12345.6789)).should_be('(12,345.679)');
    },
    'negative to 1 decimal, no parens': function(){
        object = new Jx.Formatter.Number({precision: 1, useParens: false});
        value_of(object.format(-12345.6789)).should_be('-12,345.7');
    },
    'no thousands, no decimals': function(){
        object = new Jx.Formatter.Number({precision: 0, useThousands: false});
        value_of(object.format(12345.6789)).should_be('12346');
    },
    '2 decimal places, positive, as string': function(){
        object = new Jx.Formatter.Number({precision: 2});
        value_of(object.format("12,345.6789")).should_be('12,345.68');
    }
});

describe('currency formatter',{
    'format positive number': function(){
        object = new Jx.Formatter.Currency();
        var value = 12345.6789;
        value_of(object.format(value)).should_be('$12,345.68');
    },
    'format negative number with parens': function(){
        object = new Jx.Formatter.Currency();
        var value = -3456.78;
        value_of(object.format(value)).should_be('$(3,456.78)');
    },
    'format negative number without parens': function(){
        object = new Jx.Formatter.Currency({useParens: false});
        var value = -3456.78;
        value_of(object.format(value)).should_be('-$3,456.78');
    }
});