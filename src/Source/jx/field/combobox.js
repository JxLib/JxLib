/*
---

name: Jx.Field.ComboBox

description: a Combo that shows a paginated Jx.ListView

license: MIT-style license.

requires:
 - Jx.Toolbar.Pager
 - Jx.ListView
 - Jx.Adaptor.ListView.Fill
 - Jx.Button.Flyout
 - Jx.Panel

provides: [Jx.Field.ComboBox]

...
 */
// $Id$
/**
 * Class: Jx.Field.ComboBox
 *
 * A Combo that show a Jx.ListView items from a supplied store to select for the combo.
 * Supports pagination based on the class Jx.Toolbar.Pager
 *
 * Example:
 * (code)
 * new Jx.Field.ComboBox({
 *     label:'ComboBox',
 *     name:'ComboBox',
 *     displayField: 'nombre',
 *     valueField: 'id',
 *     store: store
 * })
 * (end)
 *
 * Extends:
 * <Jx.Field>
 *
 * Author: Ing. Axel Mendoza Pupo.
 *
 * License:
 * Copyright (c) 2011, Ing. Axel Mendoza Pupo.
 *
 * This file is licensed under an MIT style license
 */
define("jx/field/combobox", ['../../base','../field','../listview','../adaptor/listview/fill',
                             '../button/flyout','../toolbar/pager'],
       function(base, Field, ListView, Fill, Flyout, Pager){
    
    var comboBox = new Class({
    
        Extends: Field,
        Family: 'Jx.Field.Combo',            
        pluginNamespace: 'Combo',
    
        options: {
            buttonTemplate: '<a class="jxButtonContainer jxButton" href="javascript:void(0);"><img class="jxButtonIcon" src="'+base.aPixel.src+'"></a>',
            template: '<span class="jxInputContainer"><label class="jxInputLabel"></label><span class="jxInputWrapper"><input type="text" class="jxInputCombo"  name="{name}"><span class="jxInputRevealer"></span></span><span class="jxInputTag"></span></span>',
            itemTemplate: '',
            store: null,
            displayField: null,
            valueField: 'id',
            hiddenValue: null,
            emptyMessage: '',
            onChange: function(field){
                var store = this.options.store;
                var index = store.findByColumn(this.options.displayField, field.getValue());
                var record = this.options.store.getRecord(index);
                this.hiddenValue = store.get(this.options.valueField,index);
            }.bind(this)
         },
    
         type: 'Combo',
    
        /**
         * APIMethod: render
         * create a new instance of Jx.Field.Combo
         */
        init: function () {
            this.hiddenValue = this.options.hiddenValue;
            if (this.options.itemTemplate === undefined ||
                this.options.itemTemplate === null ||
                this.options.itemTemplate == '') {
                this.options.itemTemplate = '{'+this.options.displayField +'}';
            }
            this.parent();
        },
    
        getValue: function(){
            if(this.hiddenValue == null) {
                return this.field.value;
            }
            return this.hiddenValue;
        },
        
        render: function() {
            this.classes = Object.merge({},this.classes, {
              wrapper: 'jxInputWrapper',
              revealer: 'jxInputRevealer',
              icon: 'jxInputIcon'
            });
            this.parent();
    
            //use ListView.Fill adaptor
            this.adaptor = new Fill({
                itemTemplate: "<li class='jxListItemContainer'><a class='jxListItem' href='javascript:void(0);'>{item}</a></li>",
                template: this.options.itemTemplate,
                emptyMessage: this.options.emptyMessage,
                store: this.options.store
            });
            
            this.listView = new ListView({
                plugins: [this.adaptor]        
            });
    
            var button = new Flyout({
                template: this.options.buttonTemplate,
                imageClass: 'jxInputRevealerIcon',
                positionElement: this.field,
                content: new Jx.Panel({
                    width: 260,
                    height: 240,
                    collapse: false,
                    hideTitle: true,
                    content: this.listView,
                    toolbars: [
                        new Pager({
                                store: this.options.store,
                                position: 'bottom',
                                align: 'left',
                                paginationOptions: {
                                    ignoreExpiration: true
                                },
                        })
                    ]
                })
    
            }).addTo(this.revealer);
    
    
    
            this.listView.addEvent('click',function(jx,listview,el){
                button.hide();
                var idx = document.id(jx).retrieve('storeId').toInt();
                this.setValue(this.options.store.get(this.options.displayField,idx));
                this.hiddenValue = this.options.store.get(this.options.valueField, idx);
            }.bind(this));
        }
    
    });
    
    if (base.global) {
        base.global.Field.ComboBox = comboBox;
    }
    
    return comboBox;
    
});