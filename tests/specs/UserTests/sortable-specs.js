var comparator = new Jx.Compare();

var dataCopy = [
	new Hash({col0:2,col1:'ghj',col3:'10/22/08'}),
	new Hash({col0:5,col1:'asdga',col3:'10/05/08'}),
	new Hash({col0:3,col1:'hgers',col3:'10/07/08'}),
	new Hash({col0:6,col1:'dgreh',col3:'10/25/08'}),
	new Hash({col0:7,col1:'hjtjhf',col3:'10/22/08'}),
	new Hash({col0:2,col1:'bhtb',col3:'10/13/08'}),
	new Hash({col0:8,col1:'u8hhtej',col3:'10/06/08'}),
	new Hash({col0:9,col1:'jkjtrhg',col3:'10/08/08'}),
	new Hash({col0:0,col1:'jhehyj',col3:'10/16/08'}),
	new Hash({col0:1,col1:'yrhxbxh',col3:'10/09/08'}),
	new Hash({col0:23,col1:'qshny',col3:'10/30/08'})
];


describe('sorting store',{
	before: function(){
		data = dataCopy.slice();
		parser = new Jx.Store.Parser.JSON();
        protocol = new Jx.Store.Protocol.Local(data, {
            parser: parser
        });
        full = new Jx.Store.Strategy.Full();
        sort = new Jx.Store.Strategy.Sort({
            sortOnStoreEvents: null
        });
		object = new Jx.Store({
		    columns: [{
		        name: 'col0',
		        type: 'numeric'
		    },{
		        name: 'col1',
		        type: 'alphanumeric'
		    },{
		        name: 'col3',
		        type: 'date'
		    }],
		    protocol: protocol,
            record: Jx.Record,
            strategies: [ full, sort ]
		});
		object.load();
    },
	'numeric heap sort': function(){
		object.getStrategy('sort').sort('col0','heap');
		value_of(object.get('col0')).should_be(0);
	},
	'alphanumeric heap sort': function(){
		object.getStrategy('sort').sort('col1','heap');
		value_of(object.get('col1')).should_be('asdga');
	},
	'date heap sort': function(){
		object.getStrategy('sort').sort('col3','heap');
		value_of(object.get('col3')).should_be('10/05/08');
	},
	'numeric merge sort': function(){
		object.getStrategy('sort').sort('col0','merge');
		value_of(object.get('col0')).should_be(0);
	},
	'alphanumeric merge sort': function(){
		object.getStrategy('sort').sort('col1','merge');
		value_of(object.get('col1')).should_be('asdga');
	},
	'date merge sort': function(){
		object.getStrategy('sort').sort('col3','merge');
		value_of(object.get('col3')).should_be('10/05/08');
	},
	'numeric quick sort': function(){
		object.getStrategy('sort').sort('col1','quick');
		value_of(object.get('col1')).should_be('asdga');
	},
	'date quick sort': function(){
		object.getStrategy('sort').sort('col3','quick');
		value_of(object.get('col3')).should_be('10/05/08');
	}
});


describe('gouping store',{
	before: function(){	
        data2 = [
             new Hash({col0:2,col1:'ghj', col2: 'xx', col3:'10/22/08'}),
             new Hash({col0:5,col1:'asdga', col2: 'xx', col2: 'xx', col3:'10/05/08'}),
             new Hash({col0:3,col1:'hgers', col2: 'xx', col3:'10/07/08'}),
             new Hash({col0:6,col1:'dgreh',col2: 'xx',col3:'10/25/08'}),
             new Hash({col0:7,col1:'hjtjhf',col2: 'xx',col3:'10/22/08'}),
             new Hash({col0:2,col1:'bhtb',col2: 'xx',col3:'10/13/08'}),
             new Hash({col0:8,col1:'u8hhtej',col2: 'xx',col3:'10/06/08'}),
             new Hash({col0:9,col1:'jkjtrhg',col2: 'xx',col2: 'xx',col3:'10/08/08'}),
             new Hash({col0:0,col1:'jhehyj',col2: 'xx',col3:'10/16/08'}),
             new Hash({col0:1,col1:'yrhxbxh',col2: 'xx',col3:'10/09/08'}),
             new Hash({col0:8,col1:'qshny',col2: 'xx',col3:'9/30/08'}),
             new Hash({col0:23,col1:'dgreh',col2: 'xx',col3:'10/25/08'}),
             new Hash({col0:23,col1:'qshny',col2: 'xx',col3:'10/08/08'}),
             new Hash({col0:23,col1:'u8hhtej',col2: 'xx',col3:'10/30/08'}),
             new Hash({col0:23,col1:'u8hhtej',col2: 'xx',col3:'11/12/08'}),
             new Hash({col0:23,col1:'qshny',col2: 'xx',col3:'10/30/08'}),
             new Hash({col0:8,col1:'qshny',col2: 'xx',col3:'08/30/08'}),
             new Hash({col0:23,col1:'u8hhtej',col2: 'xx',col3:'07/30/08'}),
             new Hash({col0:23,col1:'qshny',col2: 'xx',col3:'10/30/08'}),
             new Hash({col0:23,col1:'dgreh',col2: 'xx',col3:'10/31/08'}),
             new Hash({col0:23,col1:'qshny',col2: 'xx',col3:'10/29/08'})
        ];
        parser = new Jx.Store.Parser.JSON();
        protocol = new Jx.Store.Protocol.Local(data2, {
            parser: parser
        });
        full = new Jx.Store.Strategy.Full();
        sort = new Jx.Store.Strategy.Sort({
            sortOnStoreEvents: null,
            sortCols: ['col0','col1','col3']
        });
		object = new Jx.Store({
		    columns: [{
                name: 'col0',
                type: 'numeric'
            },{
                name: 'col1',
                type: 'alphanumeric'
            },{
                name: 'col2',
                type: 'alphanumeric'
            },{
                name: 'col3',
                type: 'date'
            }],
			protocol: protocol,
            record: Jx.Record,
            strategies: [ full, sort ]
		});
		object.load();
		
	},
	
	'numeric heap grouping': function(){
	    object.getStrategy('sort').sort(null, 'heap');
		value_of(object.get('col0')).should_be(0);
		object.last();
		value_of(object.get('col3')).should_be('11/12/08');
	},
	'numeric merge grouping': function(){
	    object.getStrategy('sort').sort(null,'merge');
		value_of(object.get('col0')).should_be(0);
		object.last();
		value_of(object.get('col3')).should_be('11/12/08');
	},
	'numeric quick grouping': function(){
	    object.getStrategy('sort').sort(null,'quick');
		value_of(object.get('col0')).should_be(0);
		object.last();
		value_of(object.get('col3')).should_be('11/12/08');
	},
	'sort with one column with all of the same data': function(){
	    object.getStrategy('sort').sort(['col0','col2','col1','col3'],'merge');
        value_of(object.get('col0')).should_be(0);
        object.last();
        value_of(object.get('col3')).should_be('11/12/08');
	}
});