{
    tests: [
        {
            title: "Grid - Add Row - top",
            description: "This test is to verify that the grid displays properly.",
            verify: "Did the grid render properly?",
            before: function(){
                
                var data = ([
                    {'header': 'United States','2002': '347,051.80','2003': '328,983.30','2004': '350,576.30','2005': '368,414.70','2006': '361,440.40','2007': '356,094.20'},
                    {'header': 'Japan','2002': '10,115.00','2003': '9,799.50','2004': '9,846.40','2005': '10,168.20','2006': '10,279.20','2007': '9,989.20'},
                    {'header': 'United Kingdom','2002': '6,161.50','2003': '7,695.30','2004': '9,364.00','2005': '9,355.40','2006': '11,281.20','2007':'14,154.80'},
                    {'header': 'Other EC Countries','2002':'16,294.30','2003':'16,423.40','2004':'17,533.80','2005':'18,630.60','2006':'20,900.20','2007':'24,187.00'},
                    {'header': 'Other OECD', '2002': '12,670.70', '2003': '12,754.10', '2004': '14,189.10', '2005': '14,528.00', '2006': '16,773.90', '2007': '19,690.50'},
                    {'header': 'Other Countries', '2002': '21,745.20', '2003': '23,466.40', '2004': '27,496.20', '2005': '29,052.90', '2006': '33,057.60', '2007':'38,935.80'},
                    {'header': 'Imports', '2002': '356,727.10', '2003': '342,709.50', '2004': '363,157.80', '2005': '387,804.00', '2006': '404,252.60', '2007':'415,005.70'},
                    {'header': 'United States','2002': '255,232.50', '2003': '240,356.30', '2004': '250,038.30', '2005': '259,348.20', '2006': '265,023.00','2007': '269,752.50'},
                    {'header': 'Japan', '2002': '11,732.60', '2003': '10,645.50', '2004': '10,094.50', '2005': '11,210.80', '2006': '11,858.30', '2007':'11,972.30'},
                    {'header': 'United Kingdom', '2002': '10,181.30', '2003': '9,183.00', '2004': '9,460.00', '2005': '9,061.20', '2006': '9,549.20', '2007':'9,894.30'},
                    {'header': 'Other EC Countries', '2002': '25,867.00', '2003': '26,001.00', '2004': '27,007.00', '2005': '29,457.00', '2006': '32,529.80', '2007':'32,402.90'},
                    {'header': 'Other OECD', '2002': '19,686.60', '2003': '19,696.90', '2004': '22,283.60', '2005': '24,304.50', '2006': '23,673.30','2007': '25,034.20'},
                    {'header': 'Other Countries', '2002': '34,027.10', '2003': '36,826.80', '2004': '44,274.40','2005': '54,422.30', '2006': '61,618.90', '2007':'65,949.40'},
                    {'header': 'Balance', '2002': '57,311.40', '2003': '56,412.60', '2004': '65,848.00', '2005': '62,345.90', '2006': '49,479.80', '2007': '48,045.70'},
                    {'header': 'United States', '2002': '91,819.30', '2003': '88,627.00', '2004': '100,538.00', '2005': '109,066.50', '2006': '96,417.40', '2007': '86,341.70'},
                    {'header': 'Japan', '2002': '-1,617.60','2003': '-846', '2004': '-248.1', '2005': '-1,042.60', '2006': '-1,579.10', '2007': '-1,983.10'},
                    {'header': 'United Kingdom', '2002': '-4,019.80', '2003': '-1,487.70', '2004': '-96','2005': '294.2', '2006': '1,732.00', '2007': '4,260.50'},
                    {'header': 'Other EC Countries', '2002': '-9,572.70', '2003': '-9,577.60', '2004': '-9,473.20', '2005': '-10,826.40', '2006': '-11,629.60', '2007': '-8,215.90'},
                    {'header': 'Other OECD', '2002': '-7,015.90', '2003': '-6,942.80', '2004': '-8,094.50', '2005': '-9,776.50', '2006': '-6,899.40', '2007': '-5,343.70'},
                    {'header': 'Other Countries', '2002': '-12,281.90', '2003': '-13,360.40', '2004': '-16,778.20', '2005': '-25,369.40', '2006': '-28,561.30', '2007': '-27,013.60'}
                ]);

                var newRow = {'header': 'Exports','2002': '414,038.50','2003': '399,122.10','2004': '429,005.80','2005': '450,149.90','2006': '453,732.40','2007': '463,051.40'};
                
                var parser = new Jx.Store.Parser.JSON();
                var full = new Jx.Store.Strategy.Full();
                var store = new Jx.Store({
                    columns: [
                        {name: 'header',type: 'alphanumeric'},
                        {name: '2002', type: 'currency'},
                        {name: '2003', type: 'currency'},
                        {name: '2004', type: 'currency'},
                        {name: '2005', type: 'currency'},
                        {name: '2006', type: 'currency'},
                        {name: '2007', type: 'currency'}
                    ],
                    protocol: new Jx.Store.Protocol.Local(data,{parser: parser}),
                    strategies: [full],
                    record: Jx.Record
                });
                //setup options
                var options = {
                    parent: 'test-grid',
                    row: {
                        useHeaders: true,
                        alternateRowColors: true,
                        headerField: 'header',
                        headerWidth: 40,
                        rowHeight: 20
                    },
                    columns: {
                        headerRowHeight: 20,
                        useHeaders: true,
                        columns: [{
                            header: null,
                            modelField: 'header',
                            width: 100,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: 'header',
                            dataType: 'alphanumeric'
                        },{
                            header: '2002',
                            modelField: '2002',
                            width: 50,
                            isEditable: true,
                            isSortable: true,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2002',
                            dataType: 'currency'
                        },{
                            header: '2003',
                            modelField: '2003',
                            width: 50,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2003',
                            dataType: 'currency'
                        },{
                            header: '2004',
                            modelField: '2004',
                            width: 50,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2004',
                            dataType: 'currency'
                        },{
                            header: '2005',
                            modelField: '2005',
                            width: 50,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2005',
                            dataType: 'currency'
                        },{
                            header: '2006',
                            modelField: '2006',
                            width: 50,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2006',
                            dataType: 'currency'
                        },{
                            header: '2007',
                            modelField: '2007',
                            width: 50,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2007',
                            dataType: 'currency'
                        }
                       ]
                    },
                    model: store
                };
                //create grid
                var grid = new Jx.Grid(options);
                store.addEvent('storeDataLoaded', function () {
                    grid.render();
                });
                store.load();
                
                new Jx.Button({
                    label: 'Add Row to top',
                    onClick: function () {
                        store.addRecord(newRow, 'top');
                    }   
                }).addTo('button');
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Grid - Add Row - Bottom",
            description: "This test is to verify that adding rows to the bottom of the grid works. Press the button to run the test.",
            verify: "Did the grid render properly?",
            before: function(){
                document.id('test-grid').empty();
                document.id('button').empty();
                var data = ([
                     {'header': 'Exports','2002': '414,038.50','2003': '399,122.10','2004': '429,005.80','2005': '450,149.90','2006': '453,732.40','2007': '463,051.40'},
                     {'header': 'United States','2002': '347,051.80','2003': '328,983.30','2004': '350,576.30','2005': '368,414.70','2006': '361,440.40','2007': '356,094.20'},
                     {'header': 'Japan','2002': '10,115.00','2003': '9,799.50','2004': '9,846.40','2005': '10,168.20','2006': '10,279.20','2007': '9,989.20'},
                     {'header': 'United Kingdom','2002': '6,161.50','2003': '7,695.30','2004': '9,364.00','2005': '9,355.40','2006': '11,281.20','2007':'14,154.80'},
                     {'header': 'Other EC Countries','2002':'16,294.30','2003':'16,423.40','2004':'17,533.80','2005':'18,630.60','2006':'20,900.20','2007':'24,187.00'},
                     {'header': 'Other OECD', '2002': '12,670.70', '2003': '12,754.10', '2004': '14,189.10', '2005': '14,528.00', '2006': '16,773.90', '2007': '19,690.50'},
                     {'header': 'Other Countries', '2002': '21,745.20', '2003': '23,466.40', '2004': '27,496.20', '2005': '29,052.90', '2006': '33,057.60', '2007':'38,935.80'},
                     {'header': 'Imports', '2002': '356,727.10', '2003': '342,709.50', '2004': '363,157.80', '2005': '387,804.00', '2006': '404,252.60', '2007':'415,005.70'},
                     {'header': 'United States','2002': '255,232.50', '2003': '240,356.30', '2004': '250,038.30', '2005': '259,348.20', '2006': '265,023.00','2007': '269,752.50'},
                     {'header': 'Japan', '2002': '11,732.60', '2003': '10,645.50', '2004': '10,094.50', '2005': '11,210.80', '2006': '11,858.30', '2007':'11,972.30'},
                     {'header': 'United Kingdom', '2002': '10,181.30', '2003': '9,183.00', '2004': '9,460.00', '2005': '9,061.20', '2006': '9,549.20', '2007':'9,894.30'},
                     {'header': 'Other EC Countries', '2002': '25,867.00', '2003': '26,001.00', '2004': '27,007.00', '2005': '29,457.00', '2006': '32,529.80', '2007':'32,402.90'},
                     {'header': 'Other OECD', '2002': '19,686.60', '2003': '19,696.90', '2004': '22,283.60', '2005': '24,304.50', '2006': '23,673.30','2007': '25,034.20'},
                     {'header': 'Other Countries', '2002': '34,027.10', '2003': '36,826.80', '2004': '44,274.40','2005': '54,422.30', '2006': '61,618.90', '2007':'65,949.40'},
                     {'header': 'Balance', '2002': '57,311.40', '2003': '56,412.60', '2004': '65,848.00', '2005': '62,345.90', '2006': '49,479.80', '2007': '48,045.70'},
                     {'header': 'United States', '2002': '91,819.30', '2003': '88,627.00', '2004': '100,538.00', '2005': '109,066.50', '2006': '96,417.40', '2007': '86,341.70'},
                     {'header': 'Japan', '2002': '-1,617.60','2003': '-846', '2004': '-248.1', '2005': '-1,042.60', '2006': '-1,579.10', '2007': '-1,983.10'},
                     {'header': 'United Kingdom', '2002': '-4,019.80', '2003': '-1,487.70', '2004': '-96','2005': '294.2', '2006': '1,732.00', '2007': '4,260.50'},
                     {'header': 'Other EC Countries', '2002': '-9,572.70', '2003': '-9,577.60', '2004': '-9,473.20', '2005': '-10,826.40', '2006': '-11,629.60', '2007': '-8,215.90'},
                     {'header': 'Other OECD', '2002': '-7,015.90', '2003': '-6,942.80', '2004': '-8,094.50', '2005': '-9,776.50', '2006': '-6,899.40', '2007': '-5,343.70'}
                 ]);
                
                newRow = {'header': 'Other Countries', '2002': '-12,281.90', '2003': '-13,360.40', '2004': '-16,778.20', '2005': '-25,369.40', '2006': '-28,561.30', '2007': '-27,013.60'};

                 var parser = new Jx.Store.Parser.JSON();
                 var full = new Jx.Store.Strategy.Full();
                 var store = new Jx.Store({
                     columns: [
                         {name: 'header',type: 'alphanumeric'},
                         {name: '2002', type: 'currency'},
                         {name: '2003', type: 'currency'},
                         {name: '2004', type: 'currency'},
                         {name: '2005', type: 'currency'},
                         {name: '2006', type: 'currency'},
                         {name: '2007', type: 'currency'}
                     ],
                     protocol: new Jx.Store.Protocol.Local(data,{parser: parser}),
                     strategies: [full],
                     record: Jx.Record
                 });


                //setup options
                var options = {
                    parent: 'test-grid',
                    row: {
                        useHeaders: true,
                        alternateRowColors: true,
                        headerField: 'header',
                        headerWidth: 40,
                        rowHeight: 20
                    },
                    columns: {
                        headerRowHeight: 20,
                        useHeaders: true,
                        columns: [{
                            modelField: 'header',
                            width: 'auto',
                            name: 'header',
                            dataType: 'alphanumeric'
                        },{
                            header: '2002',
                            modelField: '2002',
                            width: 50,
                            name: '2002',
                            dataType: 'currency'
                        },{
                            header: '2003',
                            modelField: '2003',
                            width: 50,
                            name: '2003',
                            dataType: 'currency'
                        },{
                            header: '2004',
                            modelField: '2004',
                            width: 50,
                            name: '2004',
                            dataType: 'currency'
                        },{
                            header: '2005',
                            modelField: '2005',
                            width: 50,
                            name: '2005',
                            dataType: 'currency'
                        },{
                            header: '2006',
                            modelField: '2006',
                            width: 50,
                            name: '2006',
                            dataType: 'currency'
                        },{
                            header: '2007',
                            modelField: '2007',
                            width: 50,
                            name: '2007',
                            dataType: 'currency'
                        }
                       ]
                    },
                    model: store
                };
                //create grid
                var grid = new Jx.Grid(options);
                store.addEvent('storeDataLoaded', function () {
                    grid.render();
                });
                store.load();
                
                new Jx.Button({
                    label: 'Add Row to bottom',
                    onClick: function () {
                        store.addRecord(newRow, 'bottom');
                    }   
                }).addTo('button');
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Grid - add Multiple rows - top",
            description: "This test is to verify that we can add multiple row to the top of a grid. Press the button to add rows.",
            verify: "Did the grid render properly?",
            before: function(){
                document.id('test-grid').empty();
                document.id('button').empty();
                var data = [
                     {'header': 'United Kingdom','2002': '6,161.50','2003': '7,695.30','2004': '9,364.00','2005': '9,355.40','2006': '11,281.20','2007':'14,154.80'},
                     {'header': 'Other EC Countries','2002':'16,294.30','2003':'16,423.40','2004':'17,533.80','2005':'18,630.60','2006':'20,900.20','2007':'24,187.00'},
                     {'header': 'Other OECD', '2002': '12,670.70', '2003': '12,754.10', '2004': '14,189.10', '2005': '14,528.00', '2006': '16,773.90', '2007': '19,690.50'},
                     {'header': 'Other Countries', '2002': '21,745.20', '2003': '23,466.40', '2004': '27,496.20', '2005': '29,052.90', '2006': '33,057.60', '2007':'38,935.80'},
                     {'header': 'Imports', '2002': '356,727.10', '2003': '342,709.50', '2004': '363,157.80', '2005': '387,804.00', '2006': '404,252.60', '2007':'415,005.70'},
                     {'header': 'United States','2002': '255,232.50', '2003': '240,356.30', '2004': '250,038.30', '2005': '259,348.20', '2006': '265,023.00','2007': '269,752.50'},
                     {'header': 'Japan', '2002': '11,732.60', '2003': '10,645.50', '2004': '10,094.50', '2005': '11,210.80', '2006': '11,858.30', '2007':'11,972.30'},
                     {'header': 'United Kingdom', '2002': '10,181.30', '2003': '9,183.00', '2004': '9,460.00', '2005': '9,061.20', '2006': '9,549.20', '2007':'9,894.30'},
                     {'header': 'Other EC Countries', '2002': '25,867.00', '2003': '26,001.00', '2004': '27,007.00', '2005': '29,457.00', '2006': '32,529.80', '2007':'32,402.90'},
                     {'header': 'Other OECD', '2002': '19,686.60', '2003': '19,696.90', '2004': '22,283.60', '2005': '24,304.50', '2006': '23,673.30','2007': '25,034.20'},
                     {'header': 'Other Countries', '2002': '34,027.10', '2003': '36,826.80', '2004': '44,274.40','2005': '54,422.30', '2006': '61,618.90', '2007':'65,949.40'},
                     {'header': 'Balance', '2002': '57,311.40', '2003': '56,412.60', '2004': '65,848.00', '2005': '62,345.90', '2006': '49,479.80', '2007': '48,045.70'},
                     {'header': 'United States', '2002': '91,819.30', '2003': '88,627.00', '2004': '100,538.00', '2005': '109,066.50', '2006': '96,417.40', '2007': '86,341.70'},
                     {'header': 'Japan', '2002': '-1,617.60','2003': '-846', '2004': '-248.1', '2005': '-1,042.60', '2006': '-1,579.10', '2007': '-1,983.10'},
                     {'header': 'United Kingdom', '2002': '-4,019.80', '2003': '-1,487.70', '2004': '-96','2005': '294.2', '2006': '1,732.00', '2007': '4,260.50'},
                     {'header': 'Other EC Countries', '2002': '-9,572.70', '2003': '-9,577.60', '2004': '-9,473.20', '2005': '-10,826.40', '2006': '-11,629.60', '2007': '-8,215.90'},
                     {'header': 'Other OECD', '2002': '-7,015.90', '2003': '-6,942.80', '2004': '-8,094.50', '2005': '-9,776.50', '2006': '-6,899.40', '2007': '-5,343.70'},
                     {'header': 'Other Countries', '2002': '-12,281.90', '2003': '-13,360.40', '2004': '-16,778.20', '2005': '-25,369.40', '2006': '-28,561.30', '2007': '-27,013.60'}
                 ];
                
                newRows = [
                    {'header': 'Exports','2002': '414,038.50','2003': '399,122.10','2004': '429,005.80','2005': '450,149.90','2006': '453,732.40','2007': '463,051.40'},
                    {'header': 'United States','2002': '347,051.80','2003': '328,983.30','2004': '350,576.30','2005': '368,414.70','2006': '361,440.40','2007': '356,094.20'},
                    {'header': 'Japan','2002': '10,115.00','2003': '9,799.50','2004': '9,846.40','2005': '10,168.20','2006': '10,279.20','2007': '9,989.20'}           
                ];

                 var parser = new Jx.Store.Parser.JSON();
                 var full = new Jx.Store.Strategy.Full();
                 var store = new Jx.Store({
                     columns: [
                         {name: 'header',type: 'alphanumeric'},
                         {name: '2002', type: 'currency'},
                         {name: '2003', type: 'currency'},
                         {name: '2004', type: 'currency'},
                         {name: '2005', type: 'currency'},
                         {name: '2006', type: 'currency'},
                         {name: '2007', type: 'currency'}
                     ],
                     protocol: new Jx.Store.Protocol.Local(data,{parser: parser}),
                     strategies: [full],
                     record: Jx.Record
                 });


                //setup options
                var options = {
                    parent: 'test-grid',
                    row: {
                        useHeaders: true,
                        alternateRowColors: true,
                        headerField: 'header',
                        headerWidth: 40,
                        rowHeight: 20
                    },
                    columns: {
                        headerRowHeight: 20,
                        useHeaders: true,
                        columns: [{
                            modelField: 'header',
                            width: 'auto',
                            name: 'header',
                            dataType: 'alphanumeric'
                        },{
                            header: '2002',
                            modelField: '2002',
                            name: '2002',
                            dataType: 'currency'
                        },{
                            header: '2003',
                            modelField: '2003',
                            name: '2003',
                            dataType: 'currency'
                        },{
                            header: '2004',
                            modelField: '2004',
                            name: '2004',
                            dataType: 'currency'
                        },{
                            header: '2005',
                            modelField: '2005',
                            name: '2005',
                            dataType: 'currency'
                        },{
                            header: '2006',
                            modelField: '2006',
                            name: '2006',
                            dataType: 'currency'
                        },{
                            header: '2007',
                            modelField: '2007',
                            name: '2007',
                            dataType: 'currency'
                        }
                       ]
                    },
                    model: store
                };
                //create grid
                var grid = new Jx.Grid(options);
                grid.addEvents({
                    'gridCellSelect': function(cell, list, grid){
                        var d = cell.retrieve('jxCellData');
                        console.log("cell selected");
                        console.log(d);
                    },
                    'gridCellUnselect': function(cell, list, grid){
                        var d = cell.retrieve('jxCellData');
                        console.log("cell unselected");
                        console.log(d);
                    },
                    'gridCellEnter': function(cell, list, grid){
                        var d = cell.retrieve('jxCellData');
                        console.log("cell entered");
                        console.log(d);
                    },
                    'gridCellLeave': function(cell, list, grid){
                        var d = cell.retrieve('jxCellData');
                        console.log("cell left");
                        console.log(d);
                    },
                    'beginCreateGrid': function(grid){
                        console.log('Grid creation started');
                    },
                    'doneCreateGrid': function(grid){
                        console.log('Grid creation completed');
                    }
                });
                store.addEvent('storeDataLoaded', function () {
                    grid.render();
                });
                store.load();
                
                new Jx.Button({
                    label: 'Add Rows to top',
                    onClick: function () {
                        store.addRecords(newRows, 'top');
                    }   
                }).addTo('button');
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Grid - add multiple rows - bottom",
            description: "This test is to verify that we can add multiple rows to the bottom of a grid. Press the button to add rows.",
            verify: "Did the rows show up correctly?",
            before: function(){
                document.id('test-grid').empty();
                document.id('button').empty();
                var data = ([
                     {'header': 'Exports','2002': '414,038.50','2003': '399,122.10','2004': '429,005.80','2005': '450,149.90','2006': '453,732.40','2007': '463,051.40'},
                     {'header': 'United States','2002': '347,051.80','2003': '328,983.30','2004': '350,576.30','2005': '368,414.70','2006': '361,440.40','2007': '356,094.20'},
                     {'header': 'Japan','2002': '10,115.00','2003': '9,799.50','2004': '9,846.40','2005': '10,168.20','2006': '10,279.20','2007': '9,989.20'},
                     {'header': 'United Kingdom','2002': '6,161.50','2003': '7,695.30','2004': '9,364.00','2005': '9,355.40','2006': '11,281.20','2007':'14,154.80'},
                     {'header': 'Other EC Countries','2002':'16,294.30','2003':'16,423.40','2004':'17,533.80','2005':'18,630.60','2006':'20,900.20','2007':'24,187.00'},
                     {'header': 'Other OECD', '2002': '12,670.70', '2003': '12,754.10', '2004': '14,189.10', '2005': '14,528.00', '2006': '16,773.90', '2007': '19,690.50'},
                     {'header': 'Other Countries', '2002': '21,745.20', '2003': '23,466.40', '2004': '27,496.20', '2005': '29,052.90', '2006': '33,057.60', '2007':'38,935.80'},
                     {'header': 'Imports', '2002': '356,727.10', '2003': '342,709.50', '2004': '363,157.80', '2005': '387,804.00', '2006': '404,252.60', '2007':'415,005.70'},
                     {'header': 'United States','2002': '255,232.50', '2003': '240,356.30', '2004': '250,038.30', '2005': '259,348.20', '2006': '265,023.00','2007': '269,752.50'},
                     {'header': 'Japan', '2002': '11,732.60', '2003': '10,645.50', '2004': '10,094.50', '2005': '11,210.80', '2006': '11,858.30', '2007':'11,972.30'},
                     {'header': 'United Kingdom', '2002': '10,181.30', '2003': '9,183.00', '2004': '9,460.00', '2005': '9,061.20', '2006': '9,549.20', '2007':'9,894.30'},
                     {'header': 'Other EC Countries', '2002': '25,867.00', '2003': '26,001.00', '2004': '27,007.00', '2005': '29,457.00', '2006': '32,529.80', '2007':'32,402.90'},
                     {'header': 'Other OECD', '2002': '19,686.60', '2003': '19,696.90', '2004': '22,283.60', '2005': '24,304.50', '2006': '23,673.30','2007': '25,034.20'},
                     {'header': 'Other Countries', '2002': '34,027.10', '2003': '36,826.80', '2004': '44,274.40','2005': '54,422.30', '2006': '61,618.90', '2007':'65,949.40'},
                     {'header': 'Balance', '2002': '57,311.40', '2003': '56,412.60', '2004': '65,848.00', '2005': '62,345.90', '2006': '49,479.80', '2007': '48,045.70'},
                     {'header': 'United States', '2002': '91,819.30', '2003': '88,627.00', '2004': '100,538.00', '2005': '109,066.50', '2006': '96,417.40', '2007': '86,341.70'},
                     {'header': 'Japan', '2002': '-1,617.60','2003': '-846', '2004': '-248.1', '2005': '-1,042.60', '2006': '-1,579.10', '2007': '-1,983.10'},
                     {'header': 'United Kingdom', '2002': '-4,019.80', '2003': '-1,487.70', '2004': '-96','2005': '294.2', '2006': '1,732.00', '2007': '4,260.50'}
                 ]);
                
                newRows = [
                       {'header': 'Other EC Countries', '2002': '-9,572.70', '2003': '-9,577.60', '2004': '-9,473.20', '2005': '-10,826.40', '2006': '-11,629.60', '2007': '-8,215.90'},
                       {'header': 'Other OECD', '2002': '-7,015.90', '2003': '-6,942.80', '2004': '-8,094.50', '2005': '-9,776.50', '2006': '-6,899.40', '2007': '-5,343.70'},
                       {'header': 'Other Countries', '2002': '-12,281.90', '2003': '-13,360.40', '2004': '-16,778.20', '2005': '-25,369.40', '2006': '-28,561.30', '2007': '-27,013.60'}
                ];

                 var parser = new Jx.Store.Parser.JSON();
                 var full = new Jx.Store.Strategy.Full();
                 var store = new Jx.Store({
                     columns: [
                         {name: 'header',type: 'alphanumeric'},
                         {name: '2002', type: 'currency'},
                         {name: '2003', type: 'currency'},
                         {name: '2004', type: 'currency'},
                         {name: '2005', type: 'currency'},
                         {name: '2006', type: 'currency'},
                         {name: '2007', type: 'currency'}
                     ],
                     protocol: new Jx.Store.Protocol.Local(data,{parser: parser}),
                     strategies: [full],
                     record: Jx.Record
                 });

                //setup options
                var options = {
                    parent: 'test-grid',
                    row: {
                        useHeaders: true,
                        alternateRowColors: true,
                        headerField: 'header',
                        headerWidth: 40,
                        rowHeight: 20
                    },
                    columns: {
                        headerRowHeight: 20,
                        useHeaders: true,
                        columns: [{
                            modelField: 'header',
                            width: 'auto',
                            name: 'header',
                            dataType: 'alphanumeric'
                        },{
                            header: '2002',
                            modelField: '2002',
                            name: '2002',
                            dataType: 'currency'
                        },{
                            header: '2003',
                            modelField: '2003',
                            name: '2003',
                            dataType: 'currency'
                        },{
                            header: '2004',
                            modelField: '2004',
                            name: '2004',
                            dataType: 'currency'
                        },{
                            header: '2005',
                            modelField: '2005',
                            name: '2005',
                            dataType: 'currency'
                        },{
                            header: '2006',
                            modelField: '2006',
                            name: '2006',
                            dataType: 'currency'
                        },{
                            header: '2007',
                            modelField: '2007',
                            name: '2007',
                            dataType: 'currency'
                        }
                       ]
                    },
                    model: store
                };
                //create grid
                var grid = new Jx.Grid(options);
                grid.addEvents({
                    'gridCellSelect': function(cell, list, grid){
                        var d = cell.retrieve('jxCellData');
                        console.log("cell selected");
                        console.log(d);
                    },
                    'gridCellUnselect': function(cell, list, grid){
                        var d = cell.retrieve('jxCellData');
                        console.log("cell unselected");
                        console.log(d);
                    },
                    'gridCellEnter': function(cell, list, grid){
                        var d = cell.retrieve('jxCellData');
                        console.log("cell entered");
                        console.log(d);
                    },
                    'gridCellLeave': function(cell, list, grid){
                        var d = cell.retrieve('jxCellData');
                        console.log("cell left");
                        console.log(d);
                    },
                    'beginCreateGrid': function(grid){
                        console.log('Grid creation started');
                    },
                    'doneCreateGrid': function(grid){
                        console.log('Grid creation completed');
                    }
                });
                store.addEvent('storeDataLoaded', function () {
                    grid.render();
                });
                store.load();
                
                new Jx.Button({
                    label: 'Add Row to bottom',
                    onClick: function () {
                        store.addRecords(newRows, 'bottom');
                    }   
                }).addTo('button');
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Grid - remove Row",
            description: "This test is to verify that the grid is able to remove a row properly.",
            verify: "Did the grid render properly?",
            before: function(){
                document.id('test-grid').empty();
                document.id('button').empty();
                var data = ([
                             {'header': 'Exports','2002': '414,038.50','2003': '399,122.10','2004': '429,005.80','2005': '450,149.90','2006': '453,732.40','2007': '463,051.40'},
                             {'header': 'United States','2002': '347,051.80','2003': '328,983.30','2004': '350,576.30','2005': '368,414.70','2006': '361,440.40','2007': '356,094.20'},
                             {'header': 'Japan','2002': '10,115.00','2003': '9,799.50','2004': '9,846.40','2005': '10,168.20','2006': '10,279.20','2007': '9,989.20'},
                             {'header': 'United Kingdom','2002': '6,161.50','2003': '7,695.30','2004': '9,364.00','2005': '9,355.40','2006': '11,281.20','2007':'14,154.80'},
                             {'header': 'Other EC Countries','2002':'16,294.30','2003':'16,423.40','2004':'17,533.80','2005':'18,630.60','2006':'20,900.20','2007':'24,187.00'},
                             {'header': 'Other OECD', '2002': '12,670.70', '2003': '12,754.10', '2004': '14,189.10', '2005': '14,528.00', '2006': '16,773.90', '2007': '19,690.50'},
                             {'header': 'Other Countries', '2002': '21,745.20', '2003': '23,466.40', '2004': '27,496.20', '2005': '29,052.90', '2006': '33,057.60', '2007':'38,935.80'},
                             {'header': 'Imports', '2002': '356,727.10', '2003': '342,709.50', '2004': '363,157.80', '2005': '387,804.00', '2006': '404,252.60', '2007':'415,005.70'},
                             {'header': 'United States','2002': '255,232.50', '2003': '240,356.30', '2004': '250,038.30', '2005': '259,348.20', '2006': '265,023.00','2007': '269,752.50'},
                             {'header': 'Japan', '2002': '11,732.60', '2003': '10,645.50', '2004': '10,094.50', '2005': '11,210.80', '2006': '11,858.30', '2007':'11,972.30'},
                             {'header': 'United Kingdom', '2002': '10,181.30', '2003': '9,183.00', '2004': '9,460.00', '2005': '9,061.20', '2006': '9,549.20', '2007':'9,894.30'},
                             {'header': 'Other EC Countries', '2002': '25,867.00', '2003': '26,001.00', '2004': '27,007.00', '2005': '29,457.00', '2006': '32,529.80', '2007':'32,402.90'},
                             {'header': 'Other OECD', '2002': '19,686.60', '2003': '19,696.90', '2004': '22,283.60', '2005': '24,304.50', '2006': '23,673.30','2007': '25,034.20'},
                             {'header': 'Other Countries', '2002': '34,027.10', '2003': '36,826.80', '2004': '44,274.40','2005': '54,422.30', '2006': '61,618.90', '2007':'65,949.40'},
                             {'header': 'Balance', '2002': '57,311.40', '2003': '56,412.60', '2004': '65,848.00', '2005': '62,345.90', '2006': '49,479.80', '2007': '48,045.70'},
                             {'header': 'United States', '2002': '91,819.30', '2003': '88,627.00', '2004': '100,538.00', '2005': '109,066.50', '2006': '96,417.40', '2007': '86,341.70'},
                             {'header': 'Japan', '2002': '-1,617.60','2003': '-846', '2004': '-248.1', '2005': '-1,042.60', '2006': '-1,579.10', '2007': '-1,983.10'},
                             {'header': 'United Kingdom', '2002': '-4,019.80', '2003': '-1,487.70', '2004': '-96','2005': '294.2', '2006': '1,732.00', '2007': '4,260.50'},
                             {'header': 'Other EC Countries', '2002': '-9,572.70', '2003': '-9,577.60', '2004': '-9,473.20', '2005': '-10,826.40', '2006': '-11,629.60', '2007': '-8,215.90'},
                             {'header': 'Other OECD', '2002': '-7,015.90', '2003': '-6,942.80', '2004': '-8,094.50', '2005': '-9,776.50', '2006': '-6,899.40', '2007': '-5,343.70'},
                             {'header': 'Other Countries', '2002': '-12,281.90', '2003': '-13,360.40', '2004': '-16,778.20', '2005': '-25,369.40', '2006': '-28,561.30', '2007': '-27,013.60'}
                         ]);

                         var parser = new Jx.Store.Parser.JSON();
                         var full = new Jx.Store.Strategy.Full();
                         var store = new Jx.Store({
                             columns: [
                                 {name: 'header',type: 'alphanumeric'},
                                 {name: '2002', type: 'currency'},
                                 {name: '2003', type: 'currency'},
                                 {name: '2004', type: 'currency'},
                                 {name: '2005', type: 'currency'},
                                 {name: '2006', type: 'currency'},
                                 {name: '2007', type: 'currency'}
                             ],
                             protocol: new Jx.Store.Protocol.Local(data,{parser: parser}),
                             strategies: [full],
                             record: Jx.Record
                         });
                         

                //setup options
                var options = {
                    parent: 'test-grid',
                    row: {
                        useHeaders: true,
                        alternateRowColors: true,
                        headerField: 'header',
                        headerWidth: 40,
                        rowHeight: 20
                    },
                    columns: {
                        headerRowHeight: 20,
                        useHeaders: true,
                        columns: [{
                            header: null,
                            modelField: 'header',
                            width: 100,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: 'header',
                            dataType: 'alphanumeric'
                        },{
                            header: '2002',
                            modelField: '2002',
                            width: 50,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2002',
                            dataType: 'currency'
                        },{
                            header: '2003',
                            modelField: '2003',
                            width: 50,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: true,
                            cssClass: '',
                            formatter: null,
                            name: '2003',
                            dataType: 'currency'
                        },{
                            header: '2004',
                            modelField: '2004',
                            width: 50,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2004',
                            dataType: 'currency'
                        },{
                            header: '2005',
                            modelField: '2005',
                            width: 50,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: true,
                            cssClass: '',
                            formatter: null,
                            name: '2005',
                            dataType: 'currency'
                        },{
                            header: '2006',
                            modelField: '2006',
                            width: 50,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2006',
                            dataType: 'currency'
                        },{
                            header: '2007',
                            modelField: '2007',
                            width: 50,
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: true,
                            cssClass: '',
                            formatter: null,
                            name: '2007',
                            dataType: 'currency'
                        }
                       ]
                    },
                    model: store
                };
                //create grid
                var grid = new Jx.Grid(options);
                store.addEvent('storeDataLoaded', function () {
                    grid.render();
                });
                store.load();
                
                new Jx.Button({
                    label: 'Remove a Row',
                    onClick: function () {
                        store.removeRecord(9);
                    }   
                }).addTo('button');
            },
            body: "",
            post: function(){
                
            }
        },{
            title: "Grid - remove several rows",
            description: "This test is to verify that the grid displays properly when several rows are removed. Click the button to remove some rows.",
            verify: "Did the value change?",
            before: function(){
                document.id('test-grid').empty();
                document.id('button').empty();
                var data = ([
                             {'header': 'Exports','2002': '414,038.50','2003': '399,122.10','2004': '429,005.80','2005': '450,149.90','2006': '453,732.40','2007': '463,051.40'},
                             {'header': 'United States','2002': '347,051.80','2003': '328,983.30','2004': '350,576.30','2005': '368,414.70','2006': '361,440.40','2007': '356,094.20'},
                             {'header': 'Japan','2002': '10,115.00','2003': '9,799.50','2004': '9,846.40','2005': '10,168.20','2006': '10,279.20','2007': '9,989.20'},
                             {'header': 'United Kingdom','2002': '6,161.50','2003': '7,695.30','2004': '9,364.00','2005': '9,355.40','2006': '11,281.20','2007':'14,154.80'},
                             {'header': 'Other EC Countries','2002':'16,294.30','2003':'16,423.40','2004':'17,533.80','2005':'18,630.60','2006':'20,900.20','2007':'24,187.00'},
                             {'header': 'Other OECD', '2002': '12,670.70', '2003': '12,754.10', '2004': '14,189.10', '2005': '14,528.00', '2006': '16,773.90', '2007': '19,690.50'},
                             {'header': 'Other Countries', '2002': '21,745.20', '2003': '23,466.40', '2004': '27,496.20', '2005': '29,052.90', '2006': '33,057.60', '2007':'38,935.80'},
                             {'header': 'Imports', '2002': '356,727.10', '2003': '342,709.50', '2004': '363,157.80', '2005': '387,804.00', '2006': '404,252.60', '2007':'415,005.70'},
                             {'header': 'United States','2002': '255,232.50', '2003': '240,356.30', '2004': '250,038.30', '2005': '259,348.20', '2006': '265,023.00','2007': '269,752.50'},
                             {'header': 'Japan', '2002': '11,732.60', '2003': '10,645.50', '2004': '10,094.50', '2005': '11,210.80', '2006': '11,858.30', '2007':'11,972.30'},
                             {'header': 'United Kingdom', '2002': '10,181.30', '2003': '9,183.00', '2004': '9,460.00', '2005': '9,061.20', '2006': '9,549.20', '2007':'9,894.30'},
                             {'header': 'Other EC Countries', '2002': '25,867.00', '2003': '26,001.00', '2004': '27,007.00', '2005': '29,457.00', '2006': '32,529.80', '2007':'32,402.90'},
                             {'header': 'Other OECD', '2002': '19,686.60', '2003': '19,696.90', '2004': '22,283.60', '2005': '24,304.50', '2006': '23,673.30','2007': '25,034.20'},
                             {'header': 'Other Countries', '2002': '34,027.10', '2003': '36,826.80', '2004': '44,274.40','2005': '54,422.30', '2006': '61,618.90', '2007':'65,949.40'},
                             {'header': 'Balance', '2002': '57,311.40', '2003': '56,412.60', '2004': '65,848.00', '2005': '62,345.90', '2006': '49,479.80', '2007': '48,045.70'},
                             {'header': 'United States', '2002': '91,819.30', '2003': '88,627.00', '2004': '100,538.00', '2005': '109,066.50', '2006': '96,417.40', '2007': '86,341.70'},
                             {'header': 'Japan', '2002': '-1,617.60','2003': '-846', '2004': '-248.1', '2005': '-1,042.60', '2006': '-1,579.10', '2007': '-1,983.10'},
                             {'header': 'United Kingdom', '2002': '-4,019.80', '2003': '-1,487.70', '2004': '-96','2005': '294.2', '2006': '1,732.00', '2007': '4,260.50'},
                             {'header': 'Other EC Countries', '2002': '-9,572.70', '2003': '-9,577.60', '2004': '-9,473.20', '2005': '-10,826.40', '2006': '-11,629.60', '2007': '-8,215.90'},
                             {'header': 'Other OECD', '2002': '-7,015.90', '2003': '-6,942.80', '2004': '-8,094.50', '2005': '-9,776.50', '2006': '-6,899.40', '2007': '-5,343.70'},
                             {'header': 'Other Countries', '2002': '-12,281.90', '2003': '-13,360.40', '2004': '-16,778.20', '2005': '-25,369.40', '2006': '-28,561.30', '2007': '-27,013.60'}
                         ]);

                         var parser = new Jx.Store.Parser.JSON();
                         var full = new Jx.Store.Strategy.Full();
                         var store = new Jx.Store({
                             columns: [
                                 {name: 'header',type: 'alphanumeric'},
                                 {name: '2002', type: 'currency'},
                                 {name: '2003', type: 'currency'},
                                 {name: '2004', type: 'currency'},
                                 {name: '2005', type: 'currency'},
                                 {name: '2006', type: 'currency'},
                                 {name: '2007', type: 'currency'}
                             ],
                             protocol: new Jx.Store.Protocol.Local(data,{parser: parser}),
                             strategies: [full],
                             record: Jx.Record
                         });
                         

                //setup options
                var options = {
                    parent: 'test-grid',
                    row: {
                        useHeaders: true,
                        alternateRowColors: true,
                        headerField: 'header',
                        headerWidth: 40,
                        rowHeight: 20
                    },
                    columns: {
                        headerRowHeight: 20,
                        useHeaders: true,
                        columns: [{
                            header: null,
                            modelField: 'header',
                            width: 'auto',
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: 'header',
                            dataType: 'alphanumeric'
                        },{
                            header: '2002',
                            modelField: '2002',
                            width: 'auto',
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2002',
                            dataType: 'currency'
                        },{
                            header: '2003',
                            modelField: '2003',
                            width: 'auto',
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2003',
                            dataType: 'currency'
                        },{
                            header: '2004',
                            modelField: '2004',
                            width: 'auto',
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2004',
                            dataType: 'currency'
                        },{
                            header: '2005',
                            modelField: '2005',
                            width: 'auto',
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2005',
                            dataType: 'currency'
                        },{
                            header: '2006',
                            modelField: '2006',
                            width: 'auto',
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2006',
                            dataType: 'currency'
                        },{
                            header: '2007',
                            modelField: '2007',
                            width: 'auto',
                            isEditable: false,
                            isSortable: false,
                            isResizable: true,
                            isHidden: false,
                            cssClass: '',
                            formatter: null,
                            name: '2007',
                            dataType: 'currency'
                        }
                       ]
                    },
                    model: store
                };
                //create grid
                var grid = new Jx.Grid(options);
                store.addEvent('storeDataLoaded', function () {
                    grid.render();
                });
                store.load();
                
                //button
                new Jx.Button({
                    label: 'Remove records 4 through 10',
                    onClick: function () {
                        store.removeRecords(4,10);
                    }
                }).addTo('button');
            },
            body: "",
            post: function(){
                
            }
        }
        
    ],
    otherScripts: ['parser.json','strategy.full','record','protocol.local','response','button']
}
