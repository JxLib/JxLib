/*
---

name: Jx.Grid.Renderer.Checkbox

description: Renders a checkbox in a column. Can be connected to a store column or as a standalone check column.

license: MIT-style license.

requires:
 - Jx.Grid.Renderer
 - Jx.Field.Checkbox

provides: [Jx.Grid.Renderer.Checkbox]

...
 */
/**
 * Class: Jx.Grid.Renderer.CheckBox
 * Renders a checkbox into the cell. Allows options for connecting the cell
 * to a model field and propogating changes back to the store.
 * 
 * Extends: <Jx.Grid.Renderer>
 * 
 */
define("jx/grid/renderer/checkbox", ['../../../base','../renderer','../../field/checkbox'],
       function(base, Renderer, CheckboxField){
    
    var checkbox = new Class({
  
        Extends: Renderer,
        Family: 'Jx.Grid.Renderer.Checkbox',
        
        Binds: ['onBlur','onChange'],
        
        options: {
            useStore: false,
            field: null,
            updateStore: false,
            checkboxOptions: {
                template : '<input class="jxInputContainer jxInputCheck" type="checkbox" name="{name}"/>',
                name: ''
            }
        },
        
        domInsert: true,
        
        init: function () {
            this.parent();
        },
        
        render: function () {
            this.parent();
            var checkbox = new CheckboxField(this.options.checkboxOptions);
            this.domObj.adopt(document.id(checkbox));
          
            if (this.options.useStore) {
                //set initial state
                checkbox.setValue(this.store.get(this.options.field));
            }
          
            //hook up change and blur events to change store field
            checkbox.addEvents({
                'blur': this.onBlur,
                'change': this.onChange
            });
        },
        
        setColumn: function (column) {
            this.column = column;
          
            if (this.options.useStore) {
                this.store = this.column.grid.getStore();
                this.attached = true;
            }
        },
        
        onBlur: function (field) {
            if (this.options.updateStore) {
                this.updateStore(field);
            }
            this.column.grid.fireEvent('checkBlur',[this.column, field]);
        },
        
        onChange: function (field) {
            if (this.options.updateStore) {
                this.updateStore(field);
            }
            this.fireEvent('change',[this.column, field]);
        },
        
        updateStore: function (field) {
            var newValue = field.getValue();
          
            var data = document.id(field).getParent().retrieve('jxCellData');
            var row = data.row;
          
            if (this.store.get(this.options.field, row) !== newValue) {
                this.store.set(this.options.field, newValue, row);
            }
        }
        
        
    });
        
    if (base.global) {
        base.global.Grid.Renderer.Checkbox = checkbox;
    }
    
    return checkbox;
    
});