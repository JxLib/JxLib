describe('Merge Sort',{
	before: function(){
		data = [
        	new Hash({col0:2,col1:'ghj',col3:'10/22/08'}),
        	new Hash({col0:5,col1:'asdga',col3:'10/5/08'}),
        	new Hash({col0:3,col1:'hgers',col3:'10/7/08'}),
        	new Hash({col0:6,col1:'dgreh',col3:'10/25/08'}),
        	new Hash({col0:7,col1:'hjtjhf',col3:'10/22/08'}),
        	new Hash({col0:2,col1:'bhtb',col3:'10/13/08'}),
        	new Hash({col0:8,col1:'u8hhtej',col3:'10/6/08'}),
        	new Hash({col0:9,col1:'jkjtrhg',col3:'10/8/08'}),
        	new Hash({col0:0,col1:'jhehyj',col3:'10/16/08'}),
        	new Hash({col0:1,col1:'yrhxbxh',col3:'10/9/08'}),
        	new Hash({col0:23,col1:'qshny',col3:'10/30/08'})
        ];
		comparator = new Jx.Compare();
	},
	'numeric sort': function(){
		object = new Jx.Sort.Mergesort(data,comparator.numeric.bind(comparator),'col0',{timeIt: true});
		d = object.sort();
		console.log('mergesort - numeric : '+object.dif+'ms');
		value_of(d[0]['col0']).should_be(0);
	},
	'alphanumeric sort': function(){
		object = new Jx.Sort.Mergesort(data,comparator.alphanumeric.bind(comparator),'col1',{timeIt: true});
		d = object.sort();
		console.log('mergesort - alphanumeric : '+object.dif+'ms');
		value_of(d[0]['col1']).should_be('asdga');
	},
	'date sort': function(){
		object = new Jx.Sort.Mergesort(data,comparator.date.bind(comparator),'col3',{timeIt: true});
		d = object.sort();
		console.log('mergesort - date : '+object.dif+'ms');
		value_of(d[0]['col3']).should_be('10/5/08');
	}
});

describe('Quick Sort',{
	before: function(){
		data = [
        	new Hash({col0:2,col1:'ghj',col3:'10/22/08'}),
        	new Hash({col0:5,col1:'asdga',col3:'10/5/08'}),
        	new Hash({col0:3,col1:'hgers',col3:'10/7/08'}),
        	new Hash({col0:6,col1:'dgreh',col3:'10/25/08'}),
        	new Hash({col0:7,col1:'hjtjhf',col3:'10/22/08'}),
        	new Hash({col0:2,col1:'bhtb',col3:'10/13/08'}),
        	new Hash({col0:8,col1:'u8hhtej',col3:'10/6/08'}),
        	new Hash({col0:9,col1:'jkjtrhg',col3:'10/8/08'}),
        	new Hash({col0:0,col1:'jhehyj',col3:'10/16/08'}),
        	new Hash({col0:1,col1:'yrhxbxh',col3:'10/9/08'}),
        	new Hash({col0:23,col1:'qshny',col3:'10/30/08'})
        ];
		comparator = new Jx.Compare();
	},
	'numeric sort': function(){
		object = new Jx.Sort.Quicksort(data,comparator.numeric.bind(comparator),'col0',{timeIt: true});
		d = object.sort();
		console.log('quicksort - numeric : '+object.dif+'ms');
		value_of(d[0]['col0']).should_be(0);
	},
	'alphanumeric sort': function(){
		object = new Jx.Sort.Quicksort(data,comparator.alphanumeric.bind(comparator),'col1',{timeIt: true});
		d = object.sort();
		console.log('quicksort - alphanumeric : '+object.dif+'ms');
		value_of(d[0]['col1']).should_be('asdga');
	},
	'date sort': function(){
		object = new Jx.Sort.Quicksort(data,comparator.date.bind(comparator),'col3',{timeIt: true});
		d = object.sort();
		console.log('quicksort - date: '+object.dif+'ms');
		value_of(d[0]['col3']).should_be('10/5/08');
	}
});

describe('Heap Sort',{
	before: function(){
		data = [
        	new Hash({col0:2,col1:'ghj',col3:'10/22/08'}),
        	new Hash({col0:5,col1:'asdga',col3:'10/5/08'}),
        	new Hash({col0:3,col1:'hgers',col3:'10/7/08'}),
        	new Hash({col0:6,col1:'dgreh',col3:'10/25/08'}),
        	new Hash({col0:7,col1:'hjtjhf',col3:'10/22/08'}),
        	new Hash({col0:2,col1:'bhtb',col3:'10/13/08'}),
        	new Hash({col0:8,col1:'u8hhtej',col3:'10/6/08'}),
        	new Hash({col0:9,col1:'jkjtrhg',col3:'10/8/08'}),
        	new Hash({col0:0,col1:'jhehyj',col3:'10/16/08'}),
        	new Hash({col0:1,col1:'yrhxbxh',col3:'10/9/08'}),
        	new Hash({col0:23,col1:'qshny',col3:'10/30/08'})
        ];
		comparator = new Jx.Compare();
	},
	'numeric sort': function(){
		object = new Jx.Sort.Heapsort(data,comparator.numeric.bind(comparator),'col0',{timeIt: true});
		d = object.sort();
		console.log('heapsort - numeric : '+object.dif+'ms');
		value_of(d[0]['col0']).should_be(0);
	},
	'alphanumeric sort': function(){
		object = new Jx.Sort.Heapsort(data,comparator.alphanumeric.bind(comparator),'col1',{timeIt: true});
		d = object.sort();
		console.log('heapsort - alphanumeric : '+object.dif+'ms');
		value_of(d[0]['col1']).should_be('asdga');
	},
	'date sort': function(){
		object = new Jx.Sort.Heapsort(data,comparator.date.bind(comparator),'col3',{timeIt: true});
		d = object.sort();
		console.log('heapsort - date : '+object.dif+'ms');
		value_of(d[0]['col3']).should_be('10/5/08');
	}
});

describe('Native Sort',{
    before: function(){
        data = [
            new Hash({col0:2,col1:'ghj',col3:'10/22/08'}),
            new Hash({col0:5,col1:'asdga',col3:'10/5/08'}),
            new Hash({col0:3,col1:'hgers',col3:'10/7/08'}),
            new Hash({col0:6,col1:'dgreh',col3:'10/25/08'}),
            new Hash({col0:7,col1:'hjtjhf',col3:'10/22/08'}),
            new Hash({col0:2,col1:'bhtb',col3:'10/13/08'}),
            new Hash({col0:8,col1:'u8hhtej',col3:'10/6/08'}),
            new Hash({col0:9,col1:'jkjtrhg',col3:'10/8/08'}),
            new Hash({col0:0,col1:'jhehyj',col3:'10/16/08'}),
            new Hash({col0:1,col1:'yrhxbxh',col3:'10/9/08'}),
            new Hash({col0:23,col1:'qshny',col3:'10/30/08'})
        ];
        comparator = new Jx.Compare();
    },
    'numeric sort': function(){
        object = new Jx.Sort.Heapsort(data,comparator.numeric.bind(comparator),'col0',{timeIt: true});
        d = object.sort();
        console.log('nativesort - numeric : '+object.dif+'ms');
        value_of(d[0]['col0']).should_be(0);
    },
    'alphanumeric sort': function(){
        object = new Jx.Sort.Heapsort(data,comparator.alphanumeric.bind(comparator),'col1',{timeIt: true});
        d = object.sort();
        console.log('nativesort - alphanumeric : '+object.dif+'ms');
        value_of(d[0]['col1']).should_be('asdga');
    },
    'date sort': function(){
        object = new Jx.Sort.Heapsort(data,comparator.date.bind(comparator),'col3',{timeIt: true});
        d = object.sort();
        console.log('nativesort - date : '+object.dif+'ms');
        value_of(d[0]['col3']).should_be('10/5/08');
    }
});
