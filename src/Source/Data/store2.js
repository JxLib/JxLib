Jx.Compare = {
    'string': function(a,b){
        if (a==b) return 0;
        return a > b ? 1 : -1;
    },
    'int': function(a,b){return a-b;}
};
Jx.Extract = {
    'string':$arguments(0),
    'int':Jx.getNumber
};
Jx.Store = new Class({
    Extends:Jx.Object,
    Family:'Jx.Store',
    data:[],
    columns:[],
    current:0,
    
    initialize: function(options){
        this.parent(options);
        if (this.options.columns){
            $each(this.options.columns, function(column, name){
                this.addColumn(column, name);
            },this);
        }
        if (this.options.data){
            this.setData(this.options.data);
        }
    },
    
    addColumn: function(column, name) {
        var col = {
            'type':column.type || 'string',
            'name':name || column.name || 'col'+this.columns.length,
            'display':column.display || 'Col'+this.columns.length,
            'pos':this.columns.length,
            'extract':column.extract || Jx.Extract[column.type || 'string'],
            'compare':column.compare || Jx.Compare[column.type || 'string'] 
        };
        this.columns.push(col);
    },
    getColumn: function(id){
        if ($type(id) === 'string'){
            for (i=0, l=this.columns.length; i<l; i++){
                if (this.columns[i].name === id){
                    return this.columns[i];
                }
            }
        }
        else {
            return this.columns[id];
        }
    },
    getColumns: function() {
        return this.columns;
    },
    clear: function() {
        this.data = [];
        this.current = 0;
    },
    setData: function(data){
        //console.log('setdata',data);
        this.clear();
        if ($type(data) === 'array'){
            data.each(function(row,i){
                this.addRow(row,i);
            },this);
        }
    },
    addRow: function(row, id){
        //console.log('addrow',row,id);
        if ($type(row)!== 'array' || row.length !== this.columns.length) return;
        var newRow = [];
        row.each(function(value, num){
            var dataCell = {
                value:value,
                sortValue:this.columns[num].extract(value)
            };
            newRow.push(dataCell);
        },this);
        this.data.push(newRow);
        this.fireEvent('rowadded',[newRow]);
    },
    count: function() {
        return this.data.length;
    },
    hasNext: function(){
        return this.current < this.data.length-1;
    },
    next: function() {
        if (this.hasNext()){
            this.current++;
            return true;
        }
        return false;
    },
    rewind: function() {
        this.current = 0;
    },
    getValue: function(col){
        var row = this.data[this.current];
        var column = this.getColumn(col);
        if (!column) return null;
        return row[column.pos].value;
    },
    sort: function(col, desc){
        var column = this.getColumn(col);
        var pos = column.pos;
        var comp = column.compare;
        var compare = function(a,b){
            return comp(a[pos].sortValue, b[pos].sortValue); 
        };
        this.fireEvent('sortstart',[this]);
        this.data.sort(compare);
        if (desc) {
            this.data.reverse();
        }
        this.fireEvent('sort');
    },
    getJsonRequest: function() {
        if (!this.jsonRequest){
            var options = $merge({
                link:'cancel',
                secure:false
                
            },this.options.json || {},
            {
                onSuccess:this.handleJsonSuccess.bind(this),
                onFailed: this.handleJsonFailed.bind(this)
            });
            this.jsonRequest = new Request.JSON(options);
        }
        return this.jsonRequest;
    },
    handleJsonSuccess: function(data,text) {
        //console.log('data',data,text)
        try {
            this.setData(data.data);
            this.fireEvent('loadsuccess',[this]);  
        }
        catch(e){
            this.fireEvent('loadfailed',[this]);
        }
    },
    handleJsonFailed: function(){
        this.fireEvent('loadfailed',[this]);
    },
    loadData: function(data){
        if ($type(data) === 'array'){
            this.handleJsonRequest(data);   
        }
        else {
            this.getJsonRequest().send(data);
        }
    }
});