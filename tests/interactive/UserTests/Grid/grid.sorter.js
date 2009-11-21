{
    tests: [
        {
            title: "Grid - sorter plugin",
            description: "This test is to verify that the sorter plugin works. Click any header to sort the column. The phone number column should NOT sort." ,
            verify: "When you click a column does it sort?",
            before: function(){
            
            document.id('test-grid').empty();
            
            var currencyCss = function(value){
                return (value.contains('(') || value.contains('-'))? "negative":"positive";
            };
            
            var data = [
                        {'id':1,'name':'John Doe','dob':'12/4/1974','active':true,'duesLeft':30,'phone':'16753780987'},
                        {'id':2,'name':'Bob Smith','dob':'8/4/1987','active':true,'duesLeft':0,'phone':'867-465-3686'},
                        {'id':3,'name':'Joe Black','dob':'5/25/1963','active':true,'duesLeft':10,'phone':'1(857) 467-9847'},
                        {'id':4,'name':'Betty White','dob':'6/3/1979','active':true,'duesLeft':45,'phone':'2748467384'},
                        {'id':5,'name':'Greg Little','dob':'5/3/1993','active':false,'duesLeft':19.89,'phone':'9676574583'},
                        {'id':6,'name':'Andrew long','dob':'7/19/1982','active':true,'duesLeft':15,'phone':'5679857865'},
                        {'id':7,'name':'Jason Lee','dob':'4/13/1977','active':false,'duesLeft':14,'phone':'9786456753'},
                        {'id':8,'name':'Elizabeth Freeman','dob':'7/3/1994','active':true,'duesLeft':5,'phone':'9567563426'},
                        {'id':9,'name':'Bob Red','dob':'8/5/1972','active':true,'duesLeft':74,'phone':'2637485769'},
                        {'id':10,'name':'Russel Stover','dob':'9/10/1969','active':false,'duesLeft':65,'phone':'8474657839'},
                        {'id':11,'name':'Granny Smith','dob':'10/28/1985','active':true,'duesLeft':0,'phone':'6748485948'},
                        {'id':12,'name':'Reba Butterworth','dob':'11/11/1989','active':false,'duesLeft':0,'phone':'7584985767'},
                        {'id':13,'name':'Frank Gillis','dob':'2/3/1976','active':true,'duesLeft':5,'phone':'4758693094'}
                    ];
                    
                    //create store
                    var parser = new Jx.Store.Parser.JSON();
                    var full = new Jx.Store.Strategy.Full();
                    var sort = new Jx.Store.Strategy.Sort({sortOnStoreEvents: null});
                    var store = new Jx.Store({
                        columns: [
                            {name: 'id',type: 'numeric'},
                            {name: 'name', type: 'alphanumeric'},
                            {name: 'dob', type: 'date'},
                            {name: 'active', type: 'boolean'},
                            {name: 'duesLeft', type: 'currency'},
                            {name: 'phone', type: 'alphanumeric'}
                        ],
                        protocol: new Jx.Store.Protocol.Local(data,{parser: parser}),
                        strategies: [full, sort],
                        record: Jx.Record
                    });

            var currencyFormatter = new Jx.Formatter.Currency();
            var dateFormatter = new Jx.Formatter.Date();
            var booleanFormatter = new Jx.Formatter.Boolean();
            
            //setup options
            var options = {
                parent: 'test-grid',
                row: {
                    useHeaders: true,
                    alternateRowColors: true,
                    headerField: 'id',
                    rowHeight: 20
                },
                columns: {
                    headerRowHeight: 20,
                    useHeaders: true,
                    columns: [{
                        header: null,
                        modelField: 'id',
                        isSortable: true,
                        name: 'id',
                        dataType: 'numeric'
                    },{
                        header: 'Name',
                        modelField: 'name',
                        formatter: null,
                        isSortable: true,
                        name: 'name',
                        dataType: 'alphanumeric'
                    },{
                        header: 'Date of Birth',
                        modelField: 'dob',
                        formatter: dateFormatter,
                        isSortable: true,
                        name: 'dob',
                        dataType: 'date'
                    },{
                        header: 'Active?',
                        modelField: 'active',
                        formatter: booleanFormatter,
                        isSortable: true,
                        name: 'active',
                        dataType: 'boolean'
                    },{
                        header: 'Dues Left',
                        modelField: 'duesLeft',
                        formatter: currencyFormatter,
                        isSortable: true,
                        name: 'duesLeft',
                        dataType: 'currency',
                        templates: {
                            cell: {
                                cssClass: currencyCss
                            }
                        }
                    },{
                        header: 'Home Phone',
                        modelField: 'phone',
                        isSortable: false,
                        formatter: {name:'Phone',options:{}},
                        name: 'phone',
                        dataType: 'alphanumeric'
                    }
                   ]
                },
                model: store,
                plugins: [{
                    name: 'Sorter'
                }]
            };
            //create grid
            grid = new Jx.Grid(options);
            store.addEvent('storeDataLoaded', function () {
                grid.render();
            });
            store.load();
               
            },
            body: "",
            post: function(){
                
            }
        }
    ],
    otherScripts: ["currency","date","boolean","phone","grid.sorter","mergesort",'parser.json','strategy.full','record','protocol.local','response', 'strategy.sort']
}
