describe('paging store',{
    before: function(){
        data = [
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
        parser = new Jx.Store.Parser.JSON();
        protocol = new Jx.Store.Protocol.Local(data, {
            parser: parser
        });
        paging = new Jx.Store.Strategy.Paginate({
            startingItemsPerPage: 3
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
            strategies: [ paging ]
        });
    },
    'store has loaded': function(){
        object.addEvent('storeDataLoaded', function(){
            value_of(object.count()).should_be(3);
        });
        object.load();
    },
    'first item on page 1 correct': function(){
        object.addEvent('storeDataLoaded', function(){
            value_of(object.get('col0')).should_be(2);
        });
        object.load();
    },
    'move to next page': function(){
       object.load();
       object.addEvent('storeDataLoaded',function(){
           value_of(object.get('col0')).should_be(6);
       });
       object.getStrategy('paginate').setPage('next');
       
    },
    'move to last page': function(){
        object.load();
        object.addEvent('storeDataLoaded',function(){
            value_of(object.get('col0')).should_be(1);
        });
        object.getStrategy('paginate').setPage('last');
        
    },
    'move to previous page': function(){
        object.load();
        var paging = object.getStrategy('paginate');
        paging.setPage('last');
        object.addEvent('storeDataLoaded',function(){
            value_of(object.get('col0')).should_be(8);
        });
        paging.setPage('previous');
        
    },
    'move to first page': function(){
        object.load();
        var paging = object.getStrategy('paginate');
        paging.setPage('last');
        object.addEvent('storeDataLoaded',function(){
            value_of(object.get('col0')).should_be(2);
        });
        paging.setPage('first');
        
    },
    'move to relative page +2': function(){
        object.load();
        object.addEvent('storeDataLoaded',function(){
            value_of(object.get('col0')).should_be(8);
        });
        object.getStrategy('paginate').setPage('+2');
        
    },
    'move to relative page -2': function(){
        object.load();
        var paging = object.getStrategy('paginate');
        paging.setPage('last');
        object.addEvent('storeDataLoaded',function(){
            value_of(object.get('col0')).should_be(6);
        });
        paging.setPage('-2');
        
    }
    
});