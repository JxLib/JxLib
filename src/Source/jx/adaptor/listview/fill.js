/*
---

name: Jx.Adaptor.ListView.Fill

description:

license: MIT-style license.

requires:
 - Jx.Adaptor.ListView
 - Jx.ListItem

provides: [Jx.Adaptor.ListView.Fill]

css:
-

images:
-

...
 */

define("jx/adaptor/listview/fill", ['../../../base','../../adaptor','../../listitem'],
       function(base, Adaptor, ListItem){
    
    var fill = new Class({
    
        
        Extends: Adaptor,
        Family: 'Jx.Adaptor.Listview.Fill',    
        Binds: ['fill'],
    
        name: 'listview.fill',
    
        options: {
            itemTemplate: "<li class='jxListItemContainer'><a class='jxListItem' href='javascript:void(0);'><span class='itemLabel'>{label}</span></a></li>",
            emptyMessage: null
        },
    
        itemColumnsNeeded: null,
    
        init: function () {
            this.parent();
        },
    
        attach: function (listview) {
            this.parent(listview);
    
            this.currentIndex = 0;
    
            this.store.addEvents({
                'storeDataLoaded': this.fill,
                'storeDataLoadFailed': this.fill,
                'storeRecordDeleted': this.fill
            });
            
            listview.addEvent('postRender', function(){
                if (this.store.loaded) {
                    this.fill();
                }
            }.bind(this));
            
        },
    
        detach: function () {
            this.parent();
            this.store.removeEvents({
                'storeDataLoaded': this.fill,
                'storeDataLoadFailed': this.fill,
                'storeRecordDeleted': this.fill
            });
        },
    
        fill: function () {
            this.widget.empty();
    
            if (this.columnsNeeded === undefined || this.columnsNeeded === null || this.columnsNeeded.length == 0) {
                this.columnsNeeded = this.store.parseTemplate(this.options.template);
            }
    
            if (this.itemColumnsNeeded === undefined || this.itemColumnsNeeded === null || this.itemColumnsNeeded.length == 0) {
                this.itemColumnsNeeded = this.store.parseTemplate(this.options.itemTemplate);
            }
    
            var items = [];
    
            var maxRecords = this.store.count();
            if (maxRecords > 0) {
                for (var i = 0; i < maxRecords; i++) {
                    var record = this.store.getRecord(i);
                    var template = this.store.fillTemplate(record, this.options.template, this.columnsNeeded);
                    var o = {item: template};
                    var theTemplate = this.store.fillTemplate(record, this.options.itemTemplate, this.columnsNeeded, o);
                    var item = new ListItem({template:theTemplate});
                    document.id(item).store('storeId',i);
                    items.push(item);
                    this.fireEvent('itemCreated', [item,record]);
                }
            } else {
                var template = "<li class='jxListItemContainer'><a class='jxListItem' href='javascript:void(0);'><span class='itemLabel'>{label}</span></a></li>";
                var o = {
                    label: this.options.emptyMessage
                }
                var theTemplate = new String(template).substitute(o);
                var item = new ListItem({template:theTemplate});
                items.push(item);
            }
    
            this.widget.add(items);
            
        }
    });

    if (base.global) {
        base.global.Adaptor.ListView.Fill = fill;
    }
    
    return fill;
});