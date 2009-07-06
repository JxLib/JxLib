describe('Store without Data',{
	before: function(){
		object = new Jx.Store({
			columns: [{
			    name: 'col1',
			    type: 'alphanumeric'
			},{
			    name: 'col2',
			    type: 'alphanumeric'
			}]
		});
	},
	'count should be null': function(){
		value_of(object.count()).should_be_null();
	},
	'type should be Jx.Store': function(){
        value_of(Jx.type(object)).should_be('Jx.Store');
		value_of($type(object)).should_be('object');
	},
	'getPosition should return null': function(){
		value_of(object.getPosition()).should_be_null();
	},
	'moveTo should return null': function(){
		value_of(object.moveTo(3)).should_be_null();
	},
	'last should return null': function(){
		value_of(object.last()).should_be_null();
	},
	'first should return null': function(){
		value_of(object.first()).should_be_null();
	},
	'next should return null': function(){
		value_of(object.next()).should_be_null();
	},
	'hasNext should return null': function(){
		value_of(object.hasNext()).should_be_null();
	},
	'hasPrevious should return null': function(){
		value_of(object.hasPrevious()).should_be_null();
	},
	'previous should return null': function(){
		value_of(object.previous()).should_be_null();
	},
	'isDirty should return null': function(){
		value_of(object.isDirty()).should_be_null();
	},
	'new row with data should be added': function(){
		object.newRow({col1:'1val1', col2:'1val2' });
		value_of(object.count()).should_be(1);
		value_of(object.get('col1')).should_be('1val1');
	},
	'new row with no data should be added': function(){
		object.newRow();
		value_of(object.count()).should_be(1);
	},
	'getting column with index': function(){
		object.newRow({col1:'1val1', col2:'1val2' });
		value_of(object.get(1)).should_be('1val2');
	}
});


            
describe('Store with local data',{
	before: function(){
		var data = [
	            	{col1:'0col1', col2:'0col2', col3:'0col3', col4:'0col4', col5:'0col5'},
	            	{col1:'1col1', col2:'1col2', col3:'1col3', col4:'1col4', col5:'1col5'},
	            	{col1:'2col1', col2:'2col2', col3:'2col3', col4:'2col4', col5:'2col5'},
	            	{col1:'3col1', col2:'3col2', col3:'3col3', col4:'3col4', col5:'3col5'},
	            	{col1:'4col1', col2:'4col2', col3:'4col3', col4:'4col4', col5:'4col5'}
	            ];
		object = new Jx.Store({
			cols: ['col1','col2','col3','col4','col5']
		});
		object.load(data);
	},
	'item count should be 5': function(){
		value_of(object.count()).should_be(5);
	}

});