describe('common tests',{
	'Jx should be defined': function(){
		value_of($defined(Jx)).should_be_true();
	},
	'Family mutator check': function(){
		var c = new Class({
			Family: 'Jx.Widget'
		});
		newC = new c();
		value_of($type(newC)).should_be('Jx.Widget');
	},
    'Element.getNumber()':function() {
        var body = $(document.body);
        value_of(body.getNumber()).should_be(0);
        value_of(body.getNumber('letter')).should_be(0);
        value_of(body.getNumber(10)).should_be(10);
    }
});