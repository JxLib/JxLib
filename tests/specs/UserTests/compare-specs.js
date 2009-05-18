describe('Compare - alphanumeric', {
	'before': function() {
		object = new Jx.Compare();
	},
	'should be the same': function() {
		value_of(object.alphanumeric('jon','jon')).should_be(0);
	},
	'first less than second': function(){
		value_of(object.alphanumeric('jen','jon')).should_be(-1);
	},
	'first greater than second': function(){
		value_of(object.alphanumeric('rebecca','jon')).should_be(1);
	}
});

describe('Compare - numeric',{
	'before': function() {
		object = new Jx.Compare();
	},
	'should be the same': function() {
		value_of(object.numeric(1,1)).should_be(0);
	},
	'first less than second': function(){
		value_of(object.numeric(10,31)).should_be(-1);
	},
	'first greater than second': function(){
		value_of(object.alphanumeric(31,10)).should_be(1);
	}
});

describe('Compare - alphanumeric ignoring case',{
	'before': function() {
		object = new Jx.Compare();
	},
	'should be the same': function() {
		value_of(object.ignorecase('Jon','jon')).should_be(0);
	},
	'first less than second': function(){
		value_of(object.ignorecase('Jen','jon')).should_be(-1);
	},
	'first greater than second': function(){
		value_of(object.ignorecase('rebecca','JON')).should_be(1);
	}
});

describe('Compare - date',{
	'before': function() {
		object = new Jx.Compare();
	},
	'first less than second': function(){
		value_of(object.date('10/8/2008','10/9/2008')).should_be(-1);
	},
	'first greater than second': function(){
		value_of(object.date('10/9/2008','10/8/2008')).should_be(1);
	}
});