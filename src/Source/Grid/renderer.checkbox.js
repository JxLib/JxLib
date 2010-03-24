/**
 * Class: Jx.Grid.Renderer.CheckBox
 * Renders a checkbox into the cell. Allows options for connecting the cell
 * to a model field and propogating changes back to the store.
 * 
 * Extends: <Jx.Grid.Renderer>
 * 
 */
Jx.Grid.Renderer.Checkbox = new Class({
	
	Family: 'Jx.Grid.Renderer.Checkbox',
	Extends: Jx.Grid.Renderer,
	
	Binds: ['onBlur','onChange'],
	
	options: {
		useStore: false,
		field: null,
		updateStore: false,
		checkboxOptions: {
			template : '<span class="jxGridCellContent jxInputContainer"><input class="jxInputCheck" type="checkbox" name="{name}"/></span>',
			name: ''
		}
	},
	
	
	init: function () {
		this.parent();
		
		
	},
	
	render: function () {
		var checkbox = new Jx.Field.Checkbox(this.options.checkboxOptions);
		this.domObj = $(checkbox);
		
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
			this.store = this.column.grid.getModel();
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
		this.column.grid.fireEvent('checkBlur',[this.column, field]);
	},
	
	updateStore: function (field) {
		var newValue = field.getValue();
		
		var data = $(field).getParent().retrieve('jxCellData');
		var row = data.row;
		
		if (this.store.get(this.options.field, row) !== newValue) {
			this.store.set(this.options.field, newValue, row);
		}
	}
	
	
});