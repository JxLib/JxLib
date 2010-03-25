{
    tests: [
      {
            title: "Grid Editor - Base Test",
            description: "This ist is to verify the basic Inline-Editing function of the grid. Clicking into a table cell should open an Jx.Input field. Clicking on another one should close the old and open the new one. Clicking outside the table should hide the input after 500ms.",
            verify: "Does opening input text fields work properly showing the original data (not the formatted ones)?",
            before: function(){

              document.id('test-grid').empty();

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
                  strategies: [full],
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
                      name: 'id',
                      isEditable: true,
                      dataType: 'numeric'
                    },{
                      header: 'Name',
                      modelField: 'name',
                      formatter: null,
                      name: 'name',
                      isEditable: true,
                      dataType: 'alphanumeric'
                    },{
                      header: 'Date of Birth',
                      modelField: 'dob',
                      formatter: dateFormatter,
                      name: 'dob',
                      isEditable: true,
                      dataType: 'date'
                    },{
                      header: 'Active?',
                      modelField: 'active',
                      formatter: booleanFormatter,
                      name: 'active',
                      isEditable: true,
                      dataType: 'boolean'
                    },{
                      header: 'Dues Left',
                      modelField: 'duesLeft',
                      formatter: currencyFormatter,
                      name: 'duesLeft',
                      isEditable: true,
                      dataType: 'currency'
                    },{
                      header: 'Home Phone',
                      modelField: 'phone',
                      formatter: {name:'Phone',options:{}},
                      name: 'phone',
                      isEditable: true,
                      dataType: 'alphanumeric'
                    }
                   ]
                  },
                  model: store
              };
              //create grid
              var grid = new Jx.Grid(options);
              grid.render();

              var editorOptions = {
                useKeyboard : false,
                fieldFormatted : false,
                popup : {
                  use        : false/*,
                  useLabels  : false,
                  useButtons : true,
                  button : {
                    submit : {
                      label : 'Submit'
                    },
                    cancel : {
                      label : 'Abort'
                    }
                  } */
                },
                fieldOptions : [
                  {
                    field   : 'active',
                    type    : 'Select',
                    options : {
                      comboOpts: [
                        { value: 'true',  text: 'true'  },
                        { value: 'false', text: 'false' }
                      ]
                    }
                  }
                ]
              }

              var editor = new Jx.Plugin.Grid.Editor(editorOptions);
              editor.attach(grid);

            },
            body: "",
            post: function(){

            }
        },
        {
            title: "Grid Editor - Basic PopUp Test",
            description: "This ist is to verify the basic popup features. Clicking outside the table should hide the input after 500ms. Also the values of column 'Date of Birth' and 'Home Phone' should have the formatted value inside the input field.",
            verify: "Does opening input text fields in a popup with buttons and the label of the column work properly?",
            before: function(){

              document.id('test-grid').empty();

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
                  strategies: [full],
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
                      name: 'id',
                      isEditable: true,
                      dataType: 'numeric'
                    },{
                      header: 'Name',
                      modelField: 'name',
                      formatter: null,
                      name: 'name',
                      isEditable: true,
                      dataType: 'alphanumeric'
                    },{
                      header: 'Date of Birth',
                      modelField: 'dob',
                      formatter: dateFormatter,
                      name: 'dob',
                      isEditable: true,
                      dataType: 'date'
                    },{
                      header: 'Active?',
                      modelField: 'active',
                      formatter: booleanFormatter,
                      name: 'active',
                      isEditable: true,
                      dataType: 'boolean'
                    },{
                      header: 'Dues Left',
                      modelField: 'duesLeft',
                      formatter: currencyFormatter,
                      name: 'duesLeft',
                      isEditable: true,
                      dataType: 'currency'
                    },{
                      header: 'Home Phone',
                      modelField: 'phone',
                      formatter: {name:'Phone',options:{}},
                      name: 'phone',
                      isEditable: true,
                      dataType: 'alphanumeric'
                    }
                   ]
                  },
                  model: store
              };
              //create grid
              var grid = new Jx.Grid(options);
              grid.render();

              var editorOptions = {
                useKeyboard : false,
                fieldFormatted : true,
                popup : {
                  use        : true,
                  useLabels  : true,
                  useButtons : true
                },
                fieldOptions : [
                  {
                    field   : 'active',
                    type    : 'Select',
                    options : {
                      comboOpts: [
                        { value: 'true',  text: 'true'  },
                        { value: 'false', text: 'false' }
                      ]
                    }
                  }
                ]
              }

              var editor = new Jx.Plugin.Grid.Editor(editorOptions);
              editor.attach(grid);

            },
            body: "",
            post: function(){

            }
        },
        {
            title: "Grid Editor - Basic Keyboard Test",
            description: "This ist is to verify the basic keyboard features. <br />\n\
                           Press [Tab] and [Shift+Tab] to save and go to the next/previous cell - at the end/beginning of a row, it should jump to the next/previous one at the beginning/end.<br />\n\
                           Press [Arrow-Up/Down] to increase the value in numeric and date fields.<br />\n\
                           Press [Ctrl+Arrow-Up/Down/Left/Right] to abort and go to the upper/lower/left/right cell of the current one.<br />\n\
                           Press [Enter] and [Esc] to save or cancel.<br />\n\
                           Press [Ctrl+Enter] and [Ctrl+Shift+Enter] to save and go one cell down/up - at the bottom/top of a column, it should jump to the top/bottom without switching the column.",
            verify: "Do all keyboard commands work as expected?",
            before: function(){

              document.id('test-grid').empty();

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
                  strategies: [full],
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
                      name: 'id',
                      isEditable: true,
                      dataType: 'numeric'
                    },{
                      header: 'Name',
                      modelField: 'name',
                      formatter: null,
                      name: 'name',
                      isEditable: true,
                      dataType: 'alphanumeric'
                    },{
                      header: 'Date of Birth',
                      modelField: 'dob',
                      formatter: dateFormatter,
                      name: 'dob',
                      isEditable: true,
                      dataType: 'date'
                    },{
                      header: 'Active?',
                      modelField: 'active',
                      formatter: booleanFormatter,
                      name: 'active',
                      isEditable: true,
                      dataType: 'boolean'
                    },{
                      header: 'Dues Left',
                      modelField: 'duesLeft',
                      formatter: currencyFormatter,
                      name: 'duesLeft',
                      isEditable: true,
                      dataType: 'currency'
                    },{
                      header: 'Home Phone',
                      modelField: 'phone',
                      formatter: {name:'Phone',options:{}},
                      name: 'phone',
                      isEditable: true,
                      dataType: 'alphanumeric'
                    }
                   ]
                  },
                  model: store
              };
              //create grid
              var grid = new Jx.Grid(options);
              grid.render();

              var editorOptions = {
                useKeyboard : true,
                fieldFormatted : true,
                popup : {
                  use        : true,
                  useLabels  : true,
                  useButtons : true
                },
                fieldOptions : [
                  {
                    field   : 'active',
                    type    : 'Select',
                    options : {
                      comboOpts: [
                        { value: 'true',  text: 'true'  },
                        { value: 'false', text: 'false' }
                      ]
                    }
                  }
                ]
              }

              var editor = new Jx.Plugin.Grid.Editor(editorOptions);
              editor.attach(grid);

            },
            body: "",
            post: function(){

            }
        }
    ],
    otherScripts: [
      "currency","date","boolean","uri",
      "phone","grid.editor","parser.json",
      "strategy.full","protocol.local","select",
      "text","plugin.field","field.validator",
      "Fx.Tween","button"]
}